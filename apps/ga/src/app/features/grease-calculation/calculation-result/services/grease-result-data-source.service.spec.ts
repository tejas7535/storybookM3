import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  GreaseReportConcept1HintMock,
  GreaseReportConcept1ItemsMock,
  GreaseReportConcept160ValueMock,
  GreaseReportConcept1125ValueMock,
  greaseResultDataMock,
} from '@ga/testing/mocks';
import { GREASE_CONCEPT1_SUITABILITY } from '@ga/testing/mocks/models/grease-concept1-suitability.mock';
import * as subordinateDataMock from '@ga/testing/mocks/models/grease-report-subordinate-data.mock';

import { CalculationParametersService } from '../../calculation-parameters/services';
import {
  CONCEPT1,
  GreaseReportConcept1Subordinate,
  GreaseReportSubordinate,
  GreaseReportSubordinateDataItem,
  GreaseReportSubordinateTitle,
  SubordinateDataItemField,
  SUITABILITY_LABEL,
} from '../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey: string) => {
    switch (translateKey) {
      case 'calculationResult.gramsAbbreviation':
        return 'g';
      case 'calculationResult.suitabilityLevelSuitable':
        return 'suitable';
      case 'calculationResult.undefinedValue':
        return 'n.a.';
      case 'calculationResult.concept1settings.sizeHint':
        return 'disabled size hint';
      default:
        return translateKey.toString().replace('calculationResult.', '');
    }
  }),
}));

