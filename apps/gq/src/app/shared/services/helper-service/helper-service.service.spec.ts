import { ColDef } from '@ag-grid-enterprise/all-modules';
import { TranslocoModule } from '@ngneat/transloco';

import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import {
  BASE_COLUMN_DEFS,
  BASE_STATUS_BAR_CONFIG,
} from '../../case-material/input-table/config';
import { Keyboard } from '../../models';
import { StatusBarConfig } from '../../models/table';
import { PLsSeriesResponse } from '../rest-services/search-service/models/pls-series-response.model';
import { HelperService } from './helper-service.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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
      const result = HelperService.transformNumber(10_000, true);

      expect(result).toEqual('10,000.00');
    });
    test('should transform Number without digits', () => {
      const result = HelperService.transformNumber(10_000, false);

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

      expect(result).toEqual(Keyboard.DASH);
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
  describe('transformPercentage', () => {
    test('should transformPercentage', () => {
      const result = HelperService.transformPercentage(25.711_234);

      expect(result).toEqual('25.71 %');
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
  describe('validateNumberInputKeyPress', () => {
    test('should prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 } as any;

      HelperService.validateNumberInputKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should not prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20 } as any;

      HelperService.validateNumberInputKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent Default when delete key is pressed', () => {
      const event = { key: Keyboard.DELETE, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 } as any;

      HelperService.validateNumberInputKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });
  describe('onPaste', () => {
    test('should set price', () => {
      const event = {
        clipboardData: {
          getData: jest.fn(() => 20.022),
        },
        preventDefault: jest.fn(),
      } as any;
      const manualPriceFormControl = { setValue: jest.fn() } as any;

      HelperService.validateNumberInputPaste(event, manualPriceFormControl);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(manualPriceFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(manualPriceFormControl.setValue).toHaveBeenCalledWith(20.02);
    });
  });
  describe('transformPLsAndSeriesResponse', () => {
    test('should transform reponse', () => {
      const response: PLsSeriesResponse[] = [
        { productLine: '10', productLineId: '10', series: '20' },
        { productLine: '10', productLineId: '10', series: '30' },
      ];
      const result = HelperService.transformPLsAndSeriesResponse(response);

      const expected: PLsAndSeries = {
        pls: [
          { name: '10', selected: true, series: ['20', '30'], value: '10' },
        ],
        series: [
          { value: '20', selected: true },
          { value: '30', selected: true },
        ],
      };
      expect(result).toEqual(expected);
    });
  });
  describe('validateQuantityInputKeyPress', () => {
    test('should prevent default on invalid input', () => {
      const event = { key: 'a', preventDefault: jest.fn() } as any;
      HelperService.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should not prevent default when input is a number', () => {
      const event = { key: '1', preventDefault: jest.fn() } as any;
      HelperService.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
    test('should not prevent default when input is paste event', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: true,
      } as any;
      HelperService.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
    test('should not prevent default when input is delete key', () => {
      const event = {
        key: Keyboard.BACKSPACE,
        preventDefault: jest.fn(),
      } as any;
      HelperService.validateQuantityInputKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });
  describe('validateQuantityInputPaste', () => {
    test('should not prevent default on valid input', () => {
      const event = {
        clipboardData: {
          getData: jest.fn(() => '1000'),
        },
        preventDefault: jest.fn(),
      };
      HelperService.validateQuantityInputPaste(event as any);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
    test('should prevent default on invalid input', () => {
      const event = {
        clipboardData: {
          getData: jest.fn(() => 'aaa'),
        },
        preventDefault: jest.fn(),
      };
      HelperService.validateQuantityInputPaste(event as any);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
  });
});
