import { ColDef } from '@ag-grid-enterprise/all-modules';
import { TranslocoModule } from '@ngneat/transloco';

import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import {
  BASE_COLUMN_DEFS,
  BASE_STATUS_BAR_CONFIG,
} from '../../components/case-material/input-table/config';
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

    test('should not prevent default when input is paste event on macOs', () => {
      const event = {
        key: 'v',
        preventDefault: jest.fn(),
        ctrlKey: false,
        metaKey: true,
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

  describe('transform date', () => {
    test('should transform date', () => {
      const result = HelperService.transformDate('2020-01-01');
      expect(result).toEqual('01.01.2020');
    });

    test('should not transform empty date', () => {
      const result = HelperService.transformDate('');
      expect(result).toEqual('');
    });

    test('should override format options', () => {
      const result = HelperService.transformDate('2020-01-01', 'en-US', {
        day: 'numeric',
        month: 'long',
        year: '2-digit',
      });

      expect(result).toEqual('January 1, 20');
    });
  });

  describe('parseLocalizedInputValue', () => {
    [
      {
        locale: 'de-DE',
        inputs: [
          undefined,
          '100',
          '1.000',
          '1.000.000',
          '1.000.000,45678',
          '10,23',
          '1,5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
      {
        locale: 'en-US',
        inputs: [
          undefined,
          '100',
          '1,000',
          '1,000,000',
          '1,000,000.45678',
          '10.23',
          '1.5',
        ],
        expectedOutputs: [
          0, 100, 1000, 1_000_000, 1_000_000.456_78, 10.23, 1.5,
        ],
      },
    ].forEach((testCase) => {
      testCase.inputs.forEach((input, index) => {
        test(`should return ${testCase.expectedOutputs[index]} for ${testCase.inputs[index]} for locale ${testCase.locale}`, () => {
          const result = HelperService.parseLocalizedInputValue(
            input,
            testCase.locale
          );

          expect(result).toEqual(testCase.expectedOutputs[index]);
        });
      });
    });
  });
});
