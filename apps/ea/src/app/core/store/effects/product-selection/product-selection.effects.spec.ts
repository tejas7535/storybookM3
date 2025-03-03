import { provideHttpClientTesting } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { CO2UpstreamService } from '@ea/core/services/co2-upstream.service';
import { DownstreamCalculationService } from '@ea/core/services/downstream-calculation.service';
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
  CO2UpstreamCalculationResultActions,
  ProductSelectionActions,
} from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { Co2ApiSearchResult, ProductCapabilitiesResult } from '../../models';
import { ProductSelectionEffects } from './product-selection.effects';

const catalogServiceMock = {
  getBearingSearch: jest.fn(),
  getBearingIdFromDesignation: jest.fn(),
  getBasicFrequencies: jest.fn(),
  getBasicFrequenciesPdf: jest.fn(),
  downloadBasicFrequenciesPdf: jest.fn(),
  getLoadcaseTemplate: jest.fn(),
  getOperatingConditionsTemplate: jest.fn(),
  getBearingCapabilities: jest.fn(),
};

const co2upstreamServiceMock = {
  findBearings: jest.fn(),
};

const downstreamCalculationServiceMock = {
  getCanCalculate: jest.fn(),
};

describe('Product Selection Effects', () => {
  let action: any;
  let actions$: any;
  let effects: ProductSelectionEffects;
  let spectator: SpectatorService<ProductSelectionEffects>;

  const createService = createServiceFactory({
    service: ProductSelectionEffects,
    providers: [
      provideHttpClientTesting(),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
      {
        provide: CatalogService,
        useValue: catalogServiceMock,
      },
      {
        provide: CO2UpstreamService,
        useValue: co2upstreamServiceMock,
      },
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('modelId-123'),
          bearingId$: of(undefined),
          isCo2DownstreamCalculationPossible$: of(true),
        },
      },
      {
        provide: DownstreamCalculationService,
        useValue: downstreamCalculationServiceMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProductSelectionEffects);
  });

  describe('fetchLoadcaseTemplate$', () => {
    beforeEach(() => {
      catalogServiceMock.getLoadcaseTemplate.mockReset();
    });

    it('should fetch load case template and write it to store', () => {
      const serviceSpy = jest
        .spyOn(catalogServiceMock, 'getLoadcaseTemplate')
        .mockImplementation(() => of({}));

      return marbles((m) => {
        action = ProductSelectionActions.fetchLoadcaseTemplate();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: ProductSelectionActions.setLoadcaseTemplate({
            loadcaseTemplate: {} as any,
          }),
        });

        m.expect(effects.fetchLoadcaseTemplate$).toBeObservable(expected);
        m.flush();

        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('fetchCanCalculate$', () => {
    beforeEach(() => {
      downstreamCalculationServiceMock.getCanCalculate.mockReset();
    });

    it('should fetch can calculate and write it to store', () => {
      const serviceSpy = jest
        .spyOn(downstreamCalculationServiceMock, 'getCanCalculate')
        .mockImplementation(() => of(true));

      return marbles((m) => {
        action = ProductSelectionActions.fetchCanCalculate();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: ProductSelectionActions.setCanCalculate({
            co2DownstreamAvailable: true,
          }),
          c: CalculationTypesActions.setCalculationTypes({
            calculationTypes: {
              ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes,
              frictionalPowerloss: {
                ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes
                  .frictionalPowerloss,
                disabled: false,
              },
            },
          }),
        });

        m.expect(effects.fetchCanCalculate$).toBeObservable(expected);
        m.flush();

        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('bearingSearch$', () => {
    it(
      'should fetch the bearing list',
      marbles((m) => {
        action = ProductSelectionActions.searchBearing({ query: 'the query' });

        actions$ = m.hot('-a', { a: action });

        const resultList: Co2ApiSearchResult[] = [
          { bearinxId: 'abcd', epimId: '12345', designation: 'abcd' },
          { bearinxId: 'xyz', epimId: '9876', designation: 'xyz' },
        ];

        const response = m.cold('-a|', { a: resultList });
        co2upstreamServiceMock.findBearings = jest.fn(() => response);

        const result = ProductSelectionActions.bearingSearchSuccess({
          resultList,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.bearingSearch$).toBeObservable(expected);
        m.flush();

        expect(co2upstreamServiceMock.findBearings).toHaveBeenCalledWith(
          'the query'
        );
      })
    );
  });

  describe('fetchOperatingConditionsTemplate$', () => {
    beforeEach(() => {
      catalogServiceMock.getOperatingConditionsTemplate.mockReset();
    });

    it('should fetch load case template and write it to store', () => {
      const serviceSpy = jest
        .spyOn(catalogServiceMock, 'getOperatingConditionsTemplate')
        .mockImplementation(() => of({}));

      return marbles((m) => {
        action = ProductSelectionActions.fetchOperatingConditionsTemplate();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: ProductSelectionActions.setOperatingConditionsTemplate({
            operatingConditionsTemplate: {} as any,
          }),
        });

        m.expect(effects.fetchOperatingConditionsTemplate$).toBeObservable(
          expected
        );
        m.flush();

        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
  });

  describe('fetchBearingCapabilities', () => {
    beforeEach(() => {
      catalogServiceMock.getBearingIdFromDesignation();
    });

    it('should fetch the bearing capabilities', () => {
      const serviceSpy = jest
        .spyOn(catalogServiceMock, 'getBearingCapabilities')
        .mockImplementation(() => {
          const capabilities = {
            productInfo: {
              designation: '6226',
              id: 'abc',
              bearinxClass: 'IDO_CATALOGUE_BEARING',
            },
            capabilityInfo: { frictionCalculation: false },
          } as ProductCapabilitiesResult;

          return of(capabilities);
        });

      return marbles((m) => {
        action = ProductSelectionActions.fetchBearingCapabilities();
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcdef)', {
          b: ProductSelectionActions.setBearingId({ bearingId: 'abc' }),
          c: ProductSelectionActions.setBearingProductClass({
            productClass: 'IDO_CATALOGUE_BEARING',
          }),
          d: ProductSelectionActions.fetchLoadcaseTemplate(),
          e: CO2UpstreamCalculationResultActions.fetchResult(),
          f: ProductSelectionActions.fetchOperatingConditionsTemplate(),
        });

        m.expect(effects.fetchBearingCapabilities$).toBeObservable(expected);
        m.flush();
        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
  });
});
