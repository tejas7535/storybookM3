import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of, throwError } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { SapSyncStatusEffects } from '@gq/core/store/active-case/sap-sync-status/sap-sync-status.effects';
import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { SapCallInProgress } from '@gq/shared/models/quotation';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { getGqId, getSapId } from '../active-case.selectors';

describe('SapSyncStatusEffects', () => {
  let spectator: SpectatorService<SapSyncStatusEffects>;
  let action: any;
  let actions$: any;
  let effects: SapSyncStatusEffects;
  let store: MockStore;
  let quotationService: QuotationService;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: SapSyncStatusEffects,

    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMockActions(() => actions$),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SapSyncStatusEffects);
    quotationService = spectator.inject(QuotationService);
    store = spectator.inject(MockStore);
  });

  describe('getSapSyncStatus$', () => {
    test(
      'should return getSapSyncStatusSuccess when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatus();
        quotationService.getSapSyncStatus = jest.fn(() => response);
        store.overrideSelector(getGqId, 123);
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING,
          sapCallInProgress: SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS,
          quotationDetailSapSyncStatusList: [
            {
              gqPositionId: '123',
              sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING,
            },
          ],
        };
        const result = ActiveCaseActions.getSapSyncStatusSuccess({
          result: responseObject,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: responseObject });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
      })
    );
    test(
      'should return success and completed when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatus();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(getSapId, '800000');

        quotationService.getSapSyncStatus = jest.fn(() => response);
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '800000',
          sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: responseObject });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.getSapSyncStatusSuccess({
            result: responseObject,
          }),
          c: ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted(),
        });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
      })
    );
    test(
      'should return success and completed when REST call is successful for status partially synced',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatus();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(getSapId, '800000');

        quotationService.getSapSyncStatus = jest.fn(() => response);
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '800000',
          sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
          sapCallInProgress: SapCallInProgress.NONE_IN_PROGRESS,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: responseObject });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.getSapSyncStatusSuccess({
            result: responseObject,
          }),
          c: ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted(),
        });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
      })
    );
    test('should return getSapSyncStatusFailure on REST error', () => {
      action = ActiveCaseActions.getSapSyncStatus();
      quotationService.getSapSyncStatus = jest.fn(() => response);
      store.overrideSelector(getGqId, 123);
      const responseObject: QuotationSapSyncStatusResult = {
        sapId: '12345',
        sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
        sapCallInProgress: SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS,
        quotationDetailSapSyncStatusList: [
          { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
        ],
      };

      actions$ = of(action);
      const response = throwError(errorMessage);

      effects.getSapSyncStatus$.subscribe((res) => {
        expect(res).toEqual(responseObject);
      });
      expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
      expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
    });
  });
});
