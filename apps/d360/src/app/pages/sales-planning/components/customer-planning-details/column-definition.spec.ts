import { TranslocoModule } from '@jsverse/transloco';

import {
  getColumnDefinitions,
  getTitle,
  TimeScope,
  valueFormatters,
} from './column-definition';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('Column Definitions', () => {
  describe('valueFormatters', () => {
    it('should format monetary values correctly', () => {
      const mockNumberPipe = {
        transform: jest.fn().mockReturnValue('1,000.00'),
      };
      const params = {
        value: 1000,
        context: { numberPipe: mockNumberPipe },
        data: { planningCurrency: 'USD' },
      };
      expect(valueFormatters.monetary(params)).toBe('1,000.00 USD');
      expect(mockNumberPipe.transform).toHaveBeenCalledWith(1000);
    });

    it('should return "-" for monetary value of -1', () => {
      const params = { value: -1, context: {}, data: {} };
      expect(valueFormatters.monetary(params)).toBe('-');
    });

    it('should format percentage values correctly', () => {
      const params = { value: 50 };
      expect(valueFormatters.percentage(params)).toBe('50 %');
    });

    it('should return "-" for percentage value of -1', () => {
      const params = { value: -1 };
      expect(valueFormatters.percentage(params)).toBe('-');
    });

    it('should format months correctly', () => {
      const params = { value: 'january' };
      expect(valueFormatters.months(params)).toBe(
        'sales_planning.table.months.january'
      );
    });

    it('should return undefined for default formatter', () => {
      expect(valueFormatters.default).toBeUndefined();
    });
  });

  describe('getTitle', () => {
    it('should generate title with time scope', () => {
      const title = getTitle('key', true, TimeScope.Yearly);
      expect(title).toBe(
        'sales_planning.table.yearly sales_planning.table.key'
      );
    });

    it('should generate title without time scope', () => {
      const title = getTitle('key', false, TimeScope.Monthly);
      expect(title).toBe('sales_planning.table.key');
    });
  });

  describe('getColumnDefinitions', () => {
    it('should return correct column definitions for yearly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Yearly);
      expect(columns).toBeInstanceOf(Array);
      expect(
        columns.some((col) => col.colId === 'totalSalesPlanConstrained')
      ).toBe(true);
      expect(columns.some((col) => col.visible)).toBe(true);
    });

    it('should return correct column definitions for monthly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Monthly);
      expect(columns).toBeInstanceOf(Array);
      expect(columns.some((col) => col.colId === 'planningMonth')).toBe(true);
      expect(columns.some((col) => col.visible)).toBe(true);
    });

    it('should not return planningMonth for yearly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Yearly);
      expect(columns).toBeInstanceOf(Array);
      expect(columns.some((col) => col.colId === 'planningMonth')).toBe(false);
    });

    it('should apply default properties to column definitions', () => {
      const columns = getColumnDefinitions(TimeScope.Yearly);
      const sampleColumn = columns.find(
        (col) => col.colId === 'budgetNetSales'
      );
      expect(sampleColumn).toMatchObject({
        sortable: false,
        alwaysVisible: false,
        valueFormatter: valueFormatters.monetary,
      });
    });

    it('should handle time-scope-specific columns', () => {
      const columns = getColumnDefinitions(TimeScope.Yearly);
      const timeScopeColumn = columns.find(
        (col) => col.colId === 'totalSalesPlanAdjusted'
      );
      expect(timeScopeColumn).toMatchObject({
        isTimeScopeSpecific: true,
        title:
          'sales_planning.table.yearly sales_planning.table.totalSalesPlanAdjusted',
      });
    });

    it('should include planningMonth column for monthly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Monthly);
      const planningMonthColumn = columns.find(
        (col) => col.colId === 'planningMonth'
      );
      expect(planningMonthColumn).toBeDefined();
      expect(planningMonthColumn?.title).toBe(
        'sales_planning.table.planningMonth'
      );
    });
  });
});
