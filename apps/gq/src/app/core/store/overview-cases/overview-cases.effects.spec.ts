import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { GET_QUOTATIONS_RESPONSE_MOCK } from '../../../../testing/mocks';
import { ActiveCaseActions } from '../active-case';
import { OverviewCasesActions } from './overview-cases.actions';
import { OverviewCasesEffects } from './overview-cases.effects';
import * as fromOverviewCasesSelector from './overview-cases.selectors';

describe('Overview Cases Effects', () => {
  let spectator: SpectatorService<OverviewCasesEffects>;
  let action: any;
  let actions$: any;
  let effects: OverviewCasesEffects;
  let quotationService: QuotationService;
  let snackBar: MatSnackBar;
  let store: MockStore;

  const createService = createServiceFactory({
    service: OverviewCasesEffects,
    imports: [
      MatSnackBarModule,
      RouterTestingModule.withRoutes([]),
      HttpClientTestingModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore({}),
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(OverviewCasesEffects);
    quotationService = spectator.inject(QuotationService);
    snackBar = spectator.inject(MatSnackBar);
    store = spectator.inject(MockStore);
  });

  describe('getCases$', () => {
    beforeEach(() => {
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/case-view',
          },
        },
      };
    });
    test(
      'should dispatch loadCases',
      marbles((m) => {
        const result = OverviewCasesActions.loadCases({
          status: QuotationStatus.ACTIVE,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.getCases$).toBeObservable(expected);
      })
    );
  });
  describe('loadCasesForView$', () => {
    beforeEach(() => {
      action = OverviewCasesActions.loadCasesForView({ viewId: 2 });
    });

    test(
      'should return loadCases',
      marbles((m) => {
        jest
          .spyOn(fromOverviewCasesSelector, 'getQuotationStatusFromView')
          .mockImplementation(
            () =>
              createSelector(
                () => {},
                () => QuotationStatus.ACTIVE
              ) as any
          );

        const result = OverviewCasesActions.loadCases({
          status: QuotationStatus.ACTIVE,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadCasesForView$).toBeObservable(expected);
        m.flush();
      })
    );
  });
  describe('loadCases', () => {
    beforeEach(() => {
      action = OverviewCasesActions.loadCases({
        status: QuotationStatus.ACTIVE,
      });
    });

    test(
      'should return loadCases Success',
      marbles((m) => {
        const getQuotationsResponse: GetQuotationsResponse =
          GET_QUOTATIONS_RESPONSE_MOCK;

        const result = OverviewCasesActions.loadCasesSuccess({
          response: getQuotationsResponse,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: getQuotationsResponse,
        });
        quotationService.getCases = jest.fn(() => response);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCases$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getCases).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return loadCasesFailure',
      marbles((m) => {
        const errorMessage = 'new Error';
        actions$ = m.hot('-a', { a: action });

        const result = OverviewCasesActions.loadCasesFailure({ errorMessage });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.getCases = jest.fn(() => response);

        m.expect(effects.loadCases$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getCases).toHaveBeenCalledTimes(1);
      })
    );
  });
  describe('updateCaseStatus$', () => {
    describe('update to archived', () => {
      beforeEach(() => {
        const gqIds = [1];
        const status = QuotationStatus.ARCHIVED;
        action = OverviewCasesActions.updateCasesStatus({ gqIds, status });
      });
      test(
        'should return deleteCaseSuccess (status archived)',
        marbles((m) => {
          snackBar.open = jest.fn();
          quotationService.updateCases = jest.fn(() => response);

          actions$ = m.hot('-a', { a: action });

          const response = m.cold('-a|');
          const expected = m.cold('--(bc))', {
            b: ActiveCaseActions.clearActiveQuotation(),
            c: OverviewCasesActions.updateCasesStatusSuccess({
              gqIds: action.gqIds,
            }),
          });

          m.expect(effects.updateCasesStatus$).toBeObservable(expected);
          m.flush();

          expect(quotationService.updateCases).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledTimes(1);
        })
      );
    });

    describe('update to active', () => {
      beforeEach(() => {
        const gqIds = [1];
        const status = QuotationStatus.ACTIVE;
        action = OverviewCasesActions.updateCasesStatus({ gqIds, status });
      });
      test(
        'should return deleteCaseSuccess (status active)',
        marbles((m) => {
          snackBar.open = jest.fn();
          quotationService.updateCases = jest.fn(() => response);

          actions$ = m.hot('-a', { a: action });

          const response = m.cold('-a|');
          const expected = m.cold('--(bc))', {
            b: ActiveCaseActions.clearActiveQuotation(),
            c: OverviewCasesActions.updateCasesStatusSuccess({
              gqIds: action.gqIds,
            }),
          });

          m.expect(effects.updateCasesStatus$).toBeObservable(expected);
          m.flush();

          expect(quotationService.updateCases).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledTimes(1);
        })
      );
    });

    describe('update to deleted', () => {
      beforeEach(() => {
        const gqIds = [1];
        const status = QuotationStatus.DELETED;
        action = OverviewCasesActions.updateCasesStatus({ gqIds, status });
      });
      test(
        'should return deleteCaseSuccess (status deleted)',
        marbles((m) => {
          snackBar.open = jest.fn();
          quotationService.updateCases = jest.fn(() => response);

          actions$ = m.hot('-a', { a: action });

          const response = m.cold('-a|');
          const expected = m.cold('--(bc))', {
            b: ActiveCaseActions.clearActiveQuotation(),
            c: OverviewCasesActions.updateCasesStatusSuccess({
              gqIds: action.gqIds,
            }),
          });

          m.expect(effects.updateCasesStatus$).toBeObservable(expected);
          m.flush();

          expect(quotationService.updateCases).toHaveBeenCalledTimes(1);
          expect(snackBar.open).toHaveBeenCalledTimes(1);
        })
      );
    });
    test(
      'should return deleteCaseFailure',
      marbles((m) => {
        const errorMessage = 'new Error';
        actions$ = m.hot('-a', { a: action });

        const result = OverviewCasesActions.updateCasesStatusFailure({
          errorMessage,
        });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.updateCases = jest.fn(() => response);

        m.expect(effects.updateCasesStatus$).toBeObservable(expected);
        m.flush();

        expect(quotationService.updateCases).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('loadCasesAfterUpdatingStatus', () => {
    beforeEach(() => {
      store.overrideSelector(
        fromOverviewCasesSelector.getDisplayStatus,
        QuotationStatus.ACTIVE
      );
      action = OverviewCasesActions.updateCasesStatusSuccess({ gqIds: [1] });
    });
    test(
      'Should call loadCases$ Action',
      marbles((m) => {
        snackBar.open = jest.fn();
        quotationService.updateCases = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });

        const result = OverviewCasesActions.loadCases({
          status: QuotationStatus.ACTIVE,
        });
        const response = m.cold('-a|');
        const expected = m.cold('-b', {
          b: result,
        });

        m.expect(effects.loadCasesAfterUpdatingStatus$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });
});
