import {
  getColumnDefinitions,
  getTitle,
  TimeScope,
  valueFormatters,
} from './column-definition';

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
        sortable: true,
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

    it('should set appropriate cell renderers for editable cells in yearly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Yearly);

      const salesDeductionColumn = columns.find(
        (col) => col.colId === 'salesDeduction'
      );
      expect(salesDeductionColumn?.cellRenderer).toBeDefined();

      const cashDiscountColumn = columns.find(
        (col) => col.colId === 'cashDiscount'
      );
      expect(cashDiscountColumn?.cellRenderer).toBeDefined();

      const otherRevenuesColumn = columns.find(
        (col) => col.colId === 'otherRevenues'
      );
      expect(otherRevenuesColumn?.cellRenderer).toBeDefined();
    });

    it('should not set cell renderers for editable cells in monthly scope', () => {
      const columns = getColumnDefinitions(TimeScope.Monthly);

      const salesDeductionColumn = columns.find(
        (col) => col.colId === 'salesDeduction'
      );
      expect(salesDeductionColumn?.cellRenderer).toBeUndefined();

      const cashDiscountColumn = columns.find(
        (col) => col.colId === 'cashDiscount'
      );
      expect(cashDiscountColumn?.cellRenderer).toBeUndefined();

      const otherRevenuesColumn = columns.find(
        (col) => col.colId === 'otherRevenues'
      );
      expect(otherRevenuesColumn?.cellRenderer).toBeUndefined();
    });

    it('should set appropriate cell renderer for totalSalesPlanAdjusted', () => {
      const yearlyColumns = getColumnDefinitions(TimeScope.Yearly);
      const adjustedTotalColumn = yearlyColumns.find(
        (col) => col.colId === 'totalSalesPlanAdjusted'
      );

      expect(adjustedTotalColumn?.cellRenderer).toBeDefined();
      expect(adjustedTotalColumn?.cellRendererParams).toEqual({
        scope: TimeScope.Yearly,
      });

      const monthlyColumns = getColumnDefinitions(TimeScope.Monthly);
      const monthlyAdjustedTotalColumn = monthlyColumns.find(
        (col) => col.colId === 'totalSalesPlanAdjusted'
      );

      expect(monthlyAdjustedTotalColumn?.cellRenderer).toBeDefined();
      expect(monthlyAdjustedTotalColumn?.cellRendererParams).toEqual({
        scope: TimeScope.Monthly,
      });
    });
  });

  describe('customComparatorForCustomerPlanningDetails', () => {
    const {
      customComparatorForCustomerPlanningDetails,
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
    } = require('./column-definition');

    it('should return 0 when comparing rows where either node is at level 0', () => {
      const nodeA = { level: 0 };
      const nodeB = { level: 1 };

      expect(
        customComparatorForCustomerPlanningDetails('a', 'b', nodeA, nodeB)
      ).toBe(0);
      expect(
        customComparatorForCustomerPlanningDetails('a', 'b', nodeB, nodeA)
      ).toBe(0);
    });

    it('should return 0 when values are equal', () => {
      const nodeA = { level: 1 };
      const nodeB = { level: 1 };

      expect(
        customComparatorForCustomerPlanningDetails('a', 'a', nodeA, nodeB)
      ).toBe(0);
      expect(
        customComparatorForCustomerPlanningDetails(null, null, nodeA, nodeB)
      ).toBe(0);
      expect(
        customComparatorForCustomerPlanningDetails(
          undefined,
          undefined,
          nodeA,
          nodeB
        )
      ).toBe(0);
    });

    it('should return 1 when valueA > valueB', () => {
      const nodeA = { level: 1 };
      const nodeB = { level: 1 };

      expect(
        customComparatorForCustomerPlanningDetails('b', 'a', nodeA, nodeB)
      ).toBe(1);
    });

    it('should return -1 when valueA < valueB', () => {
      const nodeA = { level: 1 };
      const nodeB = { level: 1 };

      expect(
        customComparatorForCustomerPlanningDetails('a', 'b', nodeA, nodeB)
      ).toBe(-1);
    });

    it('should handle null and undefined values correctly', () => {
      const nodeA = { level: 1 };
      const nodeB = { level: 1 };

      // undefined is not > 'a', so should return -1
      expect(
        customComparatorForCustomerPlanningDetails(undefined, 'a', nodeA, nodeB)
      ).toBe(-1);

      // 'a' is > undefined, so should return 1
      expect(
        customComparatorForCustomerPlanningDetails('a', undefined, nodeA, nodeB)
      ).toBe(-1);

      // null is not > 'a', so should return -1
      expect(
        customComparatorForCustomerPlanningDetails(null, 'a', nodeA, nodeB)
      ).toBe(-1);

      // 'a' is > null, so should return 1
      expect(
        customComparatorForCustomerPlanningDetails('a', null, nodeA, nodeB)
      ).toBe(-1);
    });
  });
});