describe('GreaseResultDataSourceService', () => {
  let spectator: SpectatorService<GreaseResultDataSourceService>;
  let service: GreaseResultDataSourceService;
  const localizeNumber = jest.fn((number) => `${number}`);

  const createService = createServiceFactory({
    service: GreaseResultDataSourceService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      UndefinedValuePipe,
      CalculationParametersService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isSufficient', () => {
    it('should return false', () => {
      const sufficient = service.isSufficient([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.QVIN,
        },
      ]);

      expect(sufficient).toBe(false);
    });

    it('should return true', () => {
      const sufficient = service.isSufficient([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFG_MIN,
        },
      ]);

      expect(sufficient).toBe(true);
    });
  });

  describe('automaticLubrication', () => {
    it('should return the data source item', () => {
      const item = service.automaticLubrication(
        subordinateDataMock.greaseReportSubordinateConcept1Mock as GreaseReportConcept1Subordinate[],
        0
      );

      expect(item).toStrictEqual({
        title: 'concept1',
        custom: {
          selector: CONCEPT1,
          data: {
            ...GREASE_CONCEPT1_SUITABILITY,
            hint_125: undefined,
            hint_60: undefined,
          },
        },
      });
    });

    describe('when there is no suitability', () => {
      it('should return hint labels for not available items', () => {
        const item = service.automaticLubrication(
          subordinateDataMock.greaseReportSubordinateConcept1MockWithNoSuitability as GreaseReportConcept1Subordinate[],
          0
        );

        expect(item).toStrictEqual({
          title: 'concept1',
          custom: {
            selector: CONCEPT1,
            data: {
              label: SUITABILITY_LABEL.UNSUITED,
              hint: GreaseReportConcept1HintMock,
              c1_125: false,
              c1_60: false,
              hint_60: 'disabled size hint',
              hint_125: 'disabled size hint',
            },
          },
        });
      });
    });

    describe('when items are overgreased', () => {
      it('should return overgreased hints', () => {
        const item = service.automaticLubrication(
          [
            {
              titleID: GreaseReportSubordinateTitle.STRING_OUTP_CONCEPT1,
              data: {
                items: [
                  [
                    ...GreaseReportConcept1ItemsMock,
                    {
                      value: '1, 2',
                      unit: undefined,
                      field: SubordinateDataItemField.NOTE,
                    },
                  ],
                ],
              },
            } as unknown as GreaseReportSubordinate,
            subordinateDataMock.greaseReportSubordinateConcept1Mock[1],
          ] as GreaseReportConcept1Subordinate[],
          0
        );

        expect(item).toStrictEqual({
          title: 'concept1',
          custom: {
            selector: CONCEPT1,
            data: {
              label: SUITABILITY_LABEL.SUITED,
              hint: GreaseReportConcept1HintMock,
              c1_125: GreaseReportConcept1125ValueMock,
              c1_60: GreaseReportConcept160ValueMock,
              hint_60: 'concept1settings.size60PossibleHint',
              hint_125: 'concept1settings.size125PossibleHint',
            },
          },
        });
      });
    });
  });

  describe('initialGreaseQuantity', () => {
    it('should return the data source item', () => {
      const item = service.initialGreaseQuantity(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toMatchSnapshot();
    });

    it('should return undefined', () => {
      const item = service.initialGreaseQuantity(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('relubricationPer365Days', () => {
    it('should return the data source item', () => {
      const item = service.relubricationPer365Days(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toMatchSnapshot();
    });

    it('should return undefined', () => {
      const item = service.relubricationPer365Days(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('relubricationQuantityPer1000OperatingHours', () => {
    it('should return the data source item', () => {
      const item = service.relubricationQuantityPer1000OperatingHours(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toMatchSnapshot();
    });

    it('should return undefined', () => {
      const item = service.relubricationQuantityPer1000OperatingHours(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('maximumManualRelubricationInterval', () => {
    const baseItem: GreaseReportSubordinateDataItem[] = [
      {
        field: SubordinateDataItemField.QVRE_AUT_MIN,
        value: '0.06',
        unit: 'mock_unit',
      },
      {
        field: SubordinateDataItemField.QVRE_AUT_MAX,
        value: '0.08',
        unit: 'mock_unit',
      },
    ];
    describe('when relubrication interval in days exceeds 365 days', () => {
      it('should return lubrication interval data for 365 days', () => {
        const item = service.maximumManualRelubricationInterval(
          [
            {
              field: SubordinateDataItemField.TFR_MIN,
              value: 19_710,
              unit: 'h',
            },
            {
              field: SubordinateDataItemField.TFR_MAX,
              value: 21_900,
              unit: 'h',
            },
            ...baseItem,
          ],
          subordinateDataMock.rhoMock
        );

        expect(item).toStrictEqual({
          title: 'maximumManualRelubricationPerInterval',
          values:
            '<span>25.6 g/365 days</span><br><span class="text-low-emphasis">25.6 /365 days</span>',
        });
      });
    });

    describe('when relubrication interval in days is less than 365 days', () => {
      it('should return lubrication interval data for the calculated days', () => {
        const item = service.maximumManualRelubricationInterval(
          [
            {
              field: SubordinateDataItemField.TFR_MIN,
              value: 5710,
              unit: 'h',
            },
            {
              field: SubordinateDataItemField.TFR_MAX,
              value: 7900,
              unit: 'h',
            },
            ...baseItem,
          ],
          subordinateDataMock.rhoMock
        );

        expect(item).toStrictEqual({
          title: 'maximumManualRelubricationPerInterval',
          values:
            '<span>19.9 g/284 days</span><br><span class="text-low-emphasis">19.9 /284 days</span>',
        });
      });
    });

    describe('when the relubrication interval value could not be calculated', () => {
      it('should return undefined', () => {
        const item = service.maximumManualRelubricationInterval(
          [],
          subordinateDataMock.rhoMock
        );

        expect(item).toBeUndefined();
      });
    });
  });

  describe('relubricationInterval', () => {
    it('should return relubrication interval value in days', () => {
      const item = service.relubricationInterval([
        {
          field: SubordinateDataItemField.TFR_MIN,
          value: 19_710,
          unit: 'h',
        },
        {
          field: SubordinateDataItemField.TFR_MAX,
          value: 21_900,
          unit: 'h',
        },
      ]);

      expect(item).toStrictEqual({
        title: 'relubricationInterval',
        tooltip: 'relubricationIntervalTooltip',
        values: '~ 867 days',
      });
    });

    describe('when the relubrication interval value could not be calculated', () => {
      it('should return undefined', () => {
        const item = service.relubricationInterval([]);

        expect(item).toBeUndefined();
      });
    });
  });

  describe('greaseServiceLife', () => {
    it('should return the data source item', () => {
      const item = service.greaseServiceLife([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFG_MIN,
        },
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.TFG_MAX,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[3]
      );
    });

    it('should return undefined', () => {
      const item = service.greaseServiceLife([]);

      expect(item).toBeUndefined();
    });
  });

  describe('relubricationPer30days', () => {
    it('should return the data source item', () => {
      const item = service.relubricationPer30Days(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[4]
      );
    });

    it('should return undefined', () => {
      const item = service.relubricationPer30Days(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('relubricationPer7days', () => {
    it('should return the data source item', () => {
      const item = service.relubricationPer7Days(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[5]
      );
    });

    it('should rounded result with prefix for small values', () => {
      const item = service.relubricationPer7Days(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MIN,
            value: 0.001,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_AUT_MAX,
            value: 0.0012,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVIN,
            value: 2,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toMatchSnapshot();
    });

    it('should return undefined', () => {
      const item = service.relubricationPer7Days(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('viscosityRatio', () => {
    it('should return the data source item', () => {
      const item = service.viscosityRatio([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.KAPPA,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[6]
      );
    });

    it('should return undefined', () => {
      const item = service.viscosityRatio([]);

      expect(item).toBeUndefined();
    });
  });

  describe('baseOilViscosityAt40', () => {
    it('should return the data source item', () => {
      const item = service.baseOilViscosityAt40([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.NY40,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[7]
      );
    });

    it('should return undefined', () => {
      const item = service.baseOilViscosityAt40([]);

      expect(item).toBeUndefined();
    });
  });

  describe('lowerTemperatureLimit', () => {
    it('should return the data source item', () => {
      const item = service.lowerTemperatureLimit([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.T_LIM_LOW,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[8]
      );
    });

    it('should return undefined', () => {
      const item = service.lowerTemperatureLimit([]);

      expect(item).toBeUndefined();
    });
  });

  describe('upperTemperatureLimit', () => {
    it('should return the data source item', () => {
      const item = service.upperTemperatureLimit([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.T_LIM_UP,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[9]
      );
    });

    it('should return undefined', () => {
      const item = service.upperTemperatureLimit([]);

      expect(item).toBeUndefined();
    });
  });

  describe('additiveRequired', () => {
    it('should return the data source item', () => {
      const item = service.additiveRequired([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemStringMock,
          field: SubordinateDataItemField.ADD_REQ,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[10]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.additiveRequired([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[10],
        values: 'calculationResult.undefinedValue',
      });
    });
  });

  describe('effectiveEpAdditivation', () => {
    it('should return the data source item', () => {
      const item = service.effectiveEpAdditivation([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.ADD_W,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[11]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.effectiveEpAdditivation([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[11],
        values: 'calculationResult.undefinedValue',
      });
    });
  });

  describe('density', () => {
    it('should return the data source item', () => {
      const item = service.density([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
          field: SubordinateDataItemField.RHO,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[12]
      );
    });

    it('should return undefined', () => {
      const item = service.density([]);

      expect(item).toBeUndefined();
    });
  });

  describe('lowFriction', () => {
    it('should return the data source item', () => {
      const item = service.lowFriction([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemStringMock,
          field: SubordinateDataItemField.F_LOW,
          value: '0',
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[13]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.lowFriction([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[13],
        values: 'n.a.',
      });
    });
  });

  describe('suitableForVibrations', () => {
    it('should return the data source item', () => {
      const item = service.suitableForVibrations([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemStringMock,
          field: SubordinateDataItemField.VIP,
          value: '0',
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[14]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.suitableForVibrations([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[14],
        values: 'n.a.',
      });
    });
  });

  describe('supportForSeals', () => {
    it('should return the data source item', () => {
      const item = service.supportForSeals([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemStringMock,
          field: SubordinateDataItemField.SEAL,
          value: '0',
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[15]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.supportForSeals([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[15],
        values: 'n.a.',
      });
    });
  });

  describe('h1Registration', () => {
    it('should return the data source item', () => {
      const item = service.h1Registration([
        {
          ...subordinateDataMock.greaseReportSubordinateDataItemStringMock,
          field: SubordinateDataItemField.NSF_H1,
        },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[16]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.h1Registration([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[16],
        values: 'calculationResult.undefinedValue',
      });
    });
  });
});
