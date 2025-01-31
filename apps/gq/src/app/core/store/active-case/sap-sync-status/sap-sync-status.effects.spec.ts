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

import { activeCaseFeature } from '../active-case.reducer';
import { getGqId } from '../active-case.selectors';

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
        store.overrideSelector(activeCaseFeature.selectDetailsSyncingToSap, []);
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
        expect(effects['showUploadSelectionToast']).toHaveBeenCalledWith(
          finalResponseObject,
          []
        );
      })
    );
    test(
      'should return success and completed when REST call is successful',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatusInInterval();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(activeCaseFeature.selectDetailsSyncingToSap, []);

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
          responseObject,
          []
        );
      })
    );
    test(
      'should return success and completed when REST call is successful for status partially synced',
      marbles((m) => {
        action = ActiveCaseActions.getSapSyncStatusInInterval();
        store.overrideSelector(getGqId, 123);
        store.overrideSelector(activeCaseFeature.selectDetailsSyncingToSap, []);
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
          responseObject,
          []
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
    describe('translations with info on updating details available', () => {
      test('should call with synced', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };
        const details = ['123'];

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, details);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.full'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
      test('should call with synced scenario 2', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
            { gqPositionId: '124', sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED },
          ],
        };
        const details = ['123'];

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, details);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.full'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
      test('should call with failed', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED },
          ],
        };
        const details = ['123'];

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, details);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.failed'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
      test('should call with partially', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
            { gqPositionId: '1234', sapSyncStatus: SAP_SYNC_STATUS.NOT_SYNCED },
          ],
        };
        const details = ['123', '1234'];

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, details);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.partially'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('translations with info on updating details not available', () => {
      test('should call with synced', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNCED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, []);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.full'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
      test('should call with failed', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNC_FAILED },
            { gqPositionId: '1234', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
          ],
        };

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, []);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.failed'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
      test('should call with partially', () => {
        const syncResult: QuotationSapSyncStatusResult = {
          sapId: '12345',
          sapSyncStatus: SAP_SYNC_STATUS.PARTIALLY_SYNCED,
          quotationDetailSapSyncStatusList: [
            { gqPositionId: '123', sapSyncStatus: SAP_SYNC_STATUS.SYNCED },
            { gqPositionId: '1234', sapSyncStatus: SAP_SYNC_STATUS.NOT_SYNCED },
          ],
        };

        snackBar.open = jest.fn();
        effects['showUploadSelectionToast'](syncResult, []);

        expect(translate).toHaveBeenCalledWith(
          'shared.snackBarMessages.uploadToSapSync.partially'
        );
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      });
    });
  });
});
