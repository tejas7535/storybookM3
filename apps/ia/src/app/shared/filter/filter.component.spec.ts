import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../autocomplete-input/autocomplete-input.module';
import { DateInputModule } from '../date-input/date-input.module';
import { IdValue, SelectedFilter, TimePeriod } from '../models';
import { SelectInputModule } from '../select-input/select-input.module';
import { getTimeRangeHint } from '../utils/utilities';
import { FilterComponent } from './filter.component';

jest.mock('../utils/utilities', () => ({
  getTimeRangeHint: jest.fn(() => 'test'),
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

      expect(component._selectedTimePeriod).toEqual(period);
      expect(getTimeRangeHint).toHaveBeenCalledWith(period);
    });
  });

  describe('onOptionSelected', () => {
    test('should emit selected filter', () => {
      const selectedFilter = {} as SelectedFilter;
      component.optionSelected.emit = jest.fn();

      component.onOptionSelected(selectedFilter);

      expect(component.optionSelected.emit).toHaveBeenCalledWith(
        selectedFilter
      );
    });
  });

  describe('onTimePeriodSelected', () => {
    test('should emit selected period', () => {
      const selectedPeriod = {} as IdValue;
      component.timePeriodSelected.emit = jest.fn();

      component.onTimePeriodSelected(selectedPeriod);

      expect(component.timePeriodSelected.emit).toHaveBeenCalledWith(
        selectedPeriod
      );
    });
  });

  describe('onTimeRangeSelected', () => {
    test('should emit selected time range', () => {
      const selectedPeriod = '1|0';
      component.timeRangeSelected.emit = jest.fn();

      component.onTimeRangeSelected(selectedPeriod);

      expect(component.timeRangeSelected.emit).toHaveBeenCalledWith(
        selectedPeriod
      );
    });
  });

  describe('onOrgUnitInvalid', () => {
    test('should emit true when org unit invalid', () => {
      const invalid = true;
      component.orgUnitInvalid.emit = jest.fn();

      component.onOrgUnitInvalid(invalid);

      expect(component.orgUnitInvalid.emit).toHaveBeenCalledWith(invalid);
    });
  });
});
