import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  Filter,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../models';
import { getBeautifiedTimeRange, getTimeRangeHint } from '../utils/utilities';
import { FilterLayout } from './filter-layout.enum';

@Component({
  selector: 'ia-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  private _selectedOrgUnit: IdValue;
  private _selectedTimePeriod: TimePeriod;
  timeRangeHintValue = 'time range';

  disabledTimeRangeFilter = true;
  filterLayout = FilterLayout;

  @Input() layout: FilterLayout = FilterLayout.DEFAULT;

  @Input() disableFilters: boolean;
  @Input() orgUnitsFilter: Filter;
  @Input() orgUnitsLoading: boolean;
  @Input() set selectedOrgUnit(selectedOrgUnit: IdValue) {
    this._selectedOrgUnit = selectedOrgUnit;
    this.disabledTimeRangeFilter = selectedOrgUnit === undefined;
  }
  get selectedOrgUnit(): IdValue {
    return this._selectedOrgUnit;
  }

  @Input() selectedTime: IdValue;
  @Input() timePeriods: IdValue[];

  @Input() set selectedTimePeriod(selectedTimePeriod: TimePeriod) {
    this._selectedTimePeriod = selectedTimePeriod;
    this.timeRangeHintValue = getTimeRangeHint(selectedTimePeriod);
  }
  get selectedTimePeriod(): TimePeriod {
    return this._selectedTimePeriod;
  }

  @Output() selectTimePeriod = new EventEmitter<TimePeriod>();
  @Output() selectFilter = new EventEmitter<SelectedFilter>();
  @Output() readonly autoCompleteOrgUnits: EventEmitter<string> =
    new EventEmitter();

  optionSelected(selectedFilter: SelectedFilter): void {
    this.selectFilter.emit(selectedFilter);
  }

  timePeriodSelected(idValue: IdValue): void {
    this.selectTimePeriod.emit(idValue.id as unknown as TimePeriod);
  }

  timeRangeSelected(timeRange: string): void {
    const filter = {
      name: FilterKey.TIME_RANGE,
      idValue: {
        id: timeRange,
        value: getBeautifiedTimeRange(timeRange),
      },
    };
    this.selectFilter.emit(filter);
  }

  orgUnitInvalid(orgUnitIsInvalid: boolean): void {
    this.disabledTimeRangeFilter = orgUnitIsInvalid;
  }

  autoCompleteOrgUnitsChange(searchFor: string): void {
    this.autoCompleteOrgUnits.emit(searchFor);
  }
}
