import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { AutocompleteInputComponent } from '../autocomplete-input/autocomplete-input.component';
import { InputType } from '../autocomplete-input/models';
import {
  ASYNC_SEARCH_MIN_CHAR_LENGTH,
  LOCAL_SEARCH_MIN_CHAR_LENGTH,
} from '../constants';
import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../models';
import { SelectInputComponent } from '../select-input/select-input.component';
import { getBeautifiedTimeRange, getTimeRangeHint } from '../utils/utilities';
import { FilterLayout } from './filter-layout.enum';

@Component({
  selector: 'ia-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  @ViewChild(AutocompleteInputComponent)
  autocompleteInput: AutocompleteInputComponent;

  @ViewChild('selectInput')
  selectInput: SelectInputComponent;

  private _selectedDimensionIdValue: IdValue;
  private _selectedTimePeriod: TimePeriod;
  private _dimensionFilter: Filter;
  private _options: IdValue[];
  private _minCharLength = 0;
  private _asyncMode = false;
  type: InputType;

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

    if (this.autocompleteInput) {
      this.autocompleteInput.latestSelection = undefined;
    }
    this.type =
      activeDimension === FilterDimension.ORG_UNIT
        ? new InputType('autocomplete', this.dimensionName)
        : new InputType('select', this.dimensionName);
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

  @Input() dimensionDataLoading: boolean;
  @Input() orgUnitsLoading: boolean;

  @Input() set dimensionFilter(dimensionFilter: Filter) {
    this._dimensionFilter = dimensionFilter;
    this._options = dimensionFilter?.options;
    this._minCharLength =
      dimensionFilter?.name === FilterDimension.ORG_UNIT
        ? ASYNC_SEARCH_MIN_CHAR_LENGTH
        : LOCAL_SEARCH_MIN_CHAR_LENGTH;
    this._asyncMode = dimensionFilter?.name === FilterDimension.ORG_UNIT;
  }

  get dimensionFilter(): Filter {
    return this._dimensionFilter;
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
  @Input() set selectedDimensionIdValue(selectedDimensionIdValue: IdValue) {
    this._selectedDimensionIdValue = selectedDimensionIdValue;
    this.disabledTimeRangeFilter = selectedDimensionIdValue === undefined;
  }

  get selectedDimensionIdValue(): IdValue {
    return this._selectedDimensionIdValue;
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
  @Output() selectedDimensionInvalid = new EventEmitter<void>();

  dimensionSelected(selectedDimension: IdValue): void {
    this.selectDimension.emit(selectedDimension);
    this.selectInput.closePanel();
    this.autocompleteInput.focus();
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

  selectedDimensionDataInvalid(selectedDimensionDataInvalid: boolean): void {
    this.disabledTimeRangeFilter = selectedDimensionDataInvalid;
    this.selectedDimensionInvalid.emit();
  }

  autoCompleteInputChange(searchFor: string): void {
    if (this.asyncMode) {
      this.autoCompleteInput.emit(searchFor);
    } else {
      this.dimensionFilter.options =
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
