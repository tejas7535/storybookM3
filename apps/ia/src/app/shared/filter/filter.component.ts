import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Filter, IdValue, SelectedFilter, TimePeriod } from '../models';
import { getTimeRangeHint } from '../utils/utilities';

@Component({
  selector: 'ia-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  _selectedTimePeriod: TimePeriod;
  timeRangeHintValue = 'time range';

  @Input() orgUnitsFilter: Filter;
  @Input() selectedOrgUnit: string;
  @Input() selectedTime: string;
  @Input() timePeriods: IdValue[];
  @Input() disableFilters: boolean;
  @Input() disabledTimeRangeFilter: boolean;

  @Input() set selectedTimePeriod(period: TimePeriod) {
    this._selectedTimePeriod = period;
    this.timeRangeHintValue = getTimeRangeHint(period);
  }

  @Output() orgUnitInvalid = new EventEmitter<boolean>();
  @Output() optionSelected = new EventEmitter<SelectedFilter>();
  @Output() timePeriodSelected = new EventEmitter<IdValue>();
  @Output() timeRangeSelected = new EventEmitter<string>();

  onOptionSelected(selectedFilter: SelectedFilter): void {
    this.optionSelected.emit(selectedFilter);
  }

  onTimePeriodSelected(selectedTimePeriod: IdValue): void {
    this.timePeriodSelected.emit(selectedTimePeriod);
  }

  onTimeRangeSelected(selectedTimeRange: string): void {
    this.timeRangeSelected.emit(selectedTimeRange);
  }

  onOrgUnitInvalid(invalid: boolean): void {
    this.orgUnitInvalid.emit(invalid);
  }
}
