import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { marbles } from 'rxjs-marbles';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { HttpErrorService } from '@cdba/core/http/services/http-error.service';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import {
  loadBomFailure,
  loadCalculationHistoryFailure,
  loadProductDetailsFailure,
} from '../actions/compare.actions';
import { CompareFailureEffects } from './compare-failure.effects';

describe('CompareFailureEffects', () => {
  let spectator: SpectatorService<CompareFailureEffects>;
  let actions$: any;
  let effects: CompareFailureEffects;
  let metadata: EffectsMetadata<CompareFailureEffects>;
  let httpErrorService: HttpErrorService;
  let router: Router;

  const index = 0;
  const forbiddenError = JSON.stringify(new HttpErrorResponse({ status: 403 }));
  const serverError = JSON.stringify(new HttpErrorResponse({ status: 500 }));

  const createService = createServiceFactory({
    service: CompareFailureEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          compare: COMPARE_STATE_MOCK,
        },
      }),
      mockProvider(HttpErrorService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CompareFailureEffects);
    metadata = getEffectsMetadata(effects);
    httpErrorService = spectator.inject(HttpErrorService);
    router = spectator.inject(Router);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadFailure$', () => {
    test('should not return an action', () => {
      expect(metadata.loadFailure$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test(
      'should navigate to forbidden page',
      marbles((m) => {
        router.navigate = jest.fn().mockImplementation();

        const loadBomForbiddenFailureAction = loadBomFailure({
          index,
          error: forbiddenError,
        });

        const loadCalculationHistoryForbiddenFailureAction =
          loadCalculationHistoryFailure({
            index,
            error: forbiddenError,
          });

        const loadProductDetailsForbiddenFailureAction =
          loadProductDetailsFailure({
            index,
            error: forbiddenError,
          });

        actions$ = m.hot('-a-b-c', {
          a: loadBomForbiddenFailureAction,
          b: loadCalculationHistoryForbiddenFailureAction,
          c: loadProductDetailsForbiddenFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(router.navigate).toBeCalledTimes(3);
        expect(router.navigate).toHaveBeenCalledWith([
          'empty-states',
          'forbidden',
        ]);
      })
    );

    test(
      'should call default error service',
      marbles((m) => {
        httpErrorService.handleHttpErrorDefault = jest.fn();

        const loadBomServerFailureAction = loadBomFailure({
          index,
          error: serverError,
        });

        const loadCalculationHistoryServerFailureAction =
          loadCalculationHistoryFailure({
            index,
            error: serverError,
          });

        const loadProductDetailsServerFailureAction = loadProductDetailsFailure(
          {
            index,
            error: serverError,
          }
        );

        actions$ = m.hot('-a-b-c', {
          a: loadBomServerFailureAction,
          b: loadCalculationHistoryServerFailureAction,
          c: loadProductDetailsServerFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(httpErrorService.handleHttpErrorDefault).toBeCalledTimes(3);
      })
    );
  });
});
