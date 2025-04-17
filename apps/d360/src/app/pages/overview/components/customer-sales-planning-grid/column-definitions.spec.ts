import { ValueFormatterParams } from 'ag-grid-enterprise';

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
  });

  describe('getColumnDefs', () => {
    it('should have 8 visible default rows for PreviousToCurrent', () => {
      const columns = getColumnDefs(
        agGridLocalizationService,
        CustomerSalesPlanningLayout.PreviousToCurrent
      ).filter((column) => !column.hide);
      expect(columns.length).toBe(8);
    });
    it('should have 9 visible default rows for CurrentToNext', () => {
      const columns = getColumnDefs(
        agGridLocalizationService,
        CustomerSalesPlanningLayout.CurrentToNext
      ).filter((column) => !column.hide);
      expect(columns.length).toBe(9);
    });
  });
});
