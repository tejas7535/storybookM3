import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/core';

import {
  currentYear,
  formatDate,
  formatNumber,
  valueGetterArray,
  valueGetterDate,
} from './column-utils';

registerLocaleData(de);

describe('ColumnUtils', () => {
  describe('currentYear', () => {
    it('should have type number', () => {
      expect(typeof currentYear).toEqual('number');
    });
  });

  describe('formatNumber', () => {
    const params = ({ value: undefined } as unknown) as ValueFormatterParams;
    let result: string;

    it('should cut decimals, if number does not have decimals', () => {
      params.value = 10000;

      result = formatNumber(params);

      expect(result).toEqual('10.000');
    });

    it('should round value to two decimals', () => {
      params.value = 10.357;

      result = formatNumber(params);

      expect(result).toEqual('10,36');
    });
  });

  describe('formatDate', () => {
    it('should transform to medium output format', () => {
      const params = ({
        value: new Date(1591354306000),
      } as unknown) as ValueFormatterParams;

      const result = formatDate(params);

      expect(result).toEqual('05.06.2020');
    });
  });

  describe('valueGetterDate', () => {
    it('should return undefined if data is not defined yet', () => {
      const params = ({} as unknown) as ValueGetterParams;

      const result = valueGetterDate(params, 'gpcDate');

      expect(result).toBeUndefined();
    });

    it('should transform timestamp into Date', () => {
      const params = ({
        data: { gpcDate: 1591354306000 },
      } as unknown) as ValueGetterParams;

      const result = valueGetterDate(params, 'gpcDate');

      expect(result.getFullYear()).toEqual(2020);
    });
  });

  describe('valueGetterArray', () => {
    const params = ({
      data: { actualQuantities: [10, 20, 30, 40] },
    } as unknown) as ValueGetterParams;

    let key: string;
    let result: number;

    it('should return undefined if data is not defined', () => {
      result = valueGetterArray(
        ({} as unknown) as ValueGetterParams,
        undefined,
        0
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined if key is not defined', () => {
      key = 'plannedQuantities';

      result = valueGetterArray(params, key, 0);

      expect(result).toBeUndefined();
    });

    it('should return the correct value', () => {
      key = 'actualQuantities';

      result = valueGetterArray(params, key, 1);

      expect(result).toEqual(20);
    });
  });
});
