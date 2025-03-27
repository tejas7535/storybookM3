import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../date-input/date-input.module';
import {
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../models';
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

  describe('onDimensionSelected', () => {
    test('should emit dimension', () => {
      const dimension = new IdValue('1', 'bac');
      component.selectDimension.emit = jest.fn();

      component.onDimensionSelected(dimension);

      expect(component.selectDimension.emit).toHaveBeenCalled();
    });
  });

  describe('onBenchmarkDimensionSelected', () => {
    test('should emit selected benchmark dimension', () => {
      const dimension = new IdValue('1', 'bac');
      component.selectBenchmarkDimension.emit = jest.fn();

      component.onBenchmarkDimensionSelected(dimension);

      expect(component.selectBenchmarkDimension.emit).toHaveBeenCalled();
    });
  });

  describe('onDimensionOptionSelected', () => {
    test('should emit selected filter', () => {
      const selectedFilter = {} as SelectedFilter;
      component.selectDimensionOption.emit = jest.fn();

      component.onDimensionOptionSelected(selectedFilter);

      expect(component.selectDimensionOption.emit).toHaveBeenCalledWith(
        selectedFilter
      );
    });
  });

  describe('onBenchmarkOptionSelected', () => {
    test('should emit selected option', () => {
      const selectedFilter = {} as SelectedFilter;
      component.selectBenchmarkOption.emit = jest.fn();

      component.onBenchmarkOptionSelected(selectedFilter);

      expect(component.selectBenchmarkOption.emit).toHaveBeenCalledWith(
        selectedFilter
      );
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
      component.selectDimensionOption.emit = jest.fn();

      component.timeRangeSelected(timeRange);

      expect(component.selectDimensionOption.emit).toHaveBeenCalledWith(filter);
    });
  });

  describe('onDimensionAutocompleteInput', () => {
    test('should emit search string when asyncMode', () => {
      const search = 'search';
      component.dimensionFilter = {
        name: FilterDimension.ORG_UNIT,
        options: [],
      };
      component.autoCompleteInput.emit = jest.fn();

      component.onDimensionAutocompleteInput(search);

      expect(component.autoCompleteInput.emit).toHaveBeenCalledWith(search);
    });
  });

  describe('onBenchmarkAutocompleteInput', () => {
    test('should emit search string when asyncMode', () => {
      const search = 'search';
      component.benchmarkDimensionFilter = {
        name: FilterDimension.ORG_UNIT,
        options: [],
      };
      component.benchmarkAutocompleteInput.emit = jest.fn();

      component.onBenchmarkAutocompleteInput(search);

      expect(component.benchmarkAutocompleteInput.emit).toHaveBeenCalledWith(
        search
      );
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
    test('should set active dimension and when dimension not org unit', () => {
      const dimension = FilterDimension.BOARD;
      const dimensionIdValue = new IdValue(dimension, dimension);

      component.availableDimensions = [
        new IdValue('1', 'avc'),
        dimensionIdValue,
      ];

      component.activeDimension = dimension;

      expect(component.activeDimension).toEqual(dimension);
    });

    test('should set active dimension when dimension org unit', () => {
      const dimension = FilterDimension.ORG_UNIT;
      const dimensionIdValue = new IdValue(dimension, dimension);

      component.availableDimensions = [
        new IdValue('1', 'avc'),
        dimensionIdValue,
      ];

      component.activeDimension = dimension;

      expect(component.activeDimension).toEqual(dimension);
    });
  });
});
