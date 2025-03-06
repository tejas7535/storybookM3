import { Subject } from 'rxjs';

import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculationParametersFacade } from '../store';
import { setCalculationTypes } from '../store/actions/calculation-parameters/calculation-types.actions';
import {
  CalculationParametersCalculationTypes,
  CalculationParametersOperationConditions,
  ProductSelectionTemplate,
} from '../store/models';
import { EAParametersLocalStorageItem } from './ea-parameters-local-storage-item.model';
import { LocalStorageService } from './local-storage.service';

describe('Local Storage Service', () => {
  let spectator: SpectatorService<LocalStorageService>;
  let service: LocalStorageService;
  let facade: CalculationParametersFacade;

  const createService = createServiceFactory({
    service: LocalStorageService,
    imports: [],
    providers: [
      provideMockStore({}),
      {
        provide: CalculationParametersFacade,
        useFactory: () => ({
          getCalculationTypes$: new Subject(),
          operationConditions$: new Subject(),
          dispatch: jest.fn(),
        }),
      },
      {
        provide: LOCAL_STORAGE,
        useValue: {
          getItem: jest.fn(),
          setItem: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    facade = spectator.inject(CalculationParametersFacade);
  });

  describe('constructor', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });
  });

  describe('init', () => {
    beforeEach(() => {
      service['saveSessionParameters'] = jest.fn();
    });

    it('should skip the first 3 emits', () => {
      (
        facade.getCalculationTypes$ as Subject<CalculationParametersCalculationTypes>
      ).next({
        emission: true,
      } as unknown as CalculationParametersCalculationTypes);
      (
        facade.getCalculationTypes$ as Subject<CalculationParametersCalculationTypes>
      ).next({
        emission: false,
      } as unknown as CalculationParametersCalculationTypes);
      (
        facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
      ).next({
        ambientTemperature: 10,
      } as CalculationParametersOperationConditions);

      expect(service['saveSessionParameters']).not.toHaveBeenCalled();
    });

    describe('after skipped', () => {
      beforeEach(() => {
        (
          facade.getCalculationTypes$ as Subject<CalculationParametersCalculationTypes>
        ).next({
          emission: { selected: false, visible: true, disabled: false },
        } as unknown as CalculationParametersCalculationTypes);
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 10,
        } as CalculationParametersOperationConditions);
        (
          facade.getCalculationTypes$ as Subject<CalculationParametersCalculationTypes>
        ).next({
          emission: { selected: true, visible: true, disabled: false },
        } as unknown as CalculationParametersCalculationTypes);
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 5,
        } as CalculationParametersOperationConditions);
      });

      it('should not save incomplete data', () => {
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next(undefined);

        expect(service['saveSessionParameters']).not.toHaveBeenCalled();
      });

      it('should do nothing without data change', () => {
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 20,
        } as CalculationParametersOperationConditions);
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 20,
        } as CalculationParametersOperationConditions);
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 20,
        } as CalculationParametersOperationConditions);

        expect(service['saveSessionParameters']).toHaveBeenCalledTimes(1);
      });

      it('should save the session parameters on change', () => {
        (
          facade.operationConditions$ as Subject<CalculationParametersOperationConditions>
        ).next({
          ambientTemperature: 30,
        } as CalculationParametersOperationConditions);

        expect(service['saveSessionParameters']).toHaveBeenCalledWith(
          expect.objectContaining({
            calculationTypes: { emission: true },
            operationConditions: { ambientTemperature: 30 },
            validUntil: expect.any(Number),
            version: 1,
          })
        );
      });
    });
  });

  describe('restoreStoredSession', () => {
    const baseMockTemplateCalculationTypes: CalculationParametersCalculationTypes =
      {
        emission: {
          selected: true,
          visible: true,
          disabled: false,
        },
      } as CalculationParametersCalculationTypes;
    const baseMockLoadcaseTemplate: ProductSelectionTemplate = {
      id: 'IDSLC_TIME_PORTION',
      maximum: 100,
      minimum: 0,
      defaultValue: '100',
      editable: true,
      visible: true,
      precision: 3,
      unit: '%',
    } as ProductSelectionTemplate;
    const baseMockOperationConditionsTemplate: ProductSelectionTemplate = {
      id: 'IDL_LUBRICATION_METHOD',
      maximum: undefined,
      minimum: undefined,
      options: [
        {
          value: 'LB_GREASE_LUBRICATION',
        },
        {
          value: 'LB_OIL_BATH_LUBRICATION',
        },
        {
          value: 'LB_OIL_MIST_LUBRICATION',
        },
        {
          value: 'LB_RECIRCULATING_OIL_LUBRICATION',
        },
      ],
      defaultValue: 'LB_GREASE_LUBRICATION',
      editable: true,
      visible: true,
      precision: 0,
      unit: undefined,
    };

    it('should do nothing if version is undefined', () => {
      service['getStoredSessionParameters'] = jest.fn(
        () =>
          ({
            version: undefined,
            validUntil: Date.now() / 1000 + 36_000,
            calculationTypes: {
              emission: true,
            },
            operationConditions: {
              lubrication: {
                lubricationSelection: 'grease',
              },
            },
          }) as EAParametersLocalStorageItem
      );

      service.restoreStoredSession(
        baseMockTemplateCalculationTypes,
        [baseMockLoadcaseTemplate],
        [baseMockOperationConditionsTemplate]
      );

      expect(facade.dispatch).not.toHaveBeenCalled();
    });
    it('should do nothing if version is lower than current', () => {
      service['getStoredSessionParameters'] = jest.fn(
        () =>
          ({
            version: 0,
            validUntil: Date.now() / 1000 + 36_000,
            calculationTypes: {
              emission: true,
            },
            operationConditions: {
              lubrication: {
                lubricationSelection: 'grease',
              },
            },
          }) as EAParametersLocalStorageItem
      );

      service.restoreStoredSession(
        baseMockTemplateCalculationTypes,
        [baseMockLoadcaseTemplate],
        [baseMockOperationConditionsTemplate]
      );

      expect(facade.dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch the calculationTypes and operationConditions', () => {
      service['getStoredSessionParameters'] = jest.fn(
        () =>
          ({
            version: 1,
            validUntil: Date.now() / 1000 + 36_000,
            calculationTypes: {
              emission: true,
            },
            operationConditions: {
              loadCaseData: [],
              lubrication: {
                lubricationSelection: 'grease',
              },
            },
          }) as EAParametersLocalStorageItem
      );

      service.restoreStoredSession(
        baseMockTemplateCalculationTypes,
        [baseMockLoadcaseTemplate],
        [baseMockOperationConditionsTemplate]
      );

      expect(facade.dispatch).toHaveBeenCalledWith(
        setCalculationTypes({
          calculationTypes: {
            emission: {
              selected: true,
              visible: true,
              disabled: false,
            },
          } as CalculationParametersCalculationTypes,
        })
      );
    });
  });

  describe('applyTemplateToStoredOperationConditions', () => {
    it('should apply the template limitations to the stored operationConditions', () => {
      const baseMockLoadcaseTemplate: ProductSelectionTemplate = {
        id: 'IDSLC_TIME_PORTION',
        maximum: 100,
        minimum: 0,
        defaultValue: '100',
        editable: true,
        visible: true,
        precision: 3,
        unit: '%',
      } as ProductSelectionTemplate;
      const baseMockOperationConditionsTemplate: ProductSelectionTemplate = {
        id: 'IDL_LUBRICATION_METHOD',
        maximum: undefined,
        minimum: undefined,
        options: [
          {
            value: 'LB_GREASE_LUBRICATION',
          },
          {
            value: 'LB_OIL_MIST_LUBRICATION',
          },
          {
            value: 'LB_RECIRCULATING_OIL_LUBRICATION',
          },
        ],
        defaultValue: 'LB_GREASE_LUBRICATION',
        editable: true,
        visible: true,
        precision: 0,
        unit: undefined,
      };
      const mockStoredOperationConditions: Partial<CalculationParametersOperationConditions> =
        {
          loadCaseData: [],
          lubrication: {
            lubricationSelection: 'oilBath',
            grease: {
              selection: 'typeOfGrease',
              typeOfGrease: {
                typeOfGrease: 'LB_FAG_MULTI_2',
              },
              environmentalInfluence: 'LB_AVERAGE_AMBIENT_INFLUENCE',
              isoVgClass: { isoVgClass: 10 },
              viscosity: { ny40: 10, ny100: 10 },
            },
            oilBath: {
              selection: 'isoVgClass',
              isoVgClass: { isoVgClass: 10 },
              viscosity: { ny40: 10, ny100: 10 },
            },
            oilMist: {
              selection: 'isoVgClass',
              isoVgClass: { isoVgClass: 10 },
              viscosity: { ny40: 10, ny100: 10 },
            },
            recirculatingOil: {
              selection: 'isoVgClass',
              isoVgClass: { isoVgClass: 10 },
              viscosity: { ny40: 10, ny100: 10 },
              oilTemperatureDifference: 0,
              externalHeatFlow: 0,
              oilFlow: undefined,
            },
          },
        };

      const result = service['applyTemplateToStoredOperationConditions'](
        mockStoredOperationConditions,
        [baseMockLoadcaseTemplate],
        [baseMockOperationConditionsTemplate]
      );

      expect(result).toEqual({
        loadCaseData: [],
        lubrication: {
          ...mockStoredOperationConditions.lubrication,
          lubricationSelection: 'grease',
        },
      });
    });
  });

  describe('mapEntries', () => {
    const baseMockLoadcaseTemplate: ProductSelectionTemplate = {
      id: 'IDSLC_AXIAL_LOAD',
      maximum: undefined,
      minimum: undefined,
      defaultValue: '0',
      editable: true,
      visible: true,
      precision: 1,
      unit: 'N',
    } as ProductSelectionTemplate;

    it('should return the value', () => {
      const baseEntries: [key: string, value: any][] = [['axialLoad', 50]];
      const result = service['mapEntries'](baseEntries, [
        baseMockLoadcaseTemplate,
      ]);

      expect(result).toEqual([['axialLoad', 50]]);
    });

    it('should return the default value if value is undefined', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = service['mapEntries'](baseEntries, [
        { ...baseMockLoadcaseTemplate, defaultValue: 'defaultValue' },
      ]);

      expect(result).toEqual([['axialLoad', 'defaultValue']]);
    });
    it('should return the default value as undefined if value is undefined and default is 0', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = service['mapEntries'](baseEntries, [
        baseMockLoadcaseTemplate,
      ]);

      expect(result).toEqual([['axialLoad', undefined]]);
    });
    it('should return the default value as number if value is undefined and default can be parsed', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = service['mapEntries'](baseEntries, [
        { ...baseMockLoadcaseTemplate, defaultValue: '100' },
      ]);

      expect(result).toEqual([['axialLoad', 100]]);
    });
  });

  describe('getStoredSessionParameters', () => {
    const expectedUndefined = {
      version: undefined,
      validUntil: undefined,
      operationConditions: undefined,
      calculationTypes: undefined,
    } as EAParametersLocalStorageItem;
    it('should return and empty object if the value cannot be parsed', () => {
      service['localStorage'].getItem = jest.fn(() => 'not parsable');

      const result = service['getStoredSessionParameters']();

      expect(result).toEqual(expectedUndefined);
    });
    it('should return and empty object if the ttl has been exceeded', () => {
      service['localStorage'].getItem = jest.fn(() =>
        JSON.stringify({
          version: 1,
          validUntil: 1,
          operationConditions: {},
          calculationTypes: { emission: true },
        })
      );

      const result = service['getStoredSessionParameters']();

      expect(result).toEqual(expectedUndefined);
    });
    it('should return and empty object if there is no object stored', () => {
      service['localStorage'].getItem = jest.fn(() => undefined as any);

      const result = service['getStoredSessionParameters']();

      expect(result).toEqual(expectedUndefined);
    });
    it('should return the stored parameters', () => {
      service['localStorage'].getItem = jest.fn(() =>
        JSON.stringify({
          version: 1,
          validUntil: 99_999_999_999_999,
          operationConditions: {},
          calculationTypes: { emission: true },
        })
      );

      const result = service['getStoredSessionParameters']();

      expect(result).toEqual({
        version: 1,
        validUntil: 99_999_999_999_999,
        operationConditions: {},
        calculationTypes: { emission: true },
      });
    });
  });

  describe('saveSessionParameters', () => {
    it('should save session parameters', () => {
      service['localStorage'].setItem = jest.fn();
      const storageItem = {} as EAParametersLocalStorageItem;
      service['saveSessionParameters'](storageItem);

      const expectedValue = JSON.stringify(storageItem);

      expect(service['sessionParameters']).toEqual(storageItem);
      expect(service['localStorage'].setItem).toHaveBeenCalledWith(
        service['KEY'],
        expectedValue
      );
    });
  });
});
