import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CALCULATION_RESULT_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import { PROPERTIES } from '../../../../shared/constants';
import { ErrorService, RestService } from '../../../services';
import {
  calculationError,
  calculationSuccess,
  getCalculation,
} from '../../actions/result/result.actions';
import { getCalculationParameters } from '../../selectors/parameter/parameter.selector';
import { ResultEffects } from './result.effects';

describe('ResultEffects', () => {
  let action: any;
  let actions$: any;
  let effects: ResultEffects;
  let metadata: EffectsMetadata<ResultEffects>;
  let spectator: SpectatorService<ResultEffects>;
  let restService: RestService;
  let errorService: ErrorService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ResultEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          postGreaseCalculation: jest.fn(),
        },
      },
      {
        provide: ErrorService,
        useValue: {
          openGenericSnackBar: jest.fn(),
        },
      },
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ResultEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);
    errorService = spectator.inject(ErrorService);
    store = spectator.inject(MockStore);

    store.overrideSelector(getCalculationParameters, {
      options: {
        mockParameters: 'confirmed',
      },
    } as any);
  });

  describe('calculation$', () => {
    it(
      'should fetch grease calculation',
      marbles((m) => {
        const resultId = CALCULATION_RESULT_MOCK_ID;
        const result = calculationSuccess({ resultId });

        action = getCalculation();

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: resultId });

        const expected = m.cold('--b', { b: result });

        restService.getGreaseCalculation = jest.fn(() => response);

        m.expect(effects.calculation$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseCalculation).toHaveBeenCalled();
      })
    );
  });

  describe('calculationError$', () => {
    it('should not return an action', () => {
      expect(metadata.calculationError$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'trigger the errorService openGenericSnackBar method',
      marbles((m) => {
        action = calculationError();

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });

        m.expect(effects.calculationError$).toBeObservable(expected);
        m.flush();

        expect(errorService.openGenericSnackBar).toHaveBeenCalledTimes(1);
      })
    );
  });

  describe('calculationSuccess$', () => {
    it('should not return an action', () => {
      expect(metadata.calculationSuccess$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    it(
      'trigger a app insights lov event call sending the params',
      marbles((m) => {
        const trackingSpy = jest.spyOn(
          effects['applicationInsightsService'],
          'logEvent'
        );

        const mockResultId = '123';
        action = calculationSuccess({ resultId: mockResultId });

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-b', { b: undefined });

        m.expect(effects.calculationSuccess$).toBeObservable(expected);
        m.flush();

        expect(trackingSpy).toHaveBeenCalledWith(PROPERTIES, {
          mockParameters: 'confirmed',
        });
      })
    );
  });
});
