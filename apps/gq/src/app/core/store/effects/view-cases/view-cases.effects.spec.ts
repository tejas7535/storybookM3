import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { marbles } from 'rxjs-marbles';

import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';
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
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ViewCasesEffect);
    quotationService = spectator.inject(QuotationService);
    snackBar = spectator.inject(MatSnackBar);
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
        const result = loadCases();

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.getCases$).toBeObservable(expected);
      })
    );
  });
  describe('loadCases', () => {
    beforeEach(() => {
      action = loadCases();
    });

    test(
      'should return loadCases Success',
      marbles((m) => {
        const quotations: any = [];

        const result = loadCasesSuccess({ quotations });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: quotations,
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
  describe('deleteCase$', () => {
    beforeEach(() => {
      const gqIds = [1];
      action = deleteCase({ gqIds });
    });
    test(
      'should return deleteCaseSuccess',
      marbles((m) => {
        snackBar.open = jest.fn();
        quotationService.deleteCases = jest.fn(() => response);

        const result = deleteCasesSuccess();
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|');
        const expected = m.cold('--b', { b: result });

        m.expect(effects.deleteCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.deleteCases).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'should return deleteCaseFailure',
      marbles((m) => {
        const errorMessage = 'new Error';
        actions$ = m.hot('-a', { a: action });

        const result = deleteCasesFailure({ errorMessage });

        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        quotationService.deleteCases = jest.fn(() => response);

        m.expect(effects.deleteCase$).toBeObservable(expected);
        m.flush();

        expect(quotationService.deleteCases).toHaveBeenCalledTimes(1);
      })
    );
  });
});
