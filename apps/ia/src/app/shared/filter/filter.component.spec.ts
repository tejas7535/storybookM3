import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputComponent } from '../autocomplete-input/autocomplete-input.component';
import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../date-input/date-input.module';
import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../models';
import { SelectInputComponent } from '../select-input/select-input.component';
import { SelectInputModule } from '../select-input/select-input.module';
import { getTimeRangeHint } from '../utils/utilities';
import { FilterComponent } from './filter.component';

jest.mock('../utils/utilities', () => ({
  getTimeRangeHint: jest.fn(() => 'test'),
  getBeautifiedTimeRange: jest.fn(() => 'beauty'),
}));

describe('FilterComponent', () => {
  let component: FilterComponent;
  let spectator: Spectator<FilterComponent>;

  const createComponent = createComponentFactory({
    component: FilterComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      AutocompleteInputModule,
      SelectInputModule,
      DateInputModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedTimePeriod', () => {
    test('should set period and call getTimeRangeHint', () => {
      const period = TimePeriod.LAST_12_MONTHS;

      component.selectedTimePeriod = period;

      expect(component.selectedTimePeriod).toEqual(period);
      expect(getTimeRangeHint).toHaveBeenCalledWith(period);
    });
  });

  describe('dimensionSelected', () => {
    test('should emit dimension, close the panel and focus autocomplete', () => {
      const dimension = new IdValue('1', 'bac');
      component.selectInput = { closePanel: () => {} } as SelectInputComponent;
      component.autocompleteInput = {
        focus: () => {},
      } as AutocompleteInputComponent;
      component.selectDimension.emit = jest.fn();
      component.selectInput.closePanel = jest.fn();
      component.autocompleteInput.focus = jest.fn();

      component.dimensionSelected(dimension);

      expect(component.selectDimension.emit).toHaveBeenCalled();
      expect(component.selectInput.closePanel).toHaveBeenCalled();
      expect(component.autocompleteInput.focus).toHaveBeenCalled();
    });
  });

  describe('dimensionFilter', () => {
    test('set dimensionFilter should set properties and asyncMode false when not org unit', () => {
      const idValue = new IdValue('DE', 'Germany');
      const filter = new Filter(FilterDimension.COUNTRY, [idValue]);

      component.dimensionFilter = filter;

      expect(component.dimensionFilter).toBe(filter);
      expect(component.options).toBe(filter.options);
      expect(component.asyncMode).toBeFalsy();
    });

    test('set dimensionFilter should set properties and asyncMode true when org unit', () => {
      const idValue = new IdValue('DE', 'Germany');
      const filter = new Filter(FilterDimension.ORG_UNIT, [idValue]);

      component.dimensionFilter = filter;

      expect(component.dimensionFilter).toBe(filter);
      expect(component.options).toBe(filter.options);
      expect(component.asyncMode).toBeTruthy();
    });
  });

  describe('optionSelected', () => {
    test('should emit selected filter', () => {
      const selectedFilter = {} as SelectedFilter;
      component.selectFilter.emit = jest.fn();

      component.optionSelected(selectedFilter);

      expect(component.selectFilter.emit).toHaveBeenCalledWith(selectedFilter);
    });
  });

  describe('timePeriodSelected', () => {
    test('should emit selected period', () => {
      const selectedPeriod = { id: TimePeriod.YEAR, value: 'Custom' };
      component.selectTimePeriod.emit = jest.fn();

      component.timePeriodSelected(selectedPeriod);

      expect(component.selectTimePeriod.emit).toHaveBeenCalledWith(
        selectedPeriod.id
      );
    });
  });

  describe('timeRangeSelected', () => {
    test('should emit selected time range filter', () => {
      const timeRange = '1|220000';
      const filter = {
        name: FilterKey.TIME_RANGE,
        idValue: {
          id: timeRange,
          value: 'beauty',
        },
      };
      component.selectFilter.emit = jest.fn();

      component.timeRangeSelected(timeRange);

      expect(component.selectFilter.emit).toHaveBeenCalledWith(filter);
    });
  });

  describe('selectedDimensionDataInvalid', () => {
    test('should set disabledTimeRangeFilter', () => {
      const invalid = true;

      component.selectedDimensionDataInvalid(invalid);

      expect(component.disabledTimeRangeFilter).toEqual(invalid);
    });
  });

  describe('autoCompleteInputChange', () => {
    test('should emit search string when asyncMode', () => {
      const search = 'search';
      component.dimensionFilter = {
        name: FilterDimension.ORG_UNIT,
        options: [],
      };
      component.autoCompleteInput.emit = jest.fn();

      component.autoCompleteInputChange(search);

      expect(component.autoCompleteInput.emit).toHaveBeenCalledWith(search);
    });

    test('should filter options when asyncMode false', () => {
      const search = 'g';
      const option1 = new IdValue('DE', 'Germany');
      const option2 = new IdValue('GR', 'Greece');
      const option3 = new IdValue('PL', 'Poland');
      const options = [option1, option2, option3];
      component.dimensionFilter = new Filter(FilterDimension.COUNTRY, options);

      component.autoCompleteInputChange(search);

      expect(component.dimensionFilter.options).toContain(option1);
      expect(component.dimensionFilter.options).toContain(option2);
      expect(component.dimensionFilter.options).not.toContain(option3);
    });
  });

  describe('set selectedDimensionIdValue', () => {
    test('should set org unit and disable range filter if undefined', () => {
      component.selectedDimensionIdValue = undefined;

      expect(component.selectedDimensionIdValue).toBeUndefined();
      expect(component.disabledTimeRangeFilter).toBeTruthy();
    });

    test('should set org unit and enable range filter if org unti set', () => {
      const idVal = {
        id: '123',
        value: 'Test 1234',
      };
      component.selectedDimensionIdValue = idVal;

      expect(component.selectedDimensionIdValue).toEqual(idVal);
      expect(component.disabledTimeRangeFilter).toBeFalsy();
    });
  });

  describe('activeDimension', () => {
    test('should set active dimension and select type when dimension not org unit', () => {
      const dimension = FilterDimension.BOARD;
      const dimensionIdValue = new IdValue(dimension, dimension);

      component.availableDimensions = [
        new IdValue('1', 'avc'),
        dimensionIdValue,
      ];

      component.activeDimension = dimension;

      expect(component.activeDimension).toEqual(dimension);
      expect(component.dimensionName).toEqual(FilterDimension[dimension]);
      expect(component.type).toEqual({
        type: 'select',
        label: FilterDimension[dimension],
      });
    });

    test('should set active dimension and autocomplete type when dimension org unit', () => {
      const dimension = FilterDimension.ORG_UNIT;
      const dimensionIdValue = new IdValue(dimension, dimension);

      component.availableDimensions = [
        new IdValue('1', 'avc'),
        dimensionIdValue,
      ];

      component.activeDimension = dimension;

      expect(component.activeDimension).toEqual(dimension);
      expect(component.dimensionName).toEqual(FilterDimension[dimension]);
      expect(component.type).toEqual({
        type: 'autocomplete',
        label: FilterDimension[dimension],
      });
    });
  });

  describe('getDimensionName', () => {
    test('should retun undefined if dimensions undefined', () => {
      component.availableDimensions = undefined;

      const result = component.getDimensionName();

      expect(result).toBeUndefined();
    });

    test('should retun undefined if dimension not found', () => {
      component.availableDimensions = [{ id: '123', value: 'Test 1234' }];
      component.activeDimension = FilterDimension.BOARD;

      const result = component.getDimensionName();

      expect(result).toBeUndefined();
    });

    test('should retun active dimension value', () => {
      component.availableDimensions = [
        { id: FilterDimension.BOARD, value: 'Test 1234' },
      ];
      component.activeDimension = FilterDimension.BOARD;

      const result = component.getDimensionName();

      expect(result).toEqual('Test 1234');
    });
  });
});
