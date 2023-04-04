import { MatSnackBarModule } from '@angular/material/snack-bar';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  CalculationParametersActions,
  CalculationResultActions,
} from '../../actions';
import { CalculationParametersEffects } from './calculation-parameters.effects';

describe('Calculation Parameters Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationParametersEffects;
  let spectator: SpectatorService<CalculationParametersEffects>;

  const createService = createServiceFactory({
    service: CalculationParametersEffects,
    imports: [MatSnackBarModule],
    providers: [provideMockActions(() => actions$), provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationParametersEffects);
  });

  describe('operatingParameters$', () => {
    it('should dispatch createModel action if operating parameters are being set', () =>
      marbles((m) => {
        action = CalculationParametersActions.operatingParameters({
          operationConditions: {},
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('- 250ms b', {
          b: CalculationResultActions.createModel(),
        });

        m.expect(effects.operatingParameters$).toBeObservable(expected);
        m.flush();
      })());
  });
});
