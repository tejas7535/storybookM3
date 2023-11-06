import { of } from 'rxjs';

import { TranslocoModule } from '@ngneat/transloco';
import {
  ColDef,
  SetFilterValuesFuncParams,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';

import { Status } from '@mac/feature/materials-supplier-database/constants';
import {
  DataResult,
  SAPMaterial,
} from '@mac/feature/materials-supplier-database/models';

import { getStatus } from '../../util';
import {
  BOOLEAN_VALUE_GETTER,
  CUSTOM_DATE_FORMATTER,
  DATE_COMPARATOR,
  DISTINCT_VALUE_GETTER,
  EMISSION_FACTORS_FORMATTER,
  EMPTY_VALUE_FORMATTER,
  excludeColumn,
  lockColumns,
  MANUFACTURER_VALUE_GETTER,
  MATERIALSTANDARD_LINK_FORMATTER,
  MATERIALSTOFFID_LINK_FORMATTER,
  MATURITY_FORMATTER,
  RECYCLING_RATE_FILTER_VALUE_GETTER,
  RECYCLING_RATE_VALUE_GETTER,
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
  replaceColumn,
  SELF_CERTIFIED_VALUE_GETTER,
  STATUS_VALUE_GETTER,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from './index';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getStatus: jest.fn(),
}));

