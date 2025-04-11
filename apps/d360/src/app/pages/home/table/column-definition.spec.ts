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
  });
});
