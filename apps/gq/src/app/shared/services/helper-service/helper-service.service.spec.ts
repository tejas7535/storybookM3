import { PLsAndSeries } from '@gq/core/store/reducers/models';
import { PasteButtonComponent } from '@gq/shared/ag-grid/custom-status-bar/paste-button/paste-button.component';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@ngneat/transloco-locale';
import { ColDef } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CreateCaseActionCellComponent } from '../../ag-grid/cell-renderer/action-cells/create-case-action-cell/create-case-action-cell.component';
import { CreateCaseActionHeaderComponent } from '../../ag-grid/cell-renderer/action-cells/create-case-action-header/create-case-action-header.component';
import { ProcessCaseActionCellComponent } from '../../ag-grid/cell-renderer/action-cells/process-case-action-cell/process-case-action-cell.component';
import { ProcessCaseActionHeaderComponent } from '../../ag-grid/cell-renderer/action-cells/process-case-action-header/process-case-action-header.component';
import { AddMaterialButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { BASE_STATUS_BAR_CONFIG } from '../../components/case-material/input-table/config';
import { Keyboard } from '../../models';
import { StatusBarConfig } from '../../models/table';
import { PLsSeriesResponse } from '../rest-services/search-service/models/pls-series-response.model';
import { HelperService } from './helper-service.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

const BASE_COLUMN_DEFS = [
  {
    headerName: translate('shared.caseMaterial.table.materialDescription'),
    field: 'materialDescription',
    flex: 0.3,
    sortable: true,
  },
  {
    headerName: translate('shared.caseMaterial.table.materialNumber'),
    field: 'materialNumber',
    flex: 0.3,
    sortable: true,
  },
  {
    headerName: translate('shared.caseMaterial.table.quantity'),
    field: 'quantity',
    flex: 0.2,
    sortable: true,
  },
  {
    headerName: translate('shared.caseMaterial.table.info.title'),
    field: 'info',
    cellRenderer: 'infoCellComponent',
    flex: 0.1,
    sortable: true,
  },
];

describe('HelperServiceService', () => {
  let service: HelperService;
  let spectator: SpectatorService<HelperService>;

  let translocoCurrencyPipe: TranslocoCurrencyPipe;
  let translocoDatePipe: TranslocoDatePipe;
  let translocoDecimalPipe: TranslocoDecimalPipe;
  let translocoPercentPipe: TranslocoPercentPipe;

  const createService = createServiceFactory({
    service: HelperService,
    providers: [
      {
        provide: TranslocoCurrencyPipe,
        useValue: {
          transform: jest.fn(),
        },
      },
      {
        provide: TranslocoDatePipe,
        useValue: {
          transform: jest
            .fn()
            .mockImplementation((value) =>
              Intl.DateTimeFormat('en-US').format(value)
            ),
        },
      },
      {
        provide: TranslocoDecimalPipe,
        useValue: {
          transform: jest.fn(),
        },
      },
      {
        provide: TranslocoPercentPipe,
        useValue: {
          transform: jest.fn().mockImplementation((value) =>
            Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)
          ),
        },
      },
    ],
    imports: [provideTranslocoTestingModule({ en: {} })],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    translocoCurrencyPipe = spectator.inject(TranslocoCurrencyPipe);
    translocoDatePipe = spectator.inject(TranslocoDatePipe);
    translocoDecimalPipe = spectator.inject(TranslocoDecimalPipe);
    translocoPercentPipe = spectator.inject(TranslocoPercentPipe);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getCurrentYear', () => {
    test('getCurrentYear', () => {
      Date.prototype.getFullYear = jest.fn(() => 2020);
      expect(HelperService.getCurrentYear()).toEqual(2020);
      expect(Date.prototype.getFullYear).toHaveBeenCalledTimes(1);
    });

    test('getLastYear', () => {
      HelperService.getCurrentYear = jest.fn(() => 2020);
      expect(HelperService.getLastYear()).toEqual(2019);
      expect(HelperService.getCurrentYear).toHaveBeenCalledTimes(1);
    });
  });

  describe('localization functions', () => {
    const decimalValue = 12_345_678.912_345;
    const currencyValue = 10_000_000;
    const marginDetailValue = 123.45;
    const percentValue = 25.711_234;
    const dateValue = '2022-06-22T13:45:30';

    [
      {
        locale: 'en-US',
        expectedWithDigits: '12,345,678.91',
        expectedWithoutDigits: '12,345,679',
        expectedCurrency: 'EUR\u00A010,000,000.00',
        expectedMarginDetail: 'EUR\u00A0123.45',
        expectedPercent: '25.71%',
        expectedDate: '06/22/22',
        expectedDateAndTime: '06/22/22, 01:45 PM',
        expectedExcelNumber: '12345678.91',
      },
      {
        locale: 'de-DE',
        expectedWithDigits: '12.345.678,91',
        expectedWithoutDigits: '12.345.679',
        expectedCurrency: '10.000.000,00\u00A0EUR',
        expectedMarginDetail: '123,45\u00A0EUR',
        expectedPercent: '25,71\u00A0%',
        expectedDate: '22.06.22',
        expectedDateAndTime: '22.06.22, 13:45',
        expectedExcelNumber: '12345678.91',
      },
    ].forEach((testCase) => {
      test(`transformNumber (with digits) - should return ${testCase.expectedWithDigits} for ${testCase.locale}`, () => {
        translocoDecimalPipe.transform = jest.fn().mockImplementation((value) =>
          Intl.NumberFormat(testCase.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value)
        );

        const result = service.transformNumber(decimalValue, true);

        expect(result).toEqual(testCase.expectedWithDigits);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledWith(
          decimalValue,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
      });

      test(`transformNumber (without digits) - should return ${testCase.expectedWithDigits} for ${testCase.locale}`, () => {
        translocoDecimalPipe.transform = jest.fn().mockImplementation((value) =>
          Intl.NumberFormat(testCase.locale, {
            minimumFractionDigits: undefined,
            maximumFractionDigits: 0,
          }).format(value)
        );

        const result = service.transformNumber(decimalValue, false);

        expect(result).toEqual(testCase.expectedWithoutDigits);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledWith(
          decimalValue,
          {
            minimumFractionDigits: undefined,
            maximumFractionDigits: 0,
          }
        );
      });

      test(`transformNumberExcel - should return ${testCase.expectedExcelNumber} for ${testCase.locale}`, () => {
        translocoDecimalPipe.transform = jest.fn().mockImplementation((value) =>
          Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: false,
          }).format(value)
        );

        const result = service.transformNumberExcel(decimalValue);

        expect(result).toEqual(testCase.expectedExcelNumber);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoDecimalPipe.transform).toHaveBeenCalledWith(
          decimalValue,
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: false,
          },
          'en-US'
        );
      });

      test(`transformMarginDetails: should return ${testCase.expectedMarginDetail} for ${testCase.locale}`, () => {
        translocoCurrencyPipe.transform = jest
          .fn()
          .mockImplementation((value, code, _, currency) =>
            Intl.NumberFormat(testCase.locale, {
              style: 'currency',
              currencyDisplay: code,
              currency,
            }).format(value)
          );

        const result = service.transformMarginDetails(marginDetailValue, 'EUR');

        expect(result).toEqual(testCase.expectedMarginDetail);
        expect(translocoCurrencyPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoCurrencyPipe.transform).toHaveBeenCalledWith(
          marginDetailValue.toString(),
          'code',
          undefined,
          'EUR'
        );
      });

      test(`transformNumberCurrency: should return ${testCase.expectedWithDigits} for ${testCase.locale}`, () => {
        translocoCurrencyPipe.transform = jest
          .fn()
          .mockImplementation((value, code, _, currency) =>
            Intl.NumberFormat(testCase.locale, {
              style: 'currency',
              currencyDisplay: code,
              currency,
            }).format(value)
          );

        const result = service.transformNumberCurrency(
          currencyValue.toString(),
          'EUR'
        );

        expect(result).toEqual(testCase.expectedCurrency);
        expect(translocoCurrencyPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoCurrencyPipe.transform).toHaveBeenCalledWith(
          currencyValue.toString(),
          'code',
          undefined,
          'EUR'
        );
      });

      test(`transformPercentage: should return ${testCase.expectedPercent} for ${testCase.locale}`, () => {
        translocoPercentPipe.transform = jest.fn().mockImplementation(
          (value) =>
            `${Intl.NumberFormat(testCase.locale, {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)}`
        );

        const result = service.transformPercentage(percentValue);

        expect(result).toEqual(testCase.expectedPercent);
        expect(translocoPercentPipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoPercentPipe.transform).toHaveBeenCalledWith(
          percentValue / 100,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
      });

      test(`transformDate(without time): should return ${testCase.expectedDate} for ${testCase.locale}`, () => {
        translocoDatePipe.transform = jest.fn().mockImplementation((value) =>
          Intl.DateTimeFormat(testCase.locale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          }).format(new Date(value))
        );

        const result = service.transformDate(dateValue, false);

        expect(result).toEqual(testCase.expectedDate);
        expect(translocoDatePipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoDatePipe.transform).toHaveBeenCalledWith(dateValue, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: undefined,
          minute: undefined,
        });
      });

      test(`transformDate(with time): should return ${testCase.expectedDateAndTime} for ${testCase.locale}`, () => {
        translocoDatePipe.transform = jest.fn().mockImplementation((value) =>
          Intl.DateTimeFormat(testCase.locale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(value))
        );

        const result = service.transformDate(dateValue, true);

        expect(result).toEqual(testCase.expectedDateAndTime);
        expect(translocoDatePipe.transform).toHaveBeenCalledTimes(1);
        expect(translocoDatePipe.transform).toHaveBeenCalledWith(dateValue, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      });
    });
  });

  describe('should NOT localize undefined values', () => {
    test('transformNumberCurrency', () => {
      const result = service.transformNumberCurrency(undefined, 'EUR');

      expect(result).toEqual(Keyboard.DASH);
      expect(translocoCurrencyPipe.transform).not.toHaveBeenCalled();
    });

    test('transformDate', () => {
      const result = service.transformDate('');

      expect(result).toEqual('');
      expect(translocoDatePipe.transform).not.toHaveBeenCalled();
    });

    test('transformNumber', () => {
      const result = service.transformNumber(undefined, true);

      expect(result).toEqual(Keyboard.DASH);
      expect(translocoDecimalPipe.transform).not.toHaveBeenCalled();
    });

    test('transformMarginDetails', () => {
      const result = service.transformMarginDetails(undefined, 'EUR');

      expect(result).toEqual(Keyboard.DASH);
      expect(translocoCurrencyPipe.transform).not.toHaveBeenCalled();
    });

    test('transformPercentage', () => {
      const result = service.transformPercentage(
        undefined as unknown as number
      );

      expect(result).toEqual(Keyboard.DASH);
      expect(translocoPercentPipe.transform).not.toHaveBeenCalled();
    });
  });

  describe('initStatusBar', () => {
    test('should return StatusBarConfig for createCase', () => {
      const result = HelperService.initStatusBar(true, BASE_STATUS_BAR_CONFIG);

      const expected: StatusBarConfig = {
        statusPanels: [
          ...BASE_STATUS_BAR_CONFIG.statusPanels,
          {
            statusPanel: CreateCaseButtonComponent,
            align: 'left',
          },
          {
            statusPanel: CreateCaseResetAllButtonComponent,
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
            statusPanel: AddMaterialButtonComponent,
            align: 'left',
          },
          {
            statusPanel: ProcessCaseResetAllButtonComponent,
            align: 'right',
          },
          {
            statusPanel: PasteButtonComponent,
            align: 'left',
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
          cellRenderer: CreateCaseActionCellComponent,
          flex: 0.2,
          headerComponent: CreateCaseActionHeaderComponent,
        },
      ];

      expect(result).toEqual(expected);
    });
    test('should return ColDef for processCase', () => {
      const result = HelperService.initColDef(false, BASE_COLUMN_DEFS);

      const expected: ColDef[] = [
        ...BASE_COLUMN_DEFS,
        {
          cellRenderer: ProcessCaseActionCellComponent,
          flex: 0.2,
          headerComponent: ProcessCaseActionHeaderComponent,
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('transformPLsAndSeriesResponse', () => {
    test('should transform reponse', () => {
      const response: PLsSeriesResponse[] = [
        {
          productLine: '10',
          productLineId: '10',
          series: '20',
          gpsdGroupId: 'F02',
        },
        {
          productLine: '10',
          productLineId: '10',
          series: '30',
          gpsdGroupId: 'F03',
        },
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
        gpsdGroupIds: [
          { value: 'F02', selected: true },
          { value: 'F03', selected: true },
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
