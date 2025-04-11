import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  demandCharacteristicOptions,
  materialClassificationOptions,
} from '../../feature/material-customer/model';
import {
  execIntervalOptions,
  whenOptions,
} from '../../pages/alert-rules/table/components/modals/alert-rule-edit-single-modal/alert-rule-options-config';
import { DisplayFunctions } from '../components/inputs/display-functions.utils';
import { Stub } from '../test/stub.class';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from './selectable-options.service';

describe('SelectableOptionsService', () => {
  let service: SelectableOptionsService;

  beforeEach(() => {
    service = Stub.get<SelectableOptionsService>({
      component: SelectableOptionsService,
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return the options for a given key if it exists in the map', () => {
      const mockOptions: OptionsLoadingResult = {
        options: [{ id: '1', text: 'Option 1' }],
      };
      service['_data'].set('region', mockOptions);

      const result = service.get('region');

      expect(result).toEqual(mockOptions);
    });

    it('should return an empty options array if the key does not exist in the map', () => {
      const result = service.get('nonExistentKey' as any);

      expect(result).toEqual({ options: [] });
    });
  });

  describe('getOptionsBySearchTerm', () => {
    let httpGetSpy: jest.SpyInstance;

    beforeEach(() => {
      httpGetSpy = jest.spyOn(service['http'], 'get').mockReturnValue(of([]));
    });

    it('should call the correct API endpoint without language when withLang is false', () => {
      const urlBegin = 'test-url';
      const searchTerm = 'test-search';

      service.getOptionsBySearchTerm(urlBegin, searchTerm, false).subscribe();

      expect(httpGetSpy).toHaveBeenCalledWith(
        `/api/${urlBegin}?search=${searchTerm}&lang=null`
      );
    });

    it('should call the correct API endpoint with language when withLang is true', () => {
      const urlBegin = 'test-url';
      const searchTerm = 'test-search';
      jest
        .spyOn(service['translocoService'], 'getActiveLang')
        .mockReturnValue('en');

      service.getOptionsBySearchTerm(urlBegin, searchTerm, true).subscribe();

      expect(httpGetSpy).toHaveBeenCalledWith(
        `/api/${urlBegin}?search=${searchTerm}&lang=en`
      );
    });

    it('should return the observable of selectable values', (done) => {
      const mockResponse = [{ id: '1', text: 'Option 1' }];
      httpGetSpy.mockReturnValue(of(mockResponse));

      service
        .getOptionsBySearchTerm('test-url', 'test-search', false)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          done();
        });
    });
  });

  describe('getFilterColDef', () => {
    let getSpy: jest.SpyInstance;

    beforeEach(() => {
      getSpy = jest.spyOn(service, 'get');
    });

    it('should return a column definition with filter and filterParams when options exist', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      getSpy.mockReturnValue({ options: mockOptions });

      const result = service.getFilterColDef('region');

      expect(result).toEqual({
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['1', '2'],
          valueFormatter: expect.any(Function),
        },
        valueFormatter: expect.any(Function),
      });

      // Test the valueFormatter for filterParams
      const filterValueFormatter = result.filterParams.valueFormatter;
      expect(filterValueFormatter({ value: '1' } as any)).toBe('Option 1');
      expect(filterValueFormatter({ value: '3' } as any)).toBe('');

      // Test the grid valueFormatter
      const gridValueFormatter = result.valueFormatter;
      expect(gridValueFormatter({ value: '2' } as any)).toBe('Option 2');
      expect(gridValueFormatter({ value: '3' } as any)).toBe('');
    });

    it('should return a column definition with empty values when no options exist', () => {
      getSpy.mockReturnValue({ options: [] });

      const result = service.getFilterColDef('region');

      expect(result).toEqual({
        filter: 'agSetColumnFilter',
        filterParams: {
          values: [],
          valueFormatter: expect.any(Function),
        },
        valueFormatter: expect.any(Function),
      });

      // Test the valueFormatter for filterParams
      const filterValueFormatter = result.filterParams.valueFormatter;
      expect(filterValueFormatter({ value: '1' } as any)).toBe('');

      // Test the grid valueFormatter
      const gridValueFormatter = result.valueFormatter;
      expect(gridValueFormatter({ value: '1' } as any)).toBe('');
    });

    it('should use custom filterValueFormatter and gridValueFormatter if provided', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      getSpy.mockReturnValue({ options: mockOptions });

      const customFilterValueFormatter = jest.fn(
        (option) => `Filter: ${option.text}`
      );
      const customGridValueFormatter = jest.fn(
        (option) => `Grid: ${option.text}`
      );

      const result = service.getFilterColDef(
        'region',
        customFilterValueFormatter,
        customGridValueFormatter
      );

      // Test the custom filterValueFormatter
      const filterValueFormatter = result.filterParams.valueFormatter;
      filterValueFormatter({ value: '1' } as any);
      expect(customFilterValueFormatter).toHaveBeenCalledWith(mockOptions[0]);

      // Test the custom gridValueFormatter
      const gridValueFormatter = result.valueFormatter;
      gridValueFormatter({ value: '2' } as any);
      expect(customGridValueFormatter).toHaveBeenCalledWith(mockOptions[1]);
    });

    it('should not include grid valueFormatter if gridValueFormatter is null', () => {
      const mockOptions = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      getSpy.mockReturnValue({ options: mockOptions });

      const result = service.getFilterColDef(
        'region',
        DisplayFunctions.displayFnText,
        null
      );

      expect(result).toEqual({
        filter: 'agSetColumnFilter',
        filterParams: {
          values: ['1', '2'],
          valueFormatter: expect.any(Function),
        },
      });

      expect(result.valueFormatter).toBeUndefined();
    });
  });

  describe('call', () => {
    let httpGetSpy: jest.SpyInstance;

    beforeEach(() => {
      httpGetSpy = jest
        .spyOn(service['http'], 'get')
        .mockImplementation(() => of([]));
      httpGetSpy.mockClear();
    });

    it('should call the correct API endpoint and return options when no currentSelection is provided', (done) => {
      const mockPath = 'test-path';
      const mockResponse = [{ id: '1', text: 'Option 1' }];
      httpGetSpy.mockReturnValue(of(mockResponse));

      (service as any)
        .call(mockPath)
        .subscribe((result: OptionsLoadingResult) => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `${environment.apiUrl}global-selection/${mockPath}`
          );
          expect(result).toEqual({
            options: mockResponse,
            loading: false,
            loadingError: null,
          });
          done();
        });
    });

    it('should include currentSelection in the options if not already present', (done) => {
      const mockPath = 'test-path';
      const mockResponse = [{ id: '1', text: 'Option 1' }];
      const currentSelection = [{ id: '2', text: 'Option 2' }];
      httpGetSpy.mockReturnValue(of([...mockResponse]));

      (service as any)
        .call(mockPath, currentSelection)
        .subscribe((result: OptionsLoadingResult) => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `${environment.apiUrl}global-selection/${mockPath}`
          );
          expect(result).toEqual({
            options: [...mockResponse, ...currentSelection],
            loading: false,
            loadingError: null,
          });
          done();
        });
    });

    it('should not duplicate options if currentSelection is already present in the response', (done) => {
      const mockPath = 'test-path';
      const mockResponse = [{ id: '1', text: 'Option 1' }];
      const currentSelection = [{ id: '1', text: 'Option 1' }];
      httpGetSpy.mockReturnValue(of(mockResponse));

      (service as any)
        .call(mockPath, currentSelection)
        .subscribe((result: OptionsLoadingResult) => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `${environment.apiUrl}global-selection/${mockPath}`
          );
          expect(result).toEqual({
            options: mockResponse,
            loading: false,
            loadingError: null,
          });
          done();
        });
    });

    it('should handle an empty response gracefully', (done) => {
      const mockPath = 'test-path';
      httpGetSpy.mockReturnValue(of(null));

      (service as any)
        .call(mockPath)
        .subscribe((result: OptionsLoadingResult) => {
          expect(httpGetSpy).toHaveBeenCalledWith(
            `${environment.apiUrl}global-selection/${mockPath}`
          );
          expect(result).toEqual({
            options: [],
            loading: false,
            loadingError: null,
          });
          done();
        });
    });
  });

  describe('setStatics', () => {
    beforeEach(() => {
      jest.spyOn(service['_data'], 'set');
    });

    it('should set static options for interval', () => {
      service['setStatics']();

      expect(service['_data'].set).toHaveBeenCalledWith('interval', {
        options: execIntervalOptions.map((option) => ({
          id: option,
          text: `alert_rules.edit_modal.label.interval.${option}`,
        })),
        loading: false,
        loadingError: null,
      });
    });

    it('should set static options for execDay', () => {
      service['setStatics']();

      expect(service['_data'].set).toHaveBeenCalledWith('execDay', {
        options: whenOptions.map((option) => ({
          id: option,
          text: `alert_rules.edit_modal.label.when.${option}`,
        })),
        loading: false,
        loadingError: null,
      });
    });

    it('should set static options for demandCharacteristics', () => {
      service['setStatics']();

      expect(service['_data'].set).toHaveBeenCalledWith(
        'demandCharacteristics',
        {
          options: demandCharacteristicOptions.map((option) => ({
            id: option,
            text: `field.demandCharacteristic.value.${option}`,
          })),
          loading: false,
          loadingError: null,
        }
      );
    });

    it('should set static options for materialClassification without translateKey', () => {
      service['setStatics']();

      expect(service['_data'].set).toHaveBeenCalledWith(
        'materialClassification',
        {
          options: materialClassificationOptions.map((option) => ({
            id: option,
            text: `${option}`, // No translateKey provided
          })),
          loading: false,
          loadingError: null,
        }
      );
    });
  });

  describe('preload', () => {
    let callSpy: jest.SpyInstance;
    let nextSpy: jest.SpyInstance;

    beforeEach(() => {
      callSpy = jest
        .spyOn(service as any, 'call')
        .mockImplementation(() => of({ options: [] }));
      nextSpy = jest.spyOn(service.loading$, 'next');
      callSpy.mockClear();
      nextSpy.mockClear();
      jest
        .spyOn(service['translocoService'], 'getActiveLang')
        .mockReturnValue('en');
    });

    it('should call the correct API endpoints with the correct paths', () => {
      service['preload']();

      expect(callSpy).toHaveBeenCalledTimes(12);
      expect(callSpy).toHaveBeenCalledWith(
        'alert-types?language=en&isRuleEditor=true'
      );
      expect(callSpy).toHaveBeenCalledWith('alert-types-open?language=en');
      expect(callSpy).toHaveBeenCalledWith('regions');
      expect(callSpy).toHaveBeenCalledWith('demand-planners');
      expect(callSpy).toHaveBeenCalledWith('sectors?language=en');
      expect(callSpy).toHaveBeenCalledWith('product-plants');
      expect(callSpy).toHaveBeenCalledWith('sector-mgmt');
      expect(callSpy).toHaveBeenCalledWith('sales-areas');
      expect(callSpy).toHaveBeenCalledWith('sales-organisations?language=en');
      expect(callSpy).toHaveBeenCalledWith('key-accounts');
      expect(callSpy).toHaveBeenCalledWith('product-line');
      expect(callSpy).toHaveBeenCalledWith('stochastic-types?language=en');
    });

    it('should set the correct data in the _data map', () => {
      const mockData = {
        'alert-types-open?language=en': {
          options: [{ id: '2', text: 'Option 2' }],
          loading: false,
          loadingError: null,
        },
        regions: {
          options: [{ id: '1', text: 'Option 1' }],
          loading: false,
          loadingError: null,
        },
        'demand-planners': {
          options: [{ id: '3', text: 'Option 3' }],
          loading: false,
          loadingError: null,
        },
      } as any;
      callSpy.mockImplementation((path: string) =>
        of(mockData[path as keyof typeof mockData] || { options: [] })
      );

      service['preload']();

      expect(service.get('alertTypes')).toEqual({
        options: [{ id: '2', text: 'alert.category.2' }],
        loading: false,
        loadingError: null,
      });
      expect(service.get('region')).toEqual({
        options: [{ id: '1', text: 'Option 1' }],
        loading: false,
        loadingError: null,
      });
      expect(service.get('demandPlanners')).toEqual({
        options: [{ id: '3', text: 'Option 3' }],
        loading: false,
        loadingError: null,
      });
    });

    it('should set loading$ to false after data is loaded', () => {
      service['preload']();

      expect(nextSpy).toHaveBeenCalledWith(false);
    });
  });
});
