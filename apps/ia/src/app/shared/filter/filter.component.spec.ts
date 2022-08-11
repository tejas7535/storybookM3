import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../date-input/date-input.module';
import { FilterKey, SelectedFilter, TimePeriod } from '../models';
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

  describe('orgUnitInvalid', () => {
    test('should set disabledTimeRangeFilter', () => {
      const invalid = true;

      component.orgUnitInvalid(invalid);

      expect(component.disabledTimeRangeFilter).toEqual(invalid);
    });
  });

  describe('autoCompleteOrgUnitsChange', () => {
    test('should emit search string', () => {
      const search = 'search';
      component.autoCompleteOrgUnits.emit = jest.fn();

      component.autoCompleteOrgUnitsChange(search);

      expect(component.autoCompleteOrgUnits.emit).toHaveBeenCalledWith(search);
    });
  });
});
