import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';

import { ENV_CONFIG } from '@schaeffler/http';

import { DeleteCaseService } from '../../../../case-view/services/delete-case.service';
import { ViewCasesService } from '../../../../case-view/services/view-cases.service';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';
import { ViewCasesEffect } from './view-cases.effect';

describe('View Cases Effects', () => {
  let spectator: SpectatorService<ViewCasesEffect>;
  let action: any;
  let actions$: any;
  let effects: ViewCasesEffect;
  let viewCasesService: ViewCasesService;
  let deleteCasesService: DeleteCaseService;

  const createService = createServiceFactory({
    service: ViewCasesEffect,
    imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: ViewCasesService,
        useValue: {
          getCases: jest.fn(),
        },
      },
      {
        provide: DeleteCaseService,
        useValue: {
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
    viewCasesService = spectator.inject(ViewCasesService);
    deleteCasesService = spectator.inject(DeleteCaseService);
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
      viewCasesService.getCases = jest.fn(() => response);
      const quotations: any = [];

      const result = loadCasesSuccess({ quotations });
      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: quotations,
      });
      const expected = cold('--b', { b: result });

      expect(effects.loadCases$).toBeObservable(expected);
      expect(viewCasesService.getCases).toHaveBeenCalledTimes(1);
    });

    test('should return loadCasesFailure', () => {
      const errorMessage = 'new Error';
      actions$ = hot('-a', { a: action });

      const result = loadCasesFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      viewCasesService.getCases = jest.fn(() => response);

      expect(effects.loadCases$).toBeObservable(expected);
      expect(viewCasesService.getCases).toHaveBeenCalledTimes(1);
    });
  });
  describe('deleteCase$', () => {
    beforeEach(() => {
      const gqIds = ['1'];
      action = deleteCase({ gqIds });
    });
    test('should return deleteCaseSuccess', () => {
      deleteCasesService.deleteCase = jest.fn(() => response);

      const result = deleteCasesSuccess();
      actions$ = hot('-a', { a: action });

      const response = cold('-a|');
      const expected = cold('--b', { b: result });

      expect(effects.deleteCase$).toBeObservable(expected);
      expect(deleteCasesService.deleteCase).toHaveBeenCalledTimes(1);
    });

    test('should return deleteCaseFailure', () => {
      const errorMessage = 'new Error';
      actions$ = hot('-a', { a: action });

      const result = deleteCasesFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      deleteCasesService.deleteCase = jest.fn(() => response);

      expect(effects.deleteCase$).toBeObservable(expected);
      expect(deleteCasesService.deleteCase).toHaveBeenCalledTimes(1);
    });
  });
});
