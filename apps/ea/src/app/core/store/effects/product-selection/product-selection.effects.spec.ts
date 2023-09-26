import { of } from 'rxjs';

import { CalculationModuleInfoService } from '@ea/core/services/calculation-module-info.service';
import { CatalogService } from '@ea/core/services/catalog.service';
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
  ProductSelectionActions,
} from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { ProductCapabilitiesResult } from '../../models';
import { ProductSelectionEffects } from './product-selection.effects';

const catalogServiceMock = {
  getBearingIdFromDesignation: jest.fn(),
  getBasicFrequencies: jest.fn(),
  getBasicFrequenciesPdf: jest.fn(),
  downloadBasicFrequenciesPdf: jest.fn(),
  getLoadcaseTemplate: jest.fn(),
  getOperatingConditionsTemplate: jest.fn(),
  getBearingCapabilities: jest.fn(),
};

const calculationModuleInfoServiceMock = {
  getCalculationInfo: jest.fn(),
};

describe('Product Selection Effects', () => {
  let action: any;
  let actions$: any;
  let effects: ProductSelectionEffects;
  let spectator: SpectatorService<ProductSelectionEffects>;

  const createService = createServiceFactory({
    service: ProductSelectionEffects,
    providers: [
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
        provide: CalculationModuleInfoService,
        useValue: calculationModuleInfoServiceMock,
      },
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('modelId-123'),
          bearingId$: of(undefined),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ProductSelectionEffects);
  });

  describe('fetchCalculationModuleInfo$', () => {
    beforeEach(() => {
      calculationModuleInfoServiceMock.getCalculationInfo.mockReset();
    });

    it('should fetch module info and write it to store', () => {
      const serviceSpy = jest
        .spyOn(calculationModuleInfoServiceMock, 'getCalculationInfo')
        .mockImplementation(() =>
          of({ frictionCalculation: true, catalogueCalculation: true })
        );

      return marbles((m) => {
        action = ProductSelectionActions.fetchCalculationModuleInfo();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bc)', {
          b: ProductSelectionActions.setCalculationModuleInfo({
            calculationModuleInfo: {
              frictionCalculation: true,
              catalogueCalculation: true,
            },
          }),
          c: CalculationTypesActions.setCalculationTypes({
            calculationTypes: {
              ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes,
              emission: {
                ...CALCULATION_PARAMETERS_STATE_MOCK.calculationTypes.emission,
                disabled: false,
              },
            } as typeof CALCULATION_PARAMETERS_STATE_MOCK['calculationTypes'],
          }),
        });

        m.expect(effects.fetchCalculationModuleInfo$).toBeObservable(expected);
        m.flush();

        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
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

      const calculationOptions = {
        emission: { disabled: true, selected: true, visible: true },
        frictionalPowerloss: {
          disabled: true,
          selected: false,
          visible: true,
        },
        lubrication: { disabled: false, selected: false, visible: false },
        overrollingFrequency: {
          disabled: false,
          selected: false,
          visible: false,
        },
        ratingLife: { disabled: false, selected: false, visible: false },
      };

      return marbles((m) => {
        action = ProductSelectionActions.fetchBearingCapabilities();
        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('-(bcdef)', {
          b: ProductSelectionActions.setBearingId({ bearingId: 'abc' }),
          c: ProductSelectionActions.setBearingProductClass({
            productClass: 'IDO_CATALOGUE_BEARING',
          }),
          d: ProductSelectionActions.fetchLoadcaseTemplate(),
          e: ProductSelectionActions.fetchOperatingConditionsTemplate(),
          f: CalculationTypesActions.setCalculationTypes({
            calculationTypes: calculationOptions,
          }),
        });

        m.expect(effects.fetchBearingCapabilities$).toBeObservable(expected);
        m.flush();
        expect(serviceSpy).toHaveBeenCalled();
      })();
    });
  });
});
