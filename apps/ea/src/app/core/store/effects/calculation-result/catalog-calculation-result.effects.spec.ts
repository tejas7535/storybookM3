import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { EmbeddedGoogleAnalyticsService } from '@ea/core/services/embedded-google-analytics';
import {
  APP_STATE_MOCK,
  CALCULATION_PARAMETERS_STATE_MOCK,
} from '@ea/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  CalculationTypesActions,
  CatalogCalculationResultActions,
} from '../../actions';
import { CalculationParametersFacade } from '../../facades';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { CatalogCalculationResultEffects } from './catalog-calculation-result.effects';

const catalogServiceMock = {
  getBasicFrequencies: jest.fn(),
  getCalculationResult: jest.fn(),
};

const trackingServiceMock = {
  logCalculation: jest.fn(),
};

describe('Catalog Calculation Result Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CatalogCalculationResultEffects;
  let spectator: SpectatorService<CatalogCalculationResultEffects>;

  const createService = createServiceFactory({
    service: CatalogCalculationResultEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: APP_STATE_MOCK }),
      {
        provide: CatalogService,
        useValue: catalogServiceMock,
      },

      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          bearingId$: of('bearing-123'),
        },
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          operationConditions$: of(
            CALCULATION_PARAMETERS_STATE_MOCK.operationConditions
          ),
          getCalculationTypes$: of(
            CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes
          ),
        },
      },
      {
        provide: EmbeddedGoogleAnalyticsService,
        useValue: trackingServiceMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CatalogCalculationResultEffects);
  });

  describe('getBasicFrequencies', () => {
    beforeEach(() => {
      catalogServiceMock.getBasicFrequencies.mockReset();
    });
    it('should fetch the basic frequencies', () => {
      const fetchSpy = jest
        .spyOn(catalogServiceMock, 'getBasicFrequencies')
        .mockImplementation(() => of('result-from-service'));

      return marbles((m) => {
        action = CatalogCalculationResultActions.fetchBasicFrequencies();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CatalogCalculationResultActions.setBasicFrequenciesResult({
            basicFrequenciesResult: 'result-from-service' as any,
          }),
        });

        m.expect(effects.fetchBasicFrequencies$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('fetchCalculationResult', () => {
    beforeEach(() => {
      trackingServiceMock.logCalculation.mockReset();
    });

    it('should fetch the calculation result', () => {
      const fetchSpy = jest
        .spyOn(catalogServiceMock, 'getCalculationResult')
        .mockImplementation(() => of('result-from-service'));

      return marbles((m) => {
        action = CatalogCalculationResultActions.fetchCalculationResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: CatalogCalculationResultActions.setCalculationResult({
            calculationResult: 'result-from-service' as any,
          }),
          c: CalculationTypesActions.setCalculationTypes({
            calculationTypes: {
              ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes,
              frictionalPowerloss: {
                ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes
                  .frictionalPowerloss,
                disabled: true,
              },
            },
          }),
        });

        m.expect(effects.fetchCalculationResult$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });
});
