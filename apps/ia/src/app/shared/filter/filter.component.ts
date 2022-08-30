import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  Filter,
  FilterDimension,
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
  private readonly ASYNC_SEARCH_MIN_CHAR_LENGTH = 2;
  private readonly LOCAL_SEARCH_MIN_CHAR_LENGTH = 0;

  private _selectedBusinessArea: IdValue;
  private _selectedTimePeriod: TimePeriod;
  private _businessAreaFilter: Filter;
  private _options: IdValue[];
  private _minCharLength = 0;
  private _asyncMode = false;
  private _dimensionName: string;

  get dimensionName(): string {
    return this._dimensionName;
  }

  private _activeDimension: FilterDimension;

  get activeDimension(): FilterDimension {
    return this._activeDimension;
  }

  @Input() set activeDimension(activeDimension: FilterDimension) {
    this._activeDimension = activeDimension;
    this._dimensionName = this.availableDimensions?.find(
      (dimension) => dimension.id === this.activeDimension
    )?.value;
  }

  timeRangeHintValue = 'time range';

  disabledTimeRangeFilter = true;
  filterLayout = FilterLayout;

  private _availableDimensions: IdValue[];

  @Input() set availableDimensions(availableDimensions: IdValue[]) {
    this._availableDimensions = availableDimensions;
    this._dimensionName = this.getDimensionName();
  }

  get availableDimensions(): IdValue[] {
    return this._availableDimensions;
  }

  @Input() businessAreaLoading: boolean;
  @Input() orgUnitsLoading: boolean;

  @Input() set businessAreaFilter(businessAreaFilter: Filter) {
    this._businessAreaFilter = businessAreaFilter;
    this._options = businessAreaFilter.options;
    this._minCharLength =
      businessAreaFilter.name === FilterDimension.ORG_UNIT
        ? this.ASYNC_SEARCH_MIN_CHAR_LENGTH
        : this.LOCAL_SEARCH_MIN_CHAR_LENGTH;
    this._asyncMode = businessAreaFilter.name === FilterDimension.ORG_UNIT;
  }

  get businessAreaFilter(): Filter {
    return this._businessAreaFilter;
  }

  get options(): IdValue[] {
    return this._options;
  }

  get minCharLength(): number {
    return this._minCharLength;
  }

  get asyncMode(): boolean {
    return this._asyncMode;
  }

  @Input() layout: FilterLayout = FilterLayout.DEFAULT;

  @Input() disableFilters: boolean;
  @Input() set selectedBusinessArea(selectedBusinessArea: IdValue) {
    this._selectedBusinessArea = selectedBusinessArea;
    this.disabledTimeRangeFilter = selectedBusinessArea === undefined;
  }

  get selectedBusinessArea(): IdValue {
    return this._selectedBusinessArea;
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

  @Output() selectDimension = new EventEmitter<IdValue>();
  @Output() selectTimePeriod = new EventEmitter<TimePeriod>();
  @Output() selectFilter = new EventEmitter<SelectedFilter>();
  @Output() readonly autoCompleteInput: EventEmitter<string> =
    new EventEmitter();

  dimensionSelected(selectedDimension: IdValue): void {
    this.selectDimension.emit(selectedDimension);
  }

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

  businessAreaInvalid(businessAreaIsInvalid: boolean): void {
    this.disabledTimeRangeFilter = businessAreaIsInvalid;
  }

  autoCompleteInputChange(searchFor: string): void {
    if (this.asyncMode) {
      this.autoCompleteInput.emit(searchFor);
    } else {
      this.businessAreaFilter.options =
        searchFor.length > 0
          ? this.options?.filter((option) =>
              option.value?.toUpperCase().startsWith(searchFor.toUpperCase())
            )
          : this.options;
    }
  }

  getDimensionName(): string {
    return this.availableDimensions?.find(
      (dimension) => dimension.id === this.activeDimension
    )?.value;
  }
}
