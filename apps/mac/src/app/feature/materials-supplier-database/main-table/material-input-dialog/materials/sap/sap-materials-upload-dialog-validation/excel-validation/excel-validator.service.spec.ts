import { AbstractControl } from '@angular/forms';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import * as XLSX from 'xlsx';

import { ExcelValidatorService } from './excel-validator.service';
import {
  COLUMN_HEADER_FIELDS,
  MANDATORY_COLUMNS,
} from './excel-validator-config';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

describe('ExcelValidatorService', () => {
  let spectator: SpectatorService<ExcelValidatorService>;
  let service: ExcelValidatorService;

  const createService = createServiceFactory({
    service: ExcelValidatorService,
  });

  const createFile = () => {
    // create a temporary excel file
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['a', 'b', 'c'],
      [1, 2, 3],
      [4, 5, 6],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'test');
    // write file to buffer
    const buffer = XLSX.write(workbook, { type: 'array' });

    // return buffer as file
    return {
      arrayBuffer: () =>
        new Promise((resolve) => {
          resolve(buffer);
        }),
    } as File;
  };

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ExcelValidatorService);
  });
  it('should exist', () => {
    expect(service).toBeTruthy();
  });
  describe('handleFileAsync', () => {
    it('should handle file', (done) => {
      const file = createFile();
      const control = { value: file } as AbstractControl<File>;
      service['validateColumns'] = jest.fn();
      service['checkForMissingValues'] = jest.fn();
      service['validateValues'] = jest.fn();
      service['validatePcfValues'] = jest.fn();
      service['validateMaterialUtilizationFactor'] = jest.fn();
      service['validatePcfSupplierEmissions'] = jest.fn();

      service.validate(control).subscribe((result) => {
        if (result) {
          throw result;
        }
        done();
        // eslint-disable-next-line jest/no-conditional-expect
        expect(service['validateColumns']).toHaveBeenCalled();
        // eslint-disable-next-line jest/no-conditional-expect
        expect(service['validateValues']).toHaveBeenCalled();
      });
    });
  });

  describe('validateColumns', () => {
    it('should pass', () => {
      expect(() =>
        service['validateColumns'](COLUMN_HEADER_FIELDS)
      ).not.toThrow();
    });
    it('should throw error if mandatory columns are missing', () => {
      const columns: string[] = COLUMN_HEADER_FIELDS.filter(
        (column) => column !== MANDATORY_COLUMNS[0]
      );

      expect(() => service['validateColumns'](columns)).toThrow();
    });
  });

  describe('validateValues', () => {
    let json: any;
    beforeEach(() => {
      json = [
        {
          materialNumber: '123456789-1234-12',
          plant: '1234',
          category: 'ABCD',
          materialGroup: 'M123',
          businessPartnerId: '12345',
          supplierId: 'S123456789',
          supplierCountry: 'DE',
          supplierRegion: 'EU',
          emissionFactorKg: 14.1,
          emissionFactorPc: 12.6,
        },
      ];
    });
    it('should pass', () => {
      expect(() => service['validateValues'](json)).not.toThrow();
    });
    it('should throw error if value is invalid', () => {
      json[0].plant = 'AB';
      expect(() => service['validateValues'](json)).toThrow();
    });
    it('should pass if emission factor kg is undefined', () => {
      json[0].emissionFactorKg = undefined;
      expect(() => service['validateValues'](json)).not.toThrow();
    });
    it('should fail if supplierId is 0', () => {
      json[0].supplierId = 0;
      expect(() => service['validateValues'](json)).toThrow();
    });
  });

  describe('validatePcfValues', () => {
    const createJson = (kg?: any, pc?: any) => [
      {
        emissionFactorKg: kg,
        emissionFactorPc: pc,
      },
    ];
    it.each([
      [12.4, 15.6],
      [12.4, undefined],
      [undefined, 15.6],
      ['12.4', '15.6'],
    ])('should pass for kg [%p] and pc [%p]', (kg, pc) => {
      const json = createJson(kg, pc);
      expect(() => service['validatePcfValues'](json)).not.toThrow();
    });

    it.each([
      [undefined, undefined, 'no values'],
      [-12.4, 15.6, 'negative kg value'],
      [12.4, -15.6, 'negative pc value'],
      [0, 15.6, 'zero kg value'],
      [12.4, 0, 'zero pc value'],
      ['invalid', 15.6, 'string in kg value'],
      [12.4, 'invalid', 'string in pc value'],
      ['inv', 'inv', 'string in both values'],
    ])('should fail for kg [%p] and pc [%p], because %p', (kg, pc, _reason) => {
      const json = createJson(kg, pc);
      expect(() => service['validatePcfValues'](json)).toThrow();
    });
  });

  describe('validateMaterialUtilizationFactor', () => {
    const toJson = (factor?: any) => [{ materialUtilizationFactor: factor }];
    it.each([0.4, 0.000_01, 0.999_999_999_99, 1, 0, undefined])(
      'should pass for MaterialUtilizationFactor [%p]',
      (factor: number) => {
        expect(() =>
          service['validateMaterialUtilizationFactor'](toJson(factor))
        ).not.toThrow();
      }
    );
    it.each([-0.1, 1.000_000_1, -0.000_000_000_1, 'test'])(
      'should fail for MaterialUtilizationFactor [%p]',
      (factor: any) => {
        expect(() =>
          service['validateMaterialUtilizationFactor'](toJson(factor))
        ).toThrow();
      }
    );
  });

  describe('validatePcfSupplierEmissions', () => {
    const createJson = (
      emissionFactorKg?: any,
      directSupplierEmissions?: any,
      indirectSupplierEmissions?: any,
      upstreamEmissions?: any
    ) => [
      {
        emissionFactorKg,
        directSupplierEmissions,
        indirectSupplierEmissions,
        upstreamEmissions,
      },
    ];
    it.each([
      [25.5, 10.5, 5, 10],
      [5.25, undefined, 2.5, 2],
      [5.25, 2.5, undefined, 2],
      [5.25, 2.5, 2, undefined],
      [5.25, 5.24, undefined, undefined],
      [5.25, undefined, undefined, undefined],
      [undefined, undefined, undefined, undefined],
    ])(
      'should pass for emissionFactorKg [%p], directSupplierEmissions [%p], indirectSupplierEmissions [%p], upstreamEmissions [%p]',
      (
        emissionFactorKg,
        directSupplierEmissions,
        indirectSupplierEmissions,
        upstreamEmissions
      ) => {
        const json = createJson(
          emissionFactorKg,
          directSupplierEmissions,
          indirectSupplierEmissions,
          upstreamEmissions
        );
        expect(() =>
          service['validatePcfSupplierEmissions'](json)
        ).not.toThrow();
      }
    );

    it.each([
      [25.5, 10, 5.5, 15.5],
      [25.5, 25.5, undefined, undefined],
      [25.5, undefined, 25.6, undefined],
      [25.5, undefined, undefined, 30],
      [undefined, 10, 5.5, 15.5],
      [undefined, undefined, 5.5, undefined],
    ])(
      'should fail for emissionFactorKg [%p], directSupplierEmissions [%p], indirectSupplierEmissions [%p], upstreamEmissions [%p]',
      (
        emissionFactorKg,
        directSupplierEmissions,
        indirectSupplierEmissions,
        upstreamEmissions
      ) => {
        const json = createJson(
          emissionFactorKg,
          directSupplierEmissions,
          indirectSupplierEmissions,
          upstreamEmissions
        );
        expect(() => service['validatePcfSupplierEmissions'](json)).toThrow();
      }
    );
  });

  describe('checkForMissingValues', () => {
    // eslint-disable-next-line unicorn/no-array-reduce
    const json = MANDATORY_COLUMNS.reduce(
      (acc, cur) => ({ ...acc, [cur]: 1 }),
      {}
    );
    it('should pass', () => {
      expect(() => service['checkForMissingValues']([json])).not.toThrow();
    });
    it.each(MANDATORY_COLUMNS)(
      'should not pass for missing [%p]',
      (column: string) => {
        const invalid: any = { ...json };
        delete invalid[column];
        expect(() => service['checkForMissingValues']([invalid])).toThrow();
      }
    );
  });
});