describe('helpers', () => {
  describe('BOOLEAN_VALUE_GETTER', () => {
    it('should return a comparable string value of a boolean value', () => {
      const mockGetId = jest.fn(() => 'columnId');
      const mockGetValue = jest.fn(() => 1);
      const mockValueGetterParams = {
        column: {
          getId: mockGetId,
        },
        getValue: mockGetValue,
      } as unknown as ValueGetterParams;

      const expected = '1';
      const result = BOOLEAN_VALUE_GETTER(mockValueGetterParams);

      expect(result).toEqual(expected);
      expect(mockGetId).toHaveBeenCalled();
      expect(mockGetValue).toHaveBeenCalledWith('columnId');
    });
  });

  describe('EMPTY_VALUE_FORMATTER', () => {
    it('should return (Empty) instead of (Blanks)', () => {
      // eslint-disable-next-line unicorn/no-null
      const mockNullParams = { value: null } as ValueFormatterParams;
      const mockUndefinedParams = { value: undefined } as ValueFormatterParams;

      const nullResult = EMPTY_VALUE_FORMATTER(mockNullParams);
      const undefinedResult = EMPTY_VALUE_FORMATTER(mockUndefinedParams);

      expect(nullResult).toBe('(Empty)');
      expect(undefinedResult).toBe('(Empty)');
    });

    it('should return cell value if it is defined', () => {
      const mockParams = { value: 'some value' } as ValueFormatterParams;

      const result = EMPTY_VALUE_FORMATTER(mockParams);

      expect(result).toBe('some value');
    });
  });

  describe('CUSTOM_DATE_FORMATTER', () => {
    it('should return a localized date string', () => {
      const mockParams = {
        value: 1_663_632_000,
      } as ValueFormatterParams;

      const result = CUSTOM_DATE_FORMATTER(mockParams);

      expect(result).toEqual('20/09/2022');
    });
  });

  describe('RELEASE_DATE_VALUE_GETTER', () => {
    it('should return undefined if the releaseDateYear is undefined', () => {
      const mockParams = {
        data: { releaseDateMonth: 1 } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = RELEASE_DATE_VALUE_GETTER(mockParams);

      expect(result).toEqual(undefined);
    });

    it('should return undefined if the releaseDateMonth is undefined', () => {
      const mockParams = {
        data: { releaseDateYear: 2000 } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = RELEASE_DATE_VALUE_GETTER(mockParams);

      expect(result).toEqual(undefined);
    });

    it('should return a date', () => {
      const mockParams = {
        data: {
          releaseDateYear: 2000,
          releaseDateMonth: 1,
        } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = RELEASE_DATE_VALUE_GETTER(mockParams);

      expect(result).toEqual(new Date(2000, 0));
    });
  });

  describe('MANUFACTURER_VALUE_GETTER', () => {
    it('should return yes string if manufacturer is true', () => {
      const mockParams = {
        data: {
          manufacturer: true,
        } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = MANUFACTURER_VALUE_GETTER(mockParams);

      expect(result).toEqual('materialsSupplierDatabase.mainTable.yes');
    });

    it('should return no string if manufacturer is false', () => {
      const mockParams = {
        data: {
          manufacturer: false,
        } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = MANUFACTURER_VALUE_GETTER(mockParams);

      expect(result).toEqual('materialsSupplierDatabase.mainTable.no');
    });
  });

  describe('SELF_CERTIFIED_VALUE_GETTER', () => {
    it('should return yes string if selfCertified is true', () => {
      const mockParams = {
        data: {
          selfCertified: true,
        } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = SELF_CERTIFIED_VALUE_GETTER(mockParams);

      expect(result).toEqual('materialsSupplierDatabase.mainTable.yes');
    });

    it('should return no string if selfCertified is false', () => {
      const mockParams = {
        data: {
          selfCertified: false,
        } as DataResult,
      } as ValueGetterParams<DataResult>;

      const result = SELF_CERTIFIED_VALUE_GETTER(mockParams);

      expect(result).toEqual('materialsSupplierDatabase.mainTable.no');
    });
  });

  describe('RELEASE_DATE_FORMATTER', () => {
    it('should return translation if the value is undefined', () => {
      const mockParams = {
        value: undefined,
      } as ValueFormatterParams<any, Date>;

      const result = RELEASE_DATE_FORMATTER(mockParams);

      expect(result).toEqual(
        'materialsSupplierDatabase.mainTable.columns.releaseDateHistoric'
      );
    });

    it('should return the date as string formatted to MM/YY', () => {
      const mockParams = {
        value: new Date(2000, 0),
      } as ValueFormatterParams<any, Date>;

      const result = RELEASE_DATE_FORMATTER(mockParams);

      expect(result).toEqual('01/00');
    });
  });

  describe('STATUS_VALUE_GETTER', () => {
    it('should return the translated value from getStatus', () => {
      const mockParams = {
        data: {
          blocked: false,
          lastModified: 1,
        },
      } as unknown as ValueGetterParams;
      (getStatus as jest.Mock).mockReturnValue(Status.CHANGED);

      const result = STATUS_VALUE_GETTER(mockParams);

      expect(getStatus).toHaveBeenCalledWith(false, 1);
      expect(result).toEqual(
        `materialsSupplierDatabase.status.statusValues.${Status.CHANGED}`
      );
    });
  });

  describe('TRANSLATE_VALUE_FORMATTER_FACTORY', () => {
    it('should return undefined if the value is undefined', () => {
      const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY();
      const params = { value: undefined } as ValueFormatterParams;

      const result = formatter(params);

      expect(result).toEqual(undefined);
    });

    it('should return the translated value', () => {
      const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY();
      const params = { value: 'something' } as ValueFormatterParams;

      const result = formatter(params);

      expect(result).toEqual('something');
    });

    it('should return the translated value with empty prefix', () => {
      const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY('');
      const params = { value: 'something' } as ValueFormatterParams;

      const result = formatter(params);

      expect(result).toEqual('something');
    });

    it('should return the translated value with prefix', () => {
      const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY('prefix');
      const params = { value: 'something' } as ValueFormatterParams;

      const result = formatter(params);

      expect(result).toEqual('prefix.something');
    });

    it('should return the translated value with the input in lower case', () => {
      const formatter = TRANSLATE_VALUE_FORMATTER_FACTORY('prefix', true);
      const params = { value: 'SOMETHING' } as ValueFormatterParams;

      const result = formatter(params);

      expect(result).toEqual('prefix.something');
    });
  });

  describe('DATE_COMPARATOR', () => {
    it('should be equal with same date and different time', () => {
      // filterValue will always be at midnight
      const filterValue = new Date(2000, 11, 31);
      // cellValue will have all properties set
      const cellValue = new Date(2000, 11, 31, 12, 30).getTime() / 1000;

      expect(DATE_COMPARATOR(filterValue, cellValue)).toBe(0);
    });
    it('should compare according to difference in date, cell value before', () => {
      // filterValue will always be at midnight
      const filterValue = new Date(2000, 11, 31);
      // cellValue will have all properties set
      const cellValue = new Date(2000, 11, 30, 12, 30).getTime() / 1000;

      expect(DATE_COMPARATOR(filterValue, cellValue)).toBeLessThan(0);
    });
    it('should compare according to difference in date, cell value after', () => {
      // filterValue will always be at midnight
      const filterValue = new Date(2000, 10, 15);
      // cellValue will have all properties set
      const cellValue = new Date(2000, 10, 16, 12, 30).getTime() / 1000;

      expect(DATE_COMPARATOR(filterValue, cellValue)).toBeGreaterThan(0);
    });
  });

  describe('RECYCLING_RATE_VALUE_GETTER', () => {
    it('should return undefined', () => {
      const mockParams = {
        data: {},
      } as ValueGetterParams;
      const result = RECYCLING_RATE_VALUE_GETTER(mockParams);

      expect(result).toBeFalsy();
    });
    it('should return the value as range', () => {
      const mockParams = {
        data: {
          minRecyclingRate: 55,
          maxRecyclingRate: 77,
        },
      } as ValueGetterParams;
      const result = RECYCLING_RATE_VALUE_GETTER(mockParams);

      expect(result).toEqual('55-77 %');
    });
    it('should return the value as single value', () => {
      const mockParams = {
        data: {
          minRecyclingRate: 66,
          maxRecyclingRate: 66,
        },
      } as ValueGetterParams;
      const result = RECYCLING_RATE_VALUE_GETTER(mockParams);

      expect(result).toEqual('66 %');
    });
  });
  describe('RECYCLING_RATE_FILTER_VALUE_GETTER', () => {
    it('should return the minimum value', () => {
      const mockParams = {
        data: {
          minRecyclingRate: 55,
          maxRecyclingRate: 77,
        },
      } as ValueGetterParams;
      const result = RECYCLING_RATE_FILTER_VALUE_GETTER(mockParams);

      expect(result).toEqual(55);
    });
  });

  describe('excludeColumn', () => {
    it('should return the only non excluded columns', () => {
      const cd = (name: string) => ({ field: name } as ColDef);
      const colDefs = [cd('1'), cd('2'), cd('3')];
      const columns = ['1', '3'];
      const expected = [cd('2')];

      expect(excludeColumn(columns, colDefs)).toEqual(expected);
    });
  });

  describe('replaceColumn', () => {
    it('should return the only non excluded columns', () => {
      const cd = (name: string, width = 20) =>
        ({ field: name, width } as ColDef);
      const colDefs = [cd('1'), cd('2'), cd('3')];
      const columns = [cd('4', 99), cd('1', 99)];
      const expected = [cd('1', 99), cd('2'), cd('3')];

      expect(replaceColumn(columns, colDefs)).toEqual(expected);
    });
  });

  describe('lockColumns', () => {
    it('should lock columns', () => {
      const cd = (name: string, locked?: boolean) =>
        ({ field: name, lockVisible: locked, hide: !locked } as ColDef);
      const colDefs = [cd('1'), cd('2'), cd('3')];
      const columns = ['1', '3'];
      const expected = [cd('1', true), cd('2'), cd('3', true)];

      expect(lockColumns(columns, colDefs)).toEqual(expected);
    });
  });

  describe('link-value-formatter material standard', () => {
    const params = (value?: string) => ({ value } as ValueFormatterParams);

    it('should make link to S standard', () => {
      expect(MATERIALSTANDARD_LINK_FORMATTER(params('S 654321'))).toBeTruthy();
      expect(
        MATERIALSTANDARD_LINK_FORMATTER(params('S 123456-3'))
      ).toBeTruthy();
    });
    it('should make link to 0812 standard', () => {
      expect(
        MATERIALSTANDARD_LINK_FORMATTER(params('0_812_4ERT'))
      ).toBeTruthy();
      expect(
        MATERIALSTANDARD_LINK_FORMATTER(params('0_812_4567'))
      ).toBeTruthy();
    });
    it('should make link to DIN standard', () => {
      expect(
        MATERIALSTANDARD_LINK_FORMATTER(params('DIN EN 123'))
      ).toBeTruthy();
    });
    it('should not make a link to invalid standard', () => {
      expect(MATERIALSTANDARD_LINK_FORMATTER(params('sth'))).toBeFalsy();
    });
    it('should not make a link to null', () => {
      expect(MATERIALSTANDARD_LINK_FORMATTER(params())).toBeFalsy();
    });
  });
  describe('link-value-formatter stoffId', () => {
    it('should make link to wiam', () => {
      const params = { value: '11', data: {} } as ValueFormatterParams;
      expect(MATERIALSTOFFID_LINK_FORMATTER(params)).toBeTruthy();
    });
    it('should not make a link', () => {
      const params = {} as ValueFormatterParams;
      expect(MATERIALSTOFFID_LINK_FORMATTER(params)).toBeFalsy();
    });
  });

  describe('Distinct-value-getter', () => {
    it('should return the distinct values', (done) => {
      const mockParams = {
        column: { getColId: () => 'columnId' },
        context: {
          dataService: {
            getDistinctSapValues: () => of(['value1', 'value2']),
          },
        },
        success: (values: string[]) => {
          expect(values).toEqual(['value1', 'value2']);
          done();
        },
      } as SetFilterValuesFuncParams;
      DISTINCT_VALUE_GETTER(mockParams);
    });
  });

  describe('MATURITY_FORMATTER', () => {
    it('should return translation and value', () => {
      const testMaturityValue = 10;
      const mockParams = {
        value: testMaturityValue,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = MATURITY_FORMATTER(mockParams);

      expect(result).toEqual(
        `materialsSupplierDatabase.dataSource.${testMaturityValue} (${testMaturityValue})`
      );
    });
  });

  describe('EMISSION_FACTORS_FORMATTER', () => {
    it('should return undefined if value is undefined', () => {
      const mockParams = {
        value: undefined,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = EMISSION_FACTORS_FORMATTER(mockParams);

      expect(result).toBeUndefined();
    });

    it('should return integer', () => {
      const mockParams = {
        value: 2.000_193_939_393_9,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = EMISSION_FACTORS_FORMATTER(mockParams);

      expect(result).toBe('2');
    });

    it('should return 3 decimal places', () => {
      const mockParams = {
        value: 0.000_599_937_273_2,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = EMISSION_FACTORS_FORMATTER(mockParams);

      expect(result).toBe('0.001');
    });

    it('should return 2 decimal places', () => {
      const mockParams = {
        value: 5.200_009_989,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = EMISSION_FACTORS_FORMATTER(mockParams);

      expect(result).toBe('5.2');
    });

    it('should return < 0.001', () => {
      const mockParams = {
        value: 0.000_497_736_272_376,
      } as ValueFormatterParams<SAPMaterial, number>;

      const result = EMISSION_FACTORS_FORMATTER(mockParams);

      expect(result).toBe('< 0.001');
    });
  });
});
