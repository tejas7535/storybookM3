import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
} from '../../actions';
import { CalculationParametersEffects } from './calculation-parameters.effects';

describe('Calculation Parameters Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationParametersEffects;
  let spectator: SpectatorService<CalculationParametersEffects>;

  const createService = createServiceFactory({
    service: CalculationParametersEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationParametersEffects);
  });

  describe('operatingParameters$', () => {
    it('should dispatch calculation actions if operating parameters are being set', () =>
      marbles((m) => {
        action = CalculationParametersActions.operatingParameters({
          operationConditions: {},
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('- 250ms c', {
          c: CatalogCalculationResultActions.fetchCalculationResult(),
        });

        m.expect(effects.operatingParameters$).toBeObservable(expected);
        m.flush();
      })());
  });
});
