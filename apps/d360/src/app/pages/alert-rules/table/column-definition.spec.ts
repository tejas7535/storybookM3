import { GridTooltipComponent } from '../../../shared/components/ag-grid/grid-tooltip/grid-tooltip.component';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';
import { Stub } from '../../../shared/test/stub.class';
import {
  alertRuleColumnDefinitions,
  dateFilterCellValueComparator,
} from './column-definition';

describe('AlertRule ColumnDefinition', () => {
  let agGridLocalizationService: AgGridLocalizationService;

  beforeEach(() => {
    agGridLocalizationService = Stub.get<AgGridLocalizationService>({
      component: AgGridLocalizationService,
    });
  });

  describe('dateFilterCellValueComparator', () => {
    it('should return -1 when cellDate is less than filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date(2023, 0, 2),
        '2022-12-31T14:00:00Z'
      );

      expect(result).toEqual(-1);
    });

    it('should return 1 when cellDate is greater than filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date(2022, 0, 2),
        '2023-01-01T14:00:00Z'
      );

      expect(result).toEqual(1);
    });

    it('should return 0 when cellDate is equal to filterLocalDateAtMidnight', () => {
      const result = dateFilterCellValueComparator(
        new Date('2023-01-01T14:00:00Z'),
        '2023-01-01T14:00:00Z'
      );

      expect(result).toEqual(0);
    });

    it('should return 0 when dateAsString is null', () => {
      const result = dateFilterCellValueComparator(new Date(), null);

      expect(result).toEqual(0);
    });
  });

  describe('alertRuleColumnDefinitions', () => {
    it('should return an array of column definitions with correct properties', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);

      result.forEach((column) => {
        expect(column).toHaveProperty('colId');
        expect(typeof column.colId).toEqual('string');
        expect(column).toHaveProperty('title');
        expect(typeof column.title).toEqual('string');
      });
    });

    it('should have a column definition with correct tooltipComponent and tooltipComponentParams', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const alertCommentColumn = result.find(
        (column) => column.colId === 'alertComment'
      );
      expect(alertCommentColumn).toBeTruthy();
      expect(alertCommentColumn?.tooltipComponent).toEqual(
        GridTooltipComponent
      );
      expect(alertCommentColumn?.maxWidth).toEqual(375);
      expect(alertCommentColumn?.tooltipComponentParams).toEqual({
        wide: true,
        lineBreaks: true,
        textLeft: true,
      });
    });

    it('should configure date columns with correct formatters and filters', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const startDateColumn = result.find(
        (column) => column.colId === 'startDate'
      );
      const endDateColumn = result.find((column) => column.colId === 'endDate');

      expect(startDateColumn).toBeTruthy();
      expect(startDateColumn?.filter).toEqual('agDateColumnFilter');
      expect(startDateColumn?.valueFormatter).toBe(
        agGridLocalizationService.dateFormatter
      );
      expect(startDateColumn?.filterParams).toEqual({
        comparator: dateFilterCellValueComparator,
      });

      expect(endDateColumn).toBeTruthy();
      expect(endDateColumn?.filter).toEqual('agDateColumnFilter');
      expect(endDateColumn?.valueFormatter).toBe(
        agGridLocalizationService.dateFormatter
      );
      expect(endDateColumn?.filterParams).toEqual({
        comparator: dateFilterCellValueComparator,
      });

      const execDayColumn: any = result.find(
        (column) => column.colId === 'execDay'
      );
      expect(execDayColumn).toBeTruthy();
      expect(execDayColumn?.valueFormatter({ value: 'abc' } as any)).toBe(
        `alert_rules.edit_modal.label.when.abc`
      );

      const execIntervalColumn: any = result.find(
        (column) => column.colId === 'execInterval'
      );
      expect(execIntervalColumn).toBeTruthy();
      expect(execIntervalColumn?.valueFormatter({ value: 'abc' } as any)).toBe(
        `alert_rules.edit_modal.label.interval.abc`
      );

      const deactivatedColumn: any = result.find(
        (column) => column.colId === 'deactivated'
      );
      expect(deactivatedColumn).toBeTruthy();
      expect(deactivatedColumn?.cellRenderer({ value: 'abc' } as any)).toBe(
        `alert_rules.table.deactivated.abc`
      );
      expect(
        deactivatedColumn?.filterParams?.valueFormatter({ value: 'abc' } as any)
      ).toBe(`alert_rules.table.deactivated.abc`);
    });

    it('should configure number columns with correct formatters and filters', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const threshold1Column = result.find(
        (column) => column.colId === 'threshold1'
      );

      expect(threshold1Column).toBeTruthy();
      expect(threshold1Column?.filter).toEqual('agNumberColumnFilter');
      expect(threshold1Column?.valueFormatter).toBe(
        agGridLocalizationService.numberFormatter
      );
    });

    it('should configure deactivated column with correct cellRenderer and filter', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const deactivatedColumn = result.find(
        (column) => column.colId === 'deactivated'
      );

      expect(deactivatedColumn).toBeTruthy();
      expect(deactivatedColumn?.filter).toEqual('agSetColumnFilter');
      expect(deactivatedColumn?.filterParams).toEqual({
        values: [true, false],
        valueFormatter: expect.any(Function),
      });
      expect(deactivatedColumn?.alwaysVisible).toBe(true);
      expect(typeof deactivatedColumn?.cellRenderer).toBe('function');
    });

    it('should mark specific columns as always visible', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const alwaysVisibleColumns = result.filter(
        (column) => column.alwaysVisible
      );

      expect(alwaysVisibleColumns.length).toBeGreaterThan(0);
      expect(alwaysVisibleColumns.map((column) => column.colId)).toContain(
        'customerNumber'
      );
      expect(alwaysVisibleColumns.map((column) => column.colId)).toContain(
        'deactivated'
      );
    });

    it('should set correct sortable property for specific columns', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const alertCommentColumn = result.find(
        (column) => column.colId === 'alertComment'
      );
      const threshold1Column = result.find(
        (column) => column.colId === 'threshold1'
      );

      expect(alertCommentColumn?.sortable).toBe(false);
      expect(threshold1Column?.sortable).toBe(true);
    });

    it('should make all columns sortable by default', () => {
      const result = alertRuleColumnDefinitions(agGridLocalizationService);

      const sortableColumns = result.filter((column) => column.sortable);
      const nonSortableColumns = result.filter((column) => !column.sortable);

      // Most columns should be sortable
      expect(sortableColumns.length).toBeGreaterThan(nonSortableColumns.length);
      // Check specific columns that we know should not be sortable
      expect(nonSortableColumns.map((column) => column.colId)).toContain(
        'alertComment'
      );
      expect(nonSortableColumns.map((column) => column.colId)).toContain(
        'threshold1Description'
      );
      expect(nonSortableColumns.map((column) => column.colId)).toContain(
        'threshold2Description'
      );
      expect(nonSortableColumns.map((column) => column.colId)).toContain(
        'threshold3Description'
      );
    });
  });
});
