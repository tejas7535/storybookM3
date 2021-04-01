import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';

import { ENV_CONFIG } from '@schaeffler/http';
import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { QuotationService } from '../../../../shared/services/rest-services/quotation-service/quotation.service';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';
import { ViewCasesEffect } from './view-cases.effect';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('View Cases Effects', () => {
  let spectator: SpectatorService<ViewCasesEffect>;
  let action: any;
  let actions$: any;
  let effects: ViewCasesEffect;
  let quotationService: QuotationService;
  let snackBarService: SnackBarService;

  const createService = createServiceFactory({
    service: ViewCasesEffect,
    imports: [
      SnackBarModule,
      RouterTestingModule.withRoutes([]),
      HttpClientTestingModule,
    ],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: QuotationService,
        useValue: {
          getCases: jest.fn(),
          deleteCase: jest.fn(),
        },
      },
      {
        provide: ENV_CONFIG,
        useValue: {
          environment: {
            baseUrl: '',
          },
        },
      },
    ],
  });
  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ViewCasesEffect);
    quotationService = spectator.inject(QuotationService);
    snackBarService = spectator.inject(SnackBarService);
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
    test('should dispatch loadCases', () => {
      const result = loadCases();

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.getCases$).toBeObservable(expected);
    });
  });
  describe('loadCases', () => {
    beforeEach(() => {
      action = loadCases();
    });

    test('should return loadCases Success', () => {
      quotationService.getCases = jest.fn(() => response);
      const quotations: any = [];

      const result = loadCasesSuccess({ quotations });
      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: quotations,
      });
      const expected = cold('--b', { b: result });

      expect(effects.loadCases$).toBeObservable(expected);
      expect(quotationService.getCases).toHaveBeenCalledTimes(1);
    });

    test('should return loadCasesFailure', () => {
      const errorMessage = 'new Error';
      actions$ = hot('-a', { a: action });

      const result = loadCasesFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationService.getCases = jest.fn(() => response);

      expect(effects.loadCases$).toBeObservable(expected);
      expect(quotationService.getCases).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteCase$', () => {
    beforeEach(() => {
      const gqIds = ['1'];
      action = deleteCase({ gqIds });
    });
    test('should return deleteCaseSuccess', () => {
      snackBarService.showSuccessMessage = jest.fn();
      quotationService.deleteCases = jest.fn(() => response);

      const result = deleteCasesSuccess();
      actions$ = hot('-a', { a: action });

      const response = cold('-a|');
      const expected = cold('--b', { b: result });

      expect(effects.deleteCase$).toBeObservable(expected);
      expect(quotationService.deleteCases).toHaveBeenCalledTimes(1);
      expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    test('should return deleteCaseFailure', () => {
      const errorMessage = 'new Error';
      actions$ = hot('-a', { a: action });

      const result = deleteCasesFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      quotationService.deleteCases = jest.fn(() => response);

      expect(effects.deleteCase$).toBeObservable(expected);
      expect(quotationService.deleteCases).toHaveBeenCalledTimes(1);
    });
  });
});
