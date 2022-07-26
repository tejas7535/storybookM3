import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { greaseResultDataMock } from '@ga/testing/mocks';
import * as subordinateDataMock from '@ga/testing/mocks/models/grease-report-subordinate-data.mock';

import { SubordinateDataItemField } from '../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey: string) => {
    switch (translateKey) {
      case 'calculationResult.gramsAbbreviation':
        return 'g';
      case 'calculationResult.suitabilityLevelSuitable':
        return 'suitable';
      case 'calculationResult.undefinedValue':
        return 'n.a.';
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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[0]
      );
    });

    it('should return undefined', () => {
      const item = service.initialGreaseQuantity(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('manualRelubricationQuantityInterval', () => {
    it('should return the data source item', () => {
      const item = service.manualRelubricationQuantityInterval(
        [
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_MAN_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.QVRE_MAN_MAX,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.TFR_MIN,
          },
          {
            ...subordinateDataMock.greaseReportSubordinateDataItemNumberMock,
            field: SubordinateDataItemField.TFR_MAX,
          },
        ],
        subordinateDataMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[1]
      );
    });

    it('should return undefined', () => {
      const item = service.manualRelubricationQuantityInterval(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationQuantityPerDay', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationQuantityPerDay(
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
        )[2]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationQuantityPerDay(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
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

  describe('automaticRelubricationPerWeek', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationPerWeek(
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
      const item = service.automaticRelubricationPerWeek(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerMonth', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationPerMonth(
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

    it('should return undefined', () => {
      const item = service.automaticRelubricationPerMonth(
        [],
        subordinateDataMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerYear', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationPerYear(
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
        )[6]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationPerYear(
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
        )[7]
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
        )[8]
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
        )[9]
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
        )[10]
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
        )[11]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.additiveRequired([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[11],
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
        )[12]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.effectiveEpAdditivation([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueNumberMock,
          subordinateDataMock.dataItemUnitMock
        )[12],
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
        )[13]
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
        )[14]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.lowFriction([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[14],
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
        )[15]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.suitableForVibrations([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[15],
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
        )[16]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.supportForSeals([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[16],
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
        )[17]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.h1Registration([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          subordinateDataMock.dataItemValueStringMock,
          subordinateDataMock.dataItemUnitMock
        )[17],
        values: 'calculationResult.undefinedValue',
      });
    });
  });
});
