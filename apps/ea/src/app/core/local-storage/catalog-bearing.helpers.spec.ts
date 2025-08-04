import {
  CalculationParametersOperationConditions,
  ProductSelectionTemplate,
} from '../store/models';
import {
  applyTemplateToStoredOperationConditions,
  mapEntries,
} from './catalog-bearing.helpers';

describe('CatalogBearingHelper', () => {
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

    const result = applyTemplateToStoredOperationConditions(
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
      const result = mapEntries(baseEntries, [baseMockLoadcaseTemplate]);

      expect(result).toEqual([['axialLoad', 50]]);
    });

    it('should return the default value if value is undefined', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = mapEntries(baseEntries, [
        { ...baseMockLoadcaseTemplate, defaultValue: 'defaultValue' },
      ]);

      expect(result).toEqual([['axialLoad', 'defaultValue']]);
    });
    it('should return the default value as undefined if value is undefined and default is 0', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = mapEntries(baseEntries, [baseMockLoadcaseTemplate]);

      expect(result).toEqual([['axialLoad', undefined]]);
    });
    it('should return the default value as number if value is undefined and default can be parsed', () => {
      const baseEntries: [key: string, value: any][] = [
        ['axialLoad', undefined],
      ];
      const result = mapEntries(baseEntries, [
        { ...baseMockLoadcaseTemplate, defaultValue: '100' },
      ]);

      expect(result).toEqual([['axialLoad', 100]]);
    });
  });
});
