import { provideRouter, Router } from '@angular/router';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { showSnackBar } from '@cdba/core/store/actions/user-interaction/user-interaction.actions';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';

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
  let router: Router;

  const index = 0;
  const forbiddenError = { statusCode: 403, errorMessage: 'Forbidden Action' };
  const serverError = {
    statusCode: 500,
    errorMessage: 'Internal Server Error',
  };

  const createService = createServiceFactory({
    service: FailureEffects,
    providers: [
      provideRouter([]),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          compare: COMPARE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(FailureEffects);
    router = spectator.inject(Router);

    router.navigate = jest.fn(() => Promise.resolve(true));
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadFailure$', () => {
    test(
      'should navigate to forbidden page',
      marbles((m) => {
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

        const expected = m.cold('');

        m.expect(effects.loadFailure$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledTimes(4);
        expect(router.navigate).toHaveBeenCalledWith([
          'empty-states',
          'forbidden',
        ]);
      })
    );

    test(
      'should trigger snackbar on server error',
      marbles((m) => {
        const showSnackBarAction = showSnackBar({
          interactionType: InteractionType.HTTP_GENERAL_ERROR,
        });

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

        const expected = m.cold('-a-a-a-a', { a: showSnackBarAction });

        m.expect(effects.loadFailure$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
