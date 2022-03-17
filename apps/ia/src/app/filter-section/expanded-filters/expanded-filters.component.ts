import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  Filter,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import { getTimeRangeHint } from '../../shared/utils/utilities';

@Component({
  selector: 'ia-expanded-filters',
  templateUrl: './expanded-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedFiltersComponent {
  private _selectedTimePeriod: TimePeriod;
  private _selectedOrgUnit: string;

  disabledTimeRangeFilter = true;
  timeRangeHintValue = '';

  @Input() orgUnitsFilter: Filter;
  @Input() orgUnitsLoading: boolean;
  @Input() set selectedOrgUnit(selectedOrgUnit: string) {
    this._selectedOrgUnit = selectedOrgUnit;
    this.disabledTimeRangeFilter = selectedOrgUnit === undefined;
  }
  get selectedOrgUnit(): string {
    return this._selectedOrgUnit;
  }

  @Input() timePeriods: IdValue[];

  @Input() set selectedTimePeriod(selectedTimePeriod: TimePeriod) {
    this._selectedTimePeriod = selectedTimePeriod;
    this.timeRangeHintValue = getTimeRangeHint(selectedTimePeriod);
  }
  get selectedTimePeriod(): TimePeriod {
    return this._selectedTimePeriod;
  }

  @Input() selectedTime: string;

  @Output() readonly selectOption: EventEmitter<SelectedFilter> =
    new EventEmitter();
  @Output() readonly selectTimePeriod: EventEmitter<TimePeriod> =
    new EventEmitter();
  @Output() readonly selectTimeRange: EventEmitter<string> = new EventEmitter();

  @Output() readonly autoCompleteOrgUnits: EventEmitter<string> =
    new EventEmitter();

  optionSelected(filter: SelectedFilter): void {
    this.selectOption.emit(filter);
  }

  orgUnitInvalid(orgUnitIsInvalid: boolean): void {
    this.disabledTimeRangeFilter = orgUnitIsInvalid;
  }

  timePeriodSelected(idValue: IdValue): void {
    this.selectTimePeriod.emit(idValue.id as unknown as TimePeriod);
  }

  timeRangeSelected(timeRange: string): void {
    this.selectTimeRange.emit(timeRange);
  }

  autoCompleteOrgUnitsChange(searchFor: string): void {
    this.autoCompleteOrgUnits.emit(searchFor);
  }
}
