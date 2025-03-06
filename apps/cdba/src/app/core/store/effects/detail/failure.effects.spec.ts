import { provideRouter, Router } from '@angular/router';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';
import { UserInteractionService } from '@cdba/user-interaction/service/user-interaction.service';

import {
  loadBomFailure,
  loadCalculationsFailure,
  loadCostComponentSplitFailure,
  loadDrawingsFailure,
  loadReferenceTypeFailure,
  showSnackBar,
} from '../../actions';
import { FailureEffects } from './failure.effects';

describe('FailureEffects', () => {
  let spectator: SpectatorService<FailureEffects>;
  let actions$: any;
  let effects: FailureEffects;
  let router: Router;

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
      mockProvider(UserInteractionService),
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
        const loadBomForbiddenFailureAction = loadBomFailure(forbiddenError);
        const loadCalculationsForbiddenFailureAction =
          loadCalculationsFailure(forbiddenError);
        const loadDrawingsForbiddenFailureAction =
          loadDrawingsFailure(forbiddenError);
        const loadReferenceTypeForbiddenFailureAction =
          loadReferenceTypeFailure(forbiddenError);
        const loadCostComponentSplitFailureAction =
          loadCostComponentSplitFailure(forbiddenError);

        actions$ = m.hot('-a-b-c-d-e', {
          a: loadBomForbiddenFailureAction,
          b: loadCalculationsForbiddenFailureAction,
          c: loadDrawingsForbiddenFailureAction,
          d: loadReferenceTypeForbiddenFailureAction,
          e: loadCostComponentSplitFailureAction,
        });

        const expected = m.cold('');

        m.expect(effects.loadFailure$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledTimes(5);
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

        const loadBomServerFailureAction = loadBomFailure(serverError);
        const loadCalculationsServerFailureAction =
          loadCalculationsFailure(serverError);
        const loadDrawingsServerFailureAction =
          loadDrawingsFailure(serverError);
        const loadReferenceTypeServernFailureAction =
          loadReferenceTypeFailure(serverError);
        const loadCostComponentSplitFailureAction =
          loadCostComponentSplitFailure(serverError);

        actions$ = m.hot('-a-b-c-d-e', {
          a: loadBomServerFailureAction,
          b: loadCalculationsServerFailureAction,
          c: loadDrawingsServerFailureAction,
          d: loadReferenceTypeServernFailureAction,
          e: loadCostComponentSplitFailureAction,
        });

        const expected = m.cold('-a-a-a-a-a', { a: showSnackBarAction });

        m.expect(effects.loadFailure$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
