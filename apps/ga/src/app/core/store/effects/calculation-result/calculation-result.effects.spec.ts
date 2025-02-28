import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ErrorService, RestService } from '@ga/core/services';
import {
  calculationError,
  calculationSuccess,
  fetchBearinxVersions,
  getCalculation,
  setBearinxVersions,
  unsetBearinxVersions,
} from '@ga/core/store/actions/calculation-result/calculation-result.actions';
import {
  GREASE_PRESELECTION,
  TRACKING_NAME_PROPERTIES,
} from '@ga/shared/constants';
import {
  CALCULATION_RESULT_MOCK_ID,
  PREFERRED_GREASE_OPTION_MOCK,
} from '@ga/testing/mocks';

import {
  getCalculationParameters,
  getPreferredGreaseSelection,
} from '../../selectors/calculation-parameters/calculation-parameters.selector';
import { CalculationResultEffects } from './calculation-result.effects';

describe('CalculationResultEffects', () => {
  let action: any;
  let actions$: any;
  let effects: CalculationResultEffects;
  let metadata: EffectsMetadata<CalculationResultEffects>;
  let spectator: SpectatorService<CalculationResultEffects>;
  let restService: RestService;
  let errorService: ErrorService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationResultEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          postGreaseCalculation: jest.fn(),
          getBearinxVersions: jest.fn(),
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
    effects = spectator.inject(CalculationResultEffects);
    metadata = getEffectsMetadata(effects);
    restService = spectator.inject(RestService);
    errorService = spectator.inject(ErrorService);
    store = spectator.inject(MockStore);

    store.overrideSelector(getCalculationParameters, {
      options: {
        mockParameters: 'confirmed',
      },
    } as any);

    store.overrideSelector(
      getPreferredGreaseSelection,
      PREFERRED_GREASE_OPTION_MOCK
    );
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
      'trigger two app insights log event call sending the params',
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

        expect(trackingSpy).toHaveBeenCalledTimes(2);

        expect(trackingSpy).toHaveBeenCalledWith(TRACKING_NAME_PROPERTIES, {
          mockParameters: 'confirmed',
        });

        expect(trackingSpy).toHaveBeenLastCalledWith(
          GREASE_PRESELECTION,
          PREFERRED_GREASE_OPTION_MOCK
        );
      })
    );
  });

  describe('fetchBearinxVersions', () => {
    it('should fetch the bearinx versions', () => {
      const fetchSpy = jest
        .spyOn(restService, 'getBearinxVersions')
        .mockImplementation(() => of({ abc: '123' }));

      return marbles((m) => {
        action = fetchBearinxVersions();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: setBearinxVersions({
            versions: { abc: '123' },
          }),
        });

        m.expect(effects.fetchBearinxVersion$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });

    it('should unset bearinx versions on error', () => {
      const fetchSpy = jest
        .spyOn(restService, 'getBearinxVersions')
        .mockImplementation(() => throwError(() => 'error'));

      return marbles((m) => {
        action = fetchBearinxVersions();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: unsetBearinxVersions(),
        });

        m.expect(effects.fetchBearinxVersion$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });
});
