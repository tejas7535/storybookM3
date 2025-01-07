import { of } from 'rxjs';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  CalculationParametersActions,
  CatalogCalculationResultActions,
  CO2DownstreamCalculationActions,
} from '../../actions';
import { ProductSelectionFacade } from '../../facades';
import { CalculationParametersEffects } from './calculation-parameters.effects';

describe('Calculation Parameters Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationParametersEffects;
  let spectator: SpectatorService<CalculationParametersEffects>;
  let productSelectionFacade: ProductSelectionFacade;

  const createService = createServiceFactory({
    service: CalculationParametersEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      mockProvider(ProductSelectionFacade),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationParametersEffects);
    productSelectionFacade = spectator.inject(ProductSelectionFacade);
  });

  describe('operatingParameters$', () => {
    it('should dispatch calculation actions if operating parameters are being set', () =>
      marbles((m) => {
        productSelectionFacade.isCo2DownstreamCalculationPossible$ = of(true);
        action = CalculationParametersActions.operatingParameters({
          operationConditions: {},
          isValid: true,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('- 250ms (cd)', {
          c: CatalogCalculationResultActions.fetchCalculationResult(),
          d: CO2DownstreamCalculationActions.fetchDownstreamCalculation(),
        });

        m.expect(effects.operatingParameters$).toBeObservable(expected);
        m.flush();
      })());

    it('should dispatch calculation actions without downstream if operating parameters are being set but downstream is not available', () =>
      marbles((m) => {
        productSelectionFacade.isCo2DownstreamCalculationPossible$ = of(false);
        action = CalculationParametersActions.operatingParameters({
          operationConditions: {},
          isValid: true,
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('- 250ms (c)', {
          c: CatalogCalculationResultActions.fetchCalculationResult(),
        });

        m.expect(effects.operatingParameters$).toBeObservable(expected);
        m.flush();
      })());

    it('should not dispatch calculation actions if operating parameters are being set but invalid', () =>
      marbles((m) => {
        productSelectionFacade.isCo2DownstreamCalculationPossible$ = of(false);
        action = CalculationParametersActions.operatingParameters({
          operationConditions: {},
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('');

        m.expect(effects.operatingParameters$).toBeObservable(expected);
        m.flush();
      })());
  });
});
