import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { greaseResultDataMock } from '../../../mocks/grease-result.mock';
import * as tableMock from '../../../mocks/table.mock';
import * as en from '../../i18n/en.json';
import { Field } from '../../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    translateKey in en ? en[translateKey] : translateKey
  ),
}));

describe('GreaseResultDataSourceService', () => {
  let spectator: SpectatorService<GreaseResultDataSourceService>;
  let service: GreaseResultDataSourceService;
  const localizeNumber = jest.fn((number) => `${number}`);

  const createService = createServiceFactory({
    service: GreaseResultDataSourceService,
    imports: [provideTranslocoTestingModule({ en })],
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
        [{ ...tableMock.tableItemNumberMock, field: Field.QVIN }],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[0]
      );
    });

    it('should return undefined', () => {
      const item = service.initialGreaseQuantity([], tableMock.rhoMock);

      expect(item).toBeUndefined();
    });
  });

  describe('manualRelubricationQuantityInterval', () => {
    it('should return the data source item', () => {
      const item = service.manualRelubricationQuantityInterval(
        [
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_MAN_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_MAN_MAX },
          { ...tableMock.tableItemNumberMock, field: Field.TFR_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.TFR_MAX },
        ],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[1]
      );
    });

    it('should return undefined', () => {
      const item = service.manualRelubricationQuantityInterval(
        [],
        tableMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationQuantityPerDay', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationQuantityPerDay(
        [
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
          { ...tableMock.tableItemNumberMock, field: Field.QVIN },
        ],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[2]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationQuantityPerDay(
        [],
        tableMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('greaseServiceLife', () => {
    it('should return the data source item', () => {
      const item = service.greaseServiceLife([
        { ...tableMock.tableItemNumberMock, field: Field.TFG_MIN },
        { ...tableMock.tableItemNumberMock, field: Field.TFG_MAX },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
          { ...tableMock.tableItemNumberMock, field: Field.QVIN },
        ],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[4]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationPerWeek([], tableMock.rhoMock);

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerMonth', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationPerMonth(
        [
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
          { ...tableMock.tableItemNumberMock, field: Field.QVIN },
        ],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[5]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationPerMonth(
        [],
        tableMock.rhoMock
      );

      expect(item).toBeUndefined();
    });
  });

  describe('automaticRelubricationPerYear', () => {
    it('should return the data source item', () => {
      const item = service.automaticRelubricationPerYear(
        [
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MIN },
          { ...tableMock.tableItemNumberMock, field: Field.QVRE_AUT_MAX },
          { ...tableMock.tableItemNumberMock, field: Field.QVIN },
        ],
        tableMock.rhoMock
      );

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[6]
      );
    });

    it('should return undefined', () => {
      const item = service.automaticRelubricationPerYear([], tableMock.rhoMock);

      expect(item).toBeUndefined();
    });
  });

  describe('viscosityRatio', () => {
    it('should return the data source item', () => {
      const item = service.viscosityRatio([
        { ...tableMock.tableItemNumberMock, field: Field.KAPPA },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
        { ...tableMock.tableItemNumberMock, field: Field.NY40 },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
        { ...tableMock.tableItemNumberMock, field: Field.T_LIM_LOW },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
        { ...tableMock.tableItemNumberMock, field: Field.T_LIM_UP },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
        { ...tableMock.tableItemStringMock, field: Field.ADD_REQ },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[11]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.additiveRequired([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[11],
        values: 'undefinedValue',
      });
    });
  });

  describe('effectiveEpAdditivation', () => {
    it('should return the data source item', () => {
      const item = service.effectiveEpAdditivation([
        { ...tableMock.tableItemNumberMock, field: Field.ADD_W },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[12]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.effectiveEpAdditivation([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
        )[12],
        values: 'undefinedValue',
      });
    });
  });

  describe('density', () => {
    it('should return the data source item', () => {
      const item = service.density([
        { ...tableMock.tableItemNumberMock, field: Field.RHO },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueNumber,
          tableMock.mockTableItemUnit
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
        { ...tableMock.tableItemStringMock, field: Field.F_LOW, value: '0' },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[14]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.lowFriction([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[14],
        values: 'undefinedValue',
      });
    });
  });

  describe('suitableForVibrations', () => {
    it('should return the data source item', () => {
      const item = service.suitableForVibrations([
        { ...tableMock.tableItemStringMock, field: Field.VIP, value: '0' },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[15]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.suitableForVibrations([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[15],
        values: 'undefinedValue',
      });
    });
  });

  describe('supportForSeals', () => {
    it('should return the data source item', () => {
      const item = service.supportForSeals([
        { ...tableMock.tableItemStringMock, field: Field.SEAL, value: '0' },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[16]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.supportForSeals([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[16],
        values: 'undefinedValue',
      });
    });
  });

  describe('h1Registration', () => {
    it('should return the data source item', () => {
      const item = service.h1Registration([
        { ...tableMock.tableItemStringMock, field: Field.NSF_H1 },
      ]);

      expect(item).toStrictEqual(
        greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[17]
      );
    });

    it('should return object with undefined value', () => {
      const item = service.h1Registration([]);

      expect(item).toStrictEqual({
        ...greaseResultDataMock(
          tableMock.mockTableItemValueString,
          tableMock.mockTableItemUnit
        )[17],
        values: 'undefinedValue',
      });
    });
  });
});
