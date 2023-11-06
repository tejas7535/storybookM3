import { AbstractControl } from '@angular/forms';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import * as XLSX from 'xlsx';

import { ExcelValidatorService } from './excel-validator.service';
import { MANDATORY_COLUMNS } from './excel-validator-config';

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
      service['validateValues'] = jest.fn();
      service['validatePcfValues'] = jest.fn();

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
    const json = [
      // eslint-disable-next-line unicorn/no-array-reduce
      MANDATORY_COLUMNS.reduce((a, b) => ({ ...a, [b]: b }), {}) as {
        [id: string]: string;
      },
    ];
    it('should pass', () => {
      expect(() => service['validateColumns'](json)).not.toThrow();
    });
    it('should throw error if mandatory columns are missing', () => {
      delete json[0]['plant'];
      expect(() => service['validateColumns'](json)).toThrow();
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
});
