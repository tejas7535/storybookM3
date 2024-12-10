import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of, throwError } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { SapSyncStatusEffects } from '@gq/core/store/active-case/sap-sync-status/sap-sync-status.effects';
import { SAP_SYNC_STATUS } from '@gq/shared/models';
import { QuotationSapSyncStatusResult } from '@gq/shared/models/quotation/quotation-sap-sync-status-result.model';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { translate } from '@jsverse/transloco';
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
  let snackBar: MatSnackBar;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: SapSyncStatusEffects,
    imports: [MatSnackBarModule],
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
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('getSapSyncStatus$', () => {
    test(
      'should return getSapSyncStatusSuccess when REST call is successful on the second call',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatusInInterval();
        quotationService.getSapSyncStatus = jest.fn(() => response);
        store.overrideSelector(getGqId, 123);
        effects['showUploadSelectionToast'] = jest.fn();
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING,
          quotationDetailSapSyncStatusList: [
            {
              gqPositionId: '123',
              sapSyncStatus: SAP_SYNC_STATUS.SYNC_PENDING,
            },
          ],
        };
        const finalResponseObject: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          quotationDetailSapSyncStatusList: [
            {
              gqPositionId: '123',
              sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
            },
          ],
        };

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-ab|', {
          a: responseObject,
          b: finalResponseObject,
        });
        const expected = m.cold('--a(bc)', {
          a: ActiveCaseActions.getSapSyncStatusSuccess({
            result: responseObject,
          }),
          b: ActiveCaseActions.getSapSyncStatusSuccess({
            result: finalResponseObject,
          }),
          c: ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted({
            result: finalResponseObject,
          }),
        });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(2);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledTimes(1);
      })
    );
    test(
      'should return success and completed when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatusInInterval();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(getSapId, '800000');

        quotationService.getSapSyncStatus = jest.fn(() => response);
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '800000',
          sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };
        effects['showUploadSelectionToast'] = jest.fn();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: responseObject });
        const expected = m.cold('--(bc)', {
          b: ActiveCaseActions.getSapSyncStatusSuccess({
            result: responseObject,
          }),
          c: ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted({
            result: responseObject,
          }),
        });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledTimes(1);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledWith(
          SAP_SYNC_STATUS.SYNCED
        );
      })
    );
    test(
      'should return success and completed when REST call is successful for status partially synced',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatusInInterval();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(getSapId, '800000');
        effects['showUploadSelectionToast'] = jest.fn();

        quotationService.getSapSyncStatus = jest.fn(() => response);
        const responseObject: QuotationSapSyncStatusResult = {
          sapId: '800000',
          sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
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
          c: ActiveCaseActions.getSapSyncStatusSuccessFullyCompleted({
            result: responseObject,
          }),
        });

        m.expect(effects.getSapSyncStatus$).toBeObservable(expected);
        m.flush();
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledTimes(1);
        expect(quotationService.getSapSyncStatus).toHaveBeenCalledWith(123);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledTimes(1);
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledWith(
          SAP_SYNC_STATUS.PARTIALLY_SYNCED
        );
      })
    );
    test('should return getSapSyncStatusFailure on REST error', () => {
      action = ActiveCaseActions.getSapSyncStatusInInterval();
      quotationService.getSapSyncStatus = jest.fn(() => response);
      store.overrideSelector(getGqId, 123);
      const responseObject: QuotationSapSyncStatusResult = {
        sapId: '12345',
        sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
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

  describe('showUploadSelectionToast', () => {
    test('should return failed toast message on default', () => {
      snackBar.open = jest.fn();

      effects['showUploadSelectionToast'](SAP_SYNC_STATUS.SYNC_FAILED);

      expect(snackBar.open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.uploadToSapSync.failed`)
      );
    });

    test('should return full toast message on SYNCED', () => {
      snackBar.open = jest.fn();

      effects['showUploadSelectionToast'](SAP_SYNC_STATUS.SYNCED);

      expect(snackBar.open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.uploadToSapSync.full`)
      );
    });

    test('should return partially toast message on PARTIALLY_SYNCED', () => {
      snackBar.open = jest.fn();

      effects['showUploadSelectionToast'](SAP_SYNC_STATUS.PARTIALLY_SYNCED);

      expect(snackBar.open).toHaveBeenCalledWith(
        translate(`shared.snackBarMessages.uploadToSapSync.partially`)
      );
    });
  });
});
