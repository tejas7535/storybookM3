import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../../shared/services/rest/quotation/models/get-quotations-response.interface';
import { QuotationService } from '../../../../shared/services/rest/quotation/quotation.service';
import {
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  updateCasesStatusFailure,
  updateCasesStatusSuccess,
  updateCaseStatus,
} from '../../actions';
import { ActiveCaseActions } from '../../active-case';
import { getDisplayStatus } from '../../selectors';
import { ViewCasesEffect } from './view-cases.effects';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('View Cases Effects', () => {
  let spectator: SpectatorService<ViewCasesEffect>;
  let action: any;
  let actions$: any;
  let effects: ViewCasesEffect;
  let quotationService: QuotationService;
  let snackBar: MatSnackBar;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ViewCasesEffect,
    imports: [
      MatSnackBarModule,
      RouterTestingModule.withRoutes([]),
      HttpClientTestingModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockActions(() => actions$),
      provideMockStore(),
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ViewCasesEffect);
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
        const result = loadCases({ status: QuotationStatus.ACTIVE });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.getCases$).toBeObservable(expected);
      })
    );
  });
  describe('loadCases', () => {
    beforeEach(() => {
      action = loadCases({ status: QuotationStatus.ACTIVE });
    });

    test(
      'should return loadCases Success',
      marbles((m) => {
        const getQuotationsResponse: GetQuotationsResponse = {
          activeCount: 0,
          inactiveCount: 0,
          quotations: [],
          statusTypeOfListedQuotation: QuotationStatus[QuotationStatus.ACTIVE],
        };

        const result = loadCasesSuccess({ response: getQuotationsResponse });
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

        const result = loadCasesFailure({ errorMessage });

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
    describe('update to Inactive', () => {
      beforeEach(() => {
        const gqIds = [1];
        const status = QuotationStatus.INACTIVE;
        action = updateCaseStatus({ gqIds, status });
      });
      test(
        'should return deleteCaseSuccess (status inactive)',
        marbles((m) => {
          snackBar.open = jest.fn();
          quotationService.updateCases = jest.fn(() => response);

          actions$ = m.hot('-a', { a: action });

          const response = m.cold('-a|');
          const expected = m.cold('--(bc))', {
            b: ActiveCaseActions.clearActiveQuotation(),
            c: updateCasesStatusSuccess({ gqIds: action.gqIds }),
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
        action = updateCaseStatus({ gqIds, status });
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
            c: updateCasesStatusSuccess({ gqIds: action.gqIds }),
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
        action = updateCaseStatus({ gqIds, status });
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
            c: updateCasesStatusSuccess({ gqIds: action.gqIds }),
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

        const result = updateCasesStatusFailure({ errorMessage });

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
      store.overrideSelector(getDisplayStatus, QuotationStatus.ACTIVE);
      action = updateCasesStatusSuccess({ gqIds: [1] });
    });
    test(
      'Should call loadCases$ Action',
      marbles((m) => {
        snackBar.open = jest.fn();
        quotationService.updateCases = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });

        const result = loadCases({ status: QuotationStatus.ACTIVE });
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
