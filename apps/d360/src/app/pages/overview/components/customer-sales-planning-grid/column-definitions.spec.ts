import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { ValueBadgeCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/value-badge-cell-renderer/value-badge-cell-renderer.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { Stub } from '../../../../shared/test/stub.class';
import { CustomerSalesPlanningLayout } from '../../overview.component';
import {
  getColumnDefs,
  moneyFormatter,
  percentageFormatter,
} from './column-definitions';

describe('CustomerSalesPlanningGrid ColumnDefinitions', () => {
  let agGridLocalizationService: AgGridLocalizationService;
  beforeEach(() => {
    agGridLocalizationService = Stub.get({
      component: AgGridLocalizationService,
    });
  });

  describe('moneyFormatter', () => {
    it('should show the formatted number with a currency', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('7,56');
      const result = moneyFormatter(
        {
          value: 7.56,
          data: { currency: 'EUR' },
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('7,56 EUR');
    });

    it('should show an empty string when value is empty', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('');
      const result = moneyFormatter(
        {
          data: { currency: 'EUR' },
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('');
    });

    it('should show an empty string when currency is empty', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('7,56');
      const result = moneyFormatter(
        {
          value: 7.56,
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('7,56');
    });

    it('should show only the formatted number when data is defined but currency is missing', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('7,56');
      const result = moneyFormatter(
        {
          value: 7.56,
          data: {},
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('7,56');
    });

    it('should handle null and undefined values', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('');
      const nullResult = moneyFormatter(
        {
          value: null,
          data: { currency: 'EUR' },
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(nullResult).toBe('');

      const undefinedResult = moneyFormatter(
        {
          value: undefined,
          data: { currency: 'EUR' },
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(undefinedResult).toBe('');
    });
  });

  describe('percentageFormatter', () => {
    it('should show the formatted number with a percentage sign', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('7,56');
      const result = percentageFormatter(
        {
          value: 7.56,
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('7,56 %');
    });

    it('should show an empty string when value is empty', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('');
      const result = moneyFormatter(
        {} as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(result).toBe('');
    });

    it('should handle null and undefined values', () => {
      jest
        .spyOn(agGridLocalizationService, 'numberFormatter')
        .mockReturnValue('');
      const nullResult = percentageFormatter(
        {
          value: null,
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(nullResult).toBe('');

      const undefinedResult = percentageFormatter(
        {
          value: undefined,
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(undefinedResult).toBe('');
    });

    it('should use the correct formatter function with the right precision', () => {
      jest.spyOn(agGridLocalizationService, 'numberFormatter');
      percentageFormatter(
        {
          value: 7.56,
        } as ValueFormatterParams,
        agGridLocalizationService
      );
      expect(agGridLocalizationService.numberFormatter).toHaveBeenCalledWith(
        { value: 7.56 },
        0
      );
    });
  });

  describe('getColumnDefs', () => {
    it('should return columns for an invalid layout with defaults', () => {
      const columns = getColumnDefs(
        agGridLocalizationService,
        'InvalidLayout' as any
      );
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should set the appropriate value formatters for money columns', () => {
      const columns = getColumnDefs(
        agGridLocalizationService,
        CustomerSalesPlanningLayout.PreviousToCurrent
      );

      const moneyColumns = columns.filter((col) =>
        [
          'firmBusinessPreviousYear',
          'yearlyTotalCurrentYear',
          'firmBusinessCurrentYear',
          'yearlyTotalNextYear',
          'firmBusinessNextYear',
        ].includes(col.colId)
      );

      moneyColumns.forEach((column) => {
        expect(column.valueFormatter).toBeDefined();
        // Check that the formatter is being called with correct params
        const mockParams = {
          value: 100,
          data: { currency: 'EUR' },
        } as ValueFormatterParams;
        jest
          .spyOn(agGridLocalizationService, 'numberFormatter')
          .mockReturnValue('100');
        expect((column as any).valueFormatter(mockParams)).toBe('100 EUR');
        expect((column as any).tooltipValueGetter(mockParams)).toBe('100 EUR');
      });
    });

    it('should set the appropriate value formatters for percentage columns', () => {
      const columns = getColumnDefs(
        agGridLocalizationService,
        CustomerSalesPlanningLayout.PreviousToCurrent
      );

      const moneyColumns = columns.filter((col) =>
        [
          'deviationToPreviousYear',
          'salesPlannedCurrentYear',
          'demandPlannedCurrentYear',
          'demandPlannedNextYear',
          'deviationToCurrentYear',
          'salesPlannedNextYear',
        ].includes(col.colId)
      );

      moneyColumns.forEach((column) => {
        expect(column.valueFormatter).toBeDefined();
        // Check that the formatter is being called with correct params
        const mockParams = {
          value: 100,
          data: { currency: 'EUR' },
        } as ValueFormatterParams;
        jest
          .spyOn(agGridLocalizationService, 'numberFormatter')
          .mockReturnValue('100');
        expect((column as any).valueFormatter(mockParams)).toBe('100 %');
        expect((column as any).tooltipValueGetter(mockParams)).toBe('100 %');
      });
    });

    describe('PreviousToCurrent layout', () => {
      let columns: ColDef[];
      beforeEach(() => {
        columns = getColumnDefs(
          agGridLocalizationService,
          CustomerSalesPlanningLayout.PreviousToCurrent
        ).filter((column: ColDef) => !column.hide);
      });

      it('should have 8 visible default rows for PreviousToCurrent', () => {
        expect(columns.length).toBe(8);
      });

      it('should show a colored badge for the salesPlanned and demandPlanned column', () => {
        const filteredColumns: ColDef[] = columns.filter((column: ColDef) =>
          ['salesPlannedCurrentYear', 'demandPlannedCurrentYear'].includes(
            column.colId
          )
        );
        // columns should be visible in the layout
        expect(filteredColumns.length).toBe(2);

        filteredColumns.forEach((column: ColDef) => {
          expect(column.cellRenderer).toEqual(ValueBadgeCellRendererComponent);
          expect(column.cellRendererParams.threshold).toBe(95);
        });
      });
      it('should show an uncolored badge for the devaition column', () => {
        const filteredColumns: ColDef[] = columns.filter((column: ColDef) =>
          ['deviationToPreviousYear'].includes(column.colId)
        );

        // columns should be visible in the layout
        expect(filteredColumns.length).toBe(1);

        filteredColumns.forEach((column: ColDef) => {
          expect(column.cellRenderer).toEqual(ValueBadgeCellRendererComponent);
          expect(column.cellRendererParams?.threshold).toBeUndefined();
        });
      });
    });

    describe('CurrentToNext layout', () => {
      let columns: ColDef[];
      beforeEach(() => {
        columns = getColumnDefs(
          agGridLocalizationService,
          CustomerSalesPlanningLayout.CurrentToNext
        ).filter((column: ColDef) => !column.hide);
      });
      it('should have 9 visible default rows for CurrentToNext', () => {
        expect(columns.length).toBe(9);
      });
      it('should show a colored badge for the salesPlanned and demandPlanned column', () => {
        const filteredColumns: ColDef[] = columns.filter((column: ColDef) =>
          ['salesPlannedNextYear', 'demandPlannedNextYear'].includes(
            column.colId
          )
        );

        // columns should be visible in the layout
        expect(filteredColumns.length).toBe(2);

        filteredColumns.forEach((column: ColDef) => {
          expect(column.cellRenderer).toEqual(ValueBadgeCellRendererComponent);
          expect(column.cellRendererParams.threshold).toBe(95);
        });
      });
      it('should show an uncolored badge for the devaition column', () => {
        const filteredColumns: ColDef[] = columns.filter((column: ColDef) =>
          ['deviationToCurrentYear'].includes(column.colId)
        );

        // columns should be visible in the layout
        expect(filteredColumns.length).toBe(1);

        filteredColumns.forEach((column: ColDef) => {
          expect(column.cellRenderer).toEqual(ValueBadgeCellRendererComponent);
          expect(column.cellRendererParams?.threshold).toBeUndefined();
        });
      });
    });
  });
});
