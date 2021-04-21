import { ColDef } from '@ag-grid-community/core';

import {
  BASE_COLUMN_DEFS,
  BASE_STATUS_BAR_CONFIG,
} from '../../case-material/input-table/config';
import { StatusBarConfig } from '../../models/table';
import { HelperService } from './helper-service.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('HelperServiceService', () => {
  describe('getCurrentYear', () => {
    test('get year', () => {
      Date.prototype.getFullYear = jest.fn(() => 2020);
      expect(HelperService.getCurrentYear()).toEqual(2020);
      expect(Date.prototype.getFullYear).toHaveBeenCalledTimes(1);
    });
  });
  describe('getLastYear', () => {
    test('get year', () => {
      HelperService.getCurrentYear = jest.fn(() => 2020);
      expect(HelperService.getLastYear()).toEqual(2019);
      expect(HelperService.getCurrentYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('transformNumber', () => {
    test('should transform Number with digits', () => {
      const result = HelperService.transformNumber(10000, true);

      expect(result).toEqual('10,000.00');
    });
    test('should transform Number without digits', () => {
      const result = HelperService.transformNumber(10000, false);

      expect(result).toEqual('10,000');
    });
  });

  describe('transformNumberCurrency', () => {
    test('should transform NumberCurrency', () => {
      const result = HelperService.transformNumberCurrency('10000', 'EUR');

      expect(result).toEqual('10000 EUR');
    });
    test('should return undefined', () => {
      const result = HelperService.transformNumberCurrency(undefined, 'EUR');

      expect(result).toEqual('-');
    });
  });
  describe('transformMarginDetails', () => {
    test('should transformMarginDetails', () => {
      HelperService.transformNumber = jest.fn();
      HelperService.transformNumberCurrency = jest.fn();

      HelperService.transformMarginDetails(1000, 'EUR');

      expect(HelperService.transformNumberCurrency).toHaveBeenCalledTimes(1);
      expect(HelperService.transformNumber).toHaveBeenCalledTimes(1);
    });
  });

  describe('initStatusBar', () => {
    test('should return StatusBarConfig for createCase', () => {
      const result = HelperService.initStatusBar(true, BASE_STATUS_BAR_CONFIG);

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: 'createCaseButtonComponent',
            align: 'left',
          },
          {
            statusPanel: 'createCaseResetAllComponent',
            align: 'right',
          },
        ],
      };
      expect(result).toEqual(expected);
    });
    test('should return StatusBarConfig for processCase', () => {
      const result = HelperService.initStatusBar(false, BASE_STATUS_BAR_CONFIG);

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: 'addMaterialButtonComponent',
            align: 'left',
          },
          {
            statusPanel: 'processCaseResetAllComponent',
            align: 'right',
          },
        ],
      };
      expect(result).toEqual(expected);
    });
  });

  describe('initColDef', () => {
    test('should return ColDef for createCase', () => {
      const result = HelperService.initColDef(true, BASE_COLUMN_DEFS);

      const expected: ColDef[] = [
        ...BASE_COLUMN_DEFS,
        {
          cellRenderer: 'createCaseActionCellComponent',
          flex: 0.1,
        },
      ];

      expect(result).toEqual(expected);
    });
    test('should return ColDef for processCase', () => {
      const result = HelperService.initColDef(false, BASE_COLUMN_DEFS);

      const expected: ColDef[] = [
        ...BASE_COLUMN_DEFS,
        {
          cellRenderer: 'processCaseActionCellComponent',
          flex: 0.1,
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
