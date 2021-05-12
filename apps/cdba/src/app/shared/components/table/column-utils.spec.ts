import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import {
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-enterprise/all-modules';

import {
  currentYear,
  formatDate,
  formatLongValue,
  formatMaterialNumber,
  formatNumber,
  getMainMenuItems,
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
    const params = { value: undefined } as unknown as ValueFormatterParams;
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
      const params = {
        value: new Date(1591354306000),
      } as unknown as ValueFormatterParams;

      const result = formatDate(params);

      expect(result).toEqual('05.06.2020');
    });
  });

  describe('formatMaterialNumber', () => {
    it('should transform to a material number format', () => {
      const params = {
        value: '1111111112222',
      } as unknown as ValueFormatterParams;

      const result = formatMaterialNumber(params);

      expect(result).toEqual('111111111-2222');
    });
  });

  describe('formatLongValue', () => {
    it('should transform a string that has a value that is too long', () => {
      const params = {
        value:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam volu',
      } as unknown as ValueFormatterParams;

      const result = formatLongValue(params);

      expect(result).toEqual(
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l...'
      );
    });
  });

  describe('valueGetterDate', () => {
    it('should return undefined if data is not defined yet', () => {
      const params = {} as unknown as ValueGetterParams;

      const result = valueGetterDate(params, 'gpcDate');

      expect(result).toBeUndefined();
    });

    it('should transform timestamp into Date', () => {
      const params = {
        data: { gpcDate: 1591354306000 },
      } as unknown as ValueGetterParams;

      const result = valueGetterDate(params, 'gpcDate');

      expect(result.getFullYear()).toEqual(2020);
    });
  });

  describe('valueGetterArray', () => {
    const params = {
      data: { actualQuantities: [10, 20, 30, 40] },
    } as unknown as ValueGetterParams;

    let key: string;
    let result: number;

    it('should return undefined if data is not defined', () => {
      result = valueGetterArray(
        {} as unknown as ValueGetterParams,
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

  describe('getMainMenuItems', () => {
    it('should add custom reset menu items', () => {
      const mockParams = {
        defaultItems: ['foo', 'bar', 'resetColumns'],
      } as unknown as GetMainMenuItemsParams;

      const result = getMainMenuItems(mockParams);

      const resetFilterItem = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' &&
          item.name === 'shared.table.columnMenu.resetFilter.menuEntry'
      );

      expect(resetFilterItem).toBeDefined();

      const resetTableItem = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' &&
          item.name === 'shared.table.columnMenu.resetTable.menuEntry'
      );

      expect(resetTableItem).toBeDefined();
    });

    it('should call api to reset filter state when calling the menu item reset filter', () => {
      const mockParams = {
        defaultItems: ['foo', 'bar', 'resetColumns'],
        api: { setFilterModel: jest.fn() },
      } as unknown as GetMainMenuItemsParams;

      const result = getMainMenuItems(mockParams);

      const menuItem: MenuItemDef = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' &&
          item.name === 'shared.table.columnMenu.resetFilter.menuEntry'
      ) as MenuItemDef;

      menuItem.action();

      expect(mockParams.api.setFilterModel).toHaveBeenCalled();
    });

    it('should reset entire table when calling the menu item reset table', () => {
      const mockParams = {
        defaultItems: ['foo', 'bar', 'resetColumns'],
        api: {
          setFilterModel: jest.fn(),
        },
        columnApi: {
          resetColumnGroupState: jest.fn(),
          resetColumnState: jest.fn(),
        },
      } as unknown as GetMainMenuItemsParams;

      const result = getMainMenuItems(mockParams);

      const menuItem: MenuItemDef = result.find(
        (item: string | MenuItemDef) =>
          typeof item !== 'string' &&
          item.name === 'shared.table.columnMenu.resetTable.menuEntry'
      ) as MenuItemDef;

      menuItem.action();

      expect(mockParams.api.setFilterModel).toHaveBeenCalled();
      expect(mockParams.columnApi.resetColumnGroupState).toHaveBeenCalled();
      expect(mockParams.columnApi.resetColumnState).toHaveBeenCalled();
    });
  });
});
