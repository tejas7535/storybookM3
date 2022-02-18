import {
  GetMainMenuItemsParams,
  MenuItemDef,
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-enterprise/all-modules';

import {
  currentYear,
  filterParamsForDecimalValues,
  formatLongValue,
  formatMaterialNumber,
  formatMaterialNumberFromString,
  getMainMenuItems,
  matchAllFractionsForIntegerValue,
  valueGetterDate,
  valueGetterFromArray,
} from './column-utils';

describe('ColumnUtils', () => {
  describe('currentYear', () => {
    it('should have type number', () => {
      expect(typeof currentYear).toEqual('number');
    });
  });

  describe('formatMaterialNumber', () => {
    it('should transform to a material number format', () => {
      const params = {
        value: '1111111112222',
      } as unknown as ValueFormatterParams;

      const result = formatMaterialNumber(params);

      expect(result).toContain('-2222');
    });
  });

  describe('formatMaterialNumberFromString', () => {
    it('should transform to a material number format', () => {
      const result = formatMaterialNumberFromString('1111111112222');

      expect(result).toContain('-2222');
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
        data: { gpcDate: 1_591_354_306_000 },
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
      result = valueGetterFromArray(
        {} as unknown as ValueGetterParams,
        'key',
        0
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined if key is not defined', () => {
      key = 'plannedQuantities';

      result = valueGetterFromArray(params, key, 0);

      expect(result).toBeUndefined();
    });

    it('should return the correct value', () => {
      key = 'actualQuantities';

      result = valueGetterFromArray(params, key, 1);

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

  describe('transformGermanFractionSeparator', () => {
    it('should parse incoming string as number', () => {
      const result = filterParamsForDecimalValues.numberParser('42');

      expect(result).toBe(42);
    });

    it('should return undefined for incoming null values', () => {
      // eslint-disable-next-line unicorn/no-null
      const result = filterParamsForDecimalValues.numberParser(null);

      expect(result).toBe(undefined);
    });

    it('should replace comma with dot as the fractional separator', () => {
      const result = filterParamsForDecimalValues.numberParser('42,567');

      expect(result).toEqual(42.567);
    });
  });

  describe('matchAllFractionsForIntegerValue', () => {
    it('should match all integers with any fractions for equals integer filter', () => {
      const result = matchAllFractionsForIntegerValue(42, 42.678);

      expect(result).toBeTruthy();
    });

    it('should match equal integers', () => {
      const result = matchAllFractionsForIntegerValue(42, 42);

      expect(result).toBeTruthy();
    });

    it('should only be usable for integers without fraction', () => {
      const result = matchAllFractionsForIntegerValue(42.897, 42.998);

      expect(result).toBeFalsy();
    });

    it('should not match for different integers values', () => {
      const result = matchAllFractionsForIntegerValue(42, 43.678);

      expect(result).toBeFalsy();
    });
  });
});
