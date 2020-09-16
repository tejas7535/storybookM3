import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, tap } from 'rxjs/operators';

import { FilterItem, IdValue, TextSearch } from '../../../core/store/models';
import { AutocompleteService } from '../services/autocomplete.service';

@Component({
  selector: 'gq-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss'],
})
export class FilterInputComponent implements OnInit, OnChanges {
  @Input() filter: FilterItem;

  @Input() autocompleteLoading = false;

  @Input() selectedFilter: string;

  @Output() private readonly updateFilter: EventEmitter<
    FilterItem
  > = new EventEmitter();

  @Output() private readonly autocomplete: EventEmitter<
    TextSearch
  > = new EventEmitter();

  @ViewChild('autocomplete') autocompleteInput: ElementRef;

  ONE_CHAR_LENGTH = 1;
  DEBOUNCE_TIME_DEFAULT = 500;
  DEBOUNCE_TIME_ONE_CHAR = 1000;

  debounceIsActive = false;

  form = new FormControl();
  searchForm = new FormControl();
  filterOptions: IdValue[] = [];
  selectAllChecked = false;
  selectAllIndeterminate = false;

  placeHolder = '';

  readonly subscription: Subscription = new Subscription();

  constructor(private readonly autocompleteService: AutocompleteService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchForm.valueChanges
        .pipe(
          tap(() => (this.debounceIsActive = true)),
          debounce(() =>
            this.filter
              ? this.searchForm.value &&
                this.searchForm.value.length > this.ONE_CHAR_LENGTH
                ? timer(this.DEBOUNCE_TIME_DEFAULT)
                : timer(this.DEBOUNCE_TIME_ONE_CHAR)
              : EMPTY
          )
        )
        .subscribe((val) => {
          this.searchFieldChange(val);
          this.debounceIsActive = false;
        })
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      const filterUpdate: FilterItem = changes.filter.currentValue;
      this.placeHolder = filterUpdate ? filterUpdate.filter : '';

      // prevent overriding existing selections due to new autocomplete suggestions
      if (filterUpdate) {
        // const val = Array.isArray(this.form.value) ? this.form.value : []; // hack since it is single select for now
        this.filterOptions = this.autocompleteService.mergeOptionsWithSelectedOptions(
          filterUpdate.options,
          this.form.value ? [this.form.value] : []
        );
      }

      this.updateFormValue();
    }
  }

  /**
   * Filter all options by entered search value.
   */
  public filterItemsLocally(
    search: string,
    selectedValues: string[]
  ): IdValue[] {
    return this.filter.options
      .slice()
      .filter(
        (item: IdValue) =>
          !search ||
          search.length === 0 ||
          item.value.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
          selectedValues.includes(item.id)
      );
  }

  /**
   * Update current form value with new filter (options).
   */
  public updateFormValue(): void {
    const filteredItems = this.filterOptions.filter(
      (it: IdValue) => it.selected
    );

    this.selectAllChecked =
      filteredItems.length === this.filterOptions.length &&
      filteredItems.length > 0;

    this.selectAllIndeterminate =
      filteredItems.length < this.filterOptions.length &&
      filteredItems.length > 0;

    // hack since single select
    const filteredItem =
      filteredItems.length > 0 ? filteredItems[0] : undefined;

    this.form.setValue(filteredItem);
  }

  /**
   * Listener for search input changes.
   */
  public searchFieldChange(search: string): void {
    this.handleLocalSearch(search);
  }

  /**
   * Reset Search Form Field.
   */
  public resetSearchField(): void {
    this.searchForm.reset();
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(_index: number, item: IdValue): IdValue {
    return item;
  }

  /**
   * Check/Uncheck select all checkbox correctly dependent on selected options.
   */
  public selectionChange(evt: MatOptionSelectionChange): void {
    if (evt.isUserInput) {
      const isSelected = evt.source.selected;

      // const formValueLength = isSelected
      //   ? +this.form.value.length + 1
      //   : +this.form.value.length - 1;
      const formValueLength = isSelected ? 1 : 0;

      this.selectAllChecked = formValueLength === this.filterOptions.length;

      this.selectAllIndeterminate =
        formValueLength < this.filterOptions.length && formValueLength > 0;
    }
  }

  /**
   * Search within given options.
   */
  private handleLocalSearch(search: string): void {
    // const selectedIds = this.form.value.map((item: IdValue) => item.id);
    const selectedIds = this.form.value ? [this.form.value.id] : [];
    const updatedOptions = this.filterItemsLocally(search, selectedIds);

    // const countSelectedOptions = this.form.value.length;
    const countSelectedOptions = 1;

    this.selectAllChecked = countSelectedOptions === updatedOptions.length;

    this.selectAllIndeterminate =
      countSelectedOptions > 0 && countSelectedOptions < updatedOptions.length;

    this.filterOptions = updatedOptions;

    // only dispatch event when search at at least of length 1
    if (search && search.length > 0) {
      this.emitUpdate([this.form.value]);
      this.autocomplete.emit({ filter: this.filter.filter, searchFor: search });
    } else {
      this.filterOptions = [this.form.value];
    }
  }

  /**
   * Update store when dropdown is closed / focus input on open.
   */
  public dropdownOpenedChange(isOpened: boolean): void {
    if (!isOpened) {
      this.emitUpdate([this.form.value]); // since it is single select for now
    } else {
      setTimeout(() => {
        this.autocompleteInput.nativeElement.focus();
      }, 100);
    }
  }

  /**
   * Update store with current selections.
   */
  private emitUpdate(values: IdValue[]): void {
    this.updateFilter.emit({
      ...this.filter,
      options: this.filter.options.slice().map((it: IdValue) => {
        const tmp: IdValue = { ...it };
        const item = values.find((i: IdValue) => i.id && i.id === it.id);
        tmp.selected = item !== undefined;

        return tmp;
      }),
    });
  }
}
