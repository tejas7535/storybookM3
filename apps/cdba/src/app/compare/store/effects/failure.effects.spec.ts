import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpErrorService } from '@cdba/core/http/services/http-error.service';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  loadBomFailure,
  loadCalculationHistoryFailure,
  loadCostComponentSplitFailure,
  loadProductDetailsFailure,
} from '../actions';
import { FailureEffects } from './failure.effects';

describe('FailureEffects', () => {
  let spectator: SpectatorService<FailureEffects>;
  let actions$: any;
  let effects: FailureEffects;
  let metadata: EffectsMetadata<FailureEffects>;
  let httpErrorService: HttpErrorService;
  let router: Router;

  const index = 0;
  const forbiddenError = { statusCode: 403, errorMessage: 'Forbidden Action' };
  const serverError = {
    statusCode: 500,
    errorMessage: 'Internal Server Error',
  };

  const createService = createServiceFactory({
    service: FailureEffects,
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
    effects = spectator.inject(FailureEffects);
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
          ...forbiddenError,
        });

        const loadCalculationHistoryForbiddenFailureAction =
          loadCalculationHistoryFailure({
            index,
            ...forbiddenError,
          });

        const loadProductDetailsForbiddenFailureAction =
          loadProductDetailsFailure({
            index,
            ...forbiddenError,
          });

        const loadCostComponentSplitForbiddenFailureAction =
          loadCostComponentSplitFailure({
            index,
            ...forbiddenError,
          });

        actions$ = m.hot('-a-b-c-d', {
          a: loadBomForbiddenFailureAction,
          b: loadCalculationHistoryForbiddenFailureAction,
          c: loadProductDetailsForbiddenFailureAction,
          d: loadCostComponentSplitForbiddenFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(router.navigate).toBeCalledTimes(4);
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
          ...serverError,
        });

        const loadCalculationHistoryServerFailureAction =
          loadCalculationHistoryFailure({
            index,
            ...serverError,
          });

        const loadProductDetailsServerFailureAction = loadProductDetailsFailure(
          {
            index,
            ...serverError,
          }
        );

        const loadCostComponentSplitServerFailureAction =
          loadCostComponentSplitFailure({
            index,
            ...serverError,
          });

        actions$ = m.hot('-a-b-c-d', {
          a: loadBomServerFailureAction,
          b: loadCalculationHistoryServerFailureAction,
          c: loadProductDetailsServerFailureAction,
          d: loadCostComponentSplitServerFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(httpErrorService.handleHttpErrorDefault).toBeCalledTimes(4);
      })
    );
  });
});
