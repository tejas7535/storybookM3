import { abcxClassificationOptions } from '../../../feature/material-customer/model';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../shared/services/selectable-options.service';
import { Stub } from '../../../shared/test/stub.class';
import {
  columnDefinitions,
  translateAbcxClassificationValue,
  translateForecastMaintainedValue,
} from './column-definition';

describe('HomeTableColumnDefinitions', () => {
  describe('translateForecastMaintainedValue', () => {
    it('should return the translation key for true value', () => {
      const result = translateForecastMaintainedValue(true);
      expect(result).toBe('field.forecastMaintained.value.true');
    });

    it('should return the translation key for false value', () => {
      const result = translateForecastMaintainedValue(false);
      expect(result).toBe('field.forecastMaintained.value.false');
    });

    it('should return the translation key for undefined value', () => {
      const result = translateForecastMaintainedValue();
      expect(result).toBe('field.forecastMaintained.value.false');
    });
  });

  describe('translateAbcxClassificationValue', () => {
    it('should return the translation key for a valid AbcxClassification value', () => {
      const result = translateAbcxClassificationValue('A');
      expect(result).toBe('field.abcxClassification.value.A');
    });

    it('should return the translation key for an empty value', () => {
      const result = translateAbcxClassificationValue('');
      expect(result).toBe('field.abcxClassification.value.<empty>');
    });

    it('should return the translation key for undefined value', () => {
      const result = translateAbcxClassificationValue();
      expect(result).toBe('field.abcxClassification.value.<empty>');
    });

    it('should return the translation key for null value', () => {
      const result = translateAbcxClassificationValue(
        null as unknown as string
      );
      expect(result).toBe('field.abcxClassification.value.<empty>');
    });
  });

  describe('columnDefinitions', () => {
    let agGridLocalizationService: AgGridLocalizationService;
    let selectableOptionsService: SelectableOptionsService;

    beforeEach(() => {
      agGridLocalizationService = Stub.get<AgGridLocalizationService>({
        component: AgGridLocalizationService,
      });
      selectableOptionsService = Stub.get<SelectableOptionsService>({
        component: SelectableOptionsService,
      });
    });

    it('should return an array of column definitions', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );

      expect(columns).toBeInstanceOf(Array);
      expect(columns.length).toBeGreaterThan(0);

      columns.forEach((col) => {
        expect(col).toHaveProperty('colId');
        expect(col).toHaveProperty('visible');
        expect(col).toHaveProperty('alwaysVisible');
      });
    });

    it('should include correct valueFormatter for packagingSize column', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const packagingSizeColumn = columns.find(
        (col) => col.colId === 'packagingSize'
      );

      expect(packagingSizeColumn).toBeDefined();
      expect(packagingSizeColumn?.valueFormatter).toBe(
        agGridLocalizationService.numberFormatter
      );
    });

    it('should include correct filter for stochasticType column', () => {
      jest.spyOn(selectableOptionsService, 'getFilterColDef').mockReturnValue({
        filter: 'mockFilter',
      } as any);
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const stochasticTypeColumn = columns.find(
        (col) => col.colId === 'stochasticType'
      );

      expect(stochasticTypeColumn).toBeDefined();
      expect(selectableOptionsService.getFilterColDef).toHaveBeenCalledWith(
        'stochasticType',
        expect.any(Function),
        null
      );
      expect(stochasticTypeColumn?.filter).toBe('mockFilter');
    });

    it('should include correct valueFormatter for pfStatusAutoSwitch column', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const pfStatusAutoSwitchColumn = columns.find(
        (col) => col.colId === 'pfStatusAutoSwitch'
      );

      expect(pfStatusAutoSwitchColumn).toBeDefined();
      expect(pfStatusAutoSwitchColumn?.valueFormatter).toBe(
        agGridLocalizationService.dateFormatter
      );
    });

    it('should include correct valueGetter for forecastMaintained column', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const forecastMaintainedColumn = columns.find(
        (col) => col.colId === 'forecastMaintained'
      );

      expect(forecastMaintainedColumn).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-types
      const valueGetter = forecastMaintainedColumn?.valueGetter as Function;
      const result = valueGetter({ data: { forecastMaintained: true } });
      expect(result).toBe('field.forecastMaintained.value.true');

      expect(
        forecastMaintainedColumn?.filterParams.valueFormatter({ value: 'abc' })
      ).toBe('field.forecastMaintained.value.true');
    });

    it('should include correct valueGetter for abcxClassification column', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const abcxClassificationColumn = columns.find(
        (col) => col.colId === 'abcxClassification'
      );

      expect(abcxClassificationColumn).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-types
      const valueGetter = abcxClassificationColumn?.valueGetter as Function;
      const result = valueGetter({ data: { abcxClassification: 'A' } });
      expect(result).toBe('field.abcxClassification.value.A');
    });

    it('should include correct filterParams for abcxClassification column', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const abcxClassificationColumn = columns.find(
        (col) => col.colId === 'abcxClassification'
      );

      expect(abcxClassificationColumn).toBeDefined();
      expect(abcxClassificationColumn?.filterParams).toHaveProperty(
        'values',
        abcxClassificationOptions
      );
      const valueFormatter =
        // eslint-disable-next-line @typescript-eslint/ban-types
        abcxClassificationColumn?.filterParams?.valueFormatter as Function;
      const result = valueFormatter({ value: 'B' });
      expect(result).toBe('field.abcxClassification.value.B');
    });

    it('should configure customerMaterialNumber column with correct cellRenderer', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const customerMaterialNumberColumn = columns.find(
        (col) => col.colId === 'customerMaterialNumber'
      );

      expect(customerMaterialNumberColumn).toBeDefined();
      expect(customerMaterialNumberColumn?.cellRenderer).toBe(
        'customerMaterialNumberCellRenderer'
      );
      expect(customerMaterialNumberColumn?.visible).toBe(true);
    });

    it('should configure demandCharacteristic column with correct valueFormatter and filter', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const demandCharacteristicColumn = columns.find(
        (col) => col.colId === 'demandCharacteristic'
      );

      expect(demandCharacteristicColumn).toBeDefined();
      expect(demandCharacteristicColumn?.valueFormatter).toBeDefined();
      expect(demandCharacteristicColumn?.filter).toBe('agSetColumnFilter');
      expect(demandCharacteristicColumn?.filterParams).toHaveProperty(
        'valueFormatter'
      );
      expect(demandCharacteristicColumn?.filterParams).toHaveProperty('values');
    });

    it('should configure portfolioStatus column with correct valueFormatter and filter', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const portfolioStatusColumn = columns.find(
        (col) => col.colId === 'portfolioStatus'
      );

      expect(portfolioStatusColumn).toBeDefined();
      expect(portfolioStatusColumn?.valueFormatter).toBeDefined();
      expect(portfolioStatusColumn?.filter).toBe('agSetColumnFilter');
      expect(portfolioStatusColumn?.filterParams).toHaveProperty(
        'valueFormatter'
      );
      expect(portfolioStatusColumn?.filterParams).toHaveProperty('values');
    });

    it('should configure productLine column with SelectableOptionsService settings', () => {
      jest.spyOn(selectableOptionsService, 'getFilterColDef').mockReturnValue({
        filter: 'customFilter',
        someProp: 'testValue',
      } as any);

      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );
      const productLineColumn = columns.find(
        (col) => col.colId === 'productLine'
      );

      expect(productLineColumn).toBeDefined();
      expect(selectableOptionsService.getFilterColDef).toHaveBeenCalledWith(
        'productLine',
        expect.any(Function),
        null
      );
      expect(productLineColumn?.filter).toBe('customFilter');
      expect(productLineColumn).toHaveProperty('someProp', 'testValue');
    });

    it('should configure date columns with correct formatters and filters', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );

      const dateColumns = [
        'pfStatusAutoSwitch',
        'repDate',
        'forecastValidatedFrom',
        'forecastValidatedTo',
        'forecastValidatedAt',
      ];

      dateColumns.forEach((colId) => {
        const column = columns.find((col) => col.colId === colId);
        expect(column).toBeDefined();
        expect(column?.valueFormatter).toBe(
          agGridLocalizationService.dateFormatter
        );
        expect(column?.filter).toBe('agDateColumnFilter');
      });
    });

    it('should configure number columns with correct formatters and filters', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );

      const numberColumns = [
        'packagingSize',
        'currentRLTSchaeffler',
        'currentRLTCustomer',
        'successorSchaefflerMaterialPackagingSize',
        'forecastValidated',
      ];

      numberColumns.forEach((colId) => {
        const column = columns.find((col) => col.colId === colId);
        expect(column).toBeDefined();
        expect(column?.valueFormatter).toBe(
          agGridLocalizationService.numberFormatter
        );
        expect(column?.filter).toBe('agNumberColumnFilter');
      });
    });

    it('should set required columns as alwaysVisible', () => {
      const columns = columnDefinitions(
        agGridLocalizationService,
        selectableOptionsService
      );

      const requiredColumns = [
        'salesOrg',
        'mainCustomerNumber',
        'customerNumber',
        'customerName',
        'customerCountry',
        'sector',
        'sectorManagement',
        'deliveryPlant',
        'planningPlant',
        'materialNumber',
        'materialDescription',
      ];

      requiredColumns.forEach((colId) => {
        const column = columns.find((col) => col.colId === colId);
        expect(column).toBeDefined();
        expect(column?.alwaysVisible).toBe(true);
      });
    });
  });
});
