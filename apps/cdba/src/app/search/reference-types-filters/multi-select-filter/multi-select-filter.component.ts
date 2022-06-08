import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';

import { Subscription, timer } from 'rxjs';
import { debounce, tap } from 'rxjs/operators';

import {
  FilterItemIdValue,
  IdValue,
  TextSearch,
} from '../../../core/store/reducers/search/models';
import { SearchUtilityService } from '../../services/search-utility.service';
import { Filter } from '../filter';

@Component({
  selector: 'cdba-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
})
export class MultiSelectFilterComponent
  implements OnChanges, OnDestroy, OnInit, Filter
{
  @Input() filter: FilterItemIdValue;

  @Input() autocompleteLoading = false;

  @Output()
  private readonly updateFilter: EventEmitter<FilterItemIdValue> = new EventEmitter();

  @Output()
  private readonly autocomplete: EventEmitter<TextSearch> = new EventEmitter();

  @ViewChild('autocomplete') autocompleteInput: ElementRef;

  ONE_CHAR_LENGTH = 1;
  DEBOUNCE_TIME_DEFAULT = 500;
  DEBOUNCE_TIME_ONE_CHAR = 1000;

  form = new UntypedFormControl();
  searchForm = new UntypedFormControl();
  selectAllChecked = false;
  selectAllIndeterminate = false;

  filterOptions: IdValue[] = [];
  filterName = '';

  debounceIsActive = false;

  readonly subscription: Subscription = new Subscription();

  public constructor(private readonly searchUtilities: SearchUtilityService) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.searchForm.valueChanges
        .pipe(
          tap(() => (this.debounceIsActive = true)),
          debounce(() => this.getDebounceTimer())
        )

        .subscribe((val: string) => {
          // when user resets input, val will be null
          this.searchFieldChange(val?.trim());
          this.debounceIsActive = false;
        })
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      const filterUpdate = changes.filter.currentValue;
      this.filterName = filterUpdate.name;

      // prevent overriding existing selections due to new autocomplete suggestions
      this.filterOptions = filterUpdate.autocomplete
        ? this.searchUtilities.mergeOptionsWithSelectedOptions(
            filterUpdate.items,
            this.form.value || []
          )
        : filterUpdate.items;

      // consider current search string if local search
      if (!changes.filter.currentValue.autocomplete) {
        const selectedIds = this.filterOptions
          .filter((item: IdValue) => item.selected)
          .map((item: IdValue) => item.id);
        this.filterOptions = this.filterItemsLocally(
          this.searchForm.value,
          selectedIds
        );
      }

      this.updateFormValue();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Reset search field and the form itself.
   */
  public reset(): void {
    this.resetSearchField();
    this.form.setValue([]);
  }

  /**
   * Listener for search input changes.
   */
  public searchFieldChange(search: string): void {
    if (!this.filter.autocomplete) {
      this.handleLocalSearch(search);
    } else {
      const searchText =
        this.filter.name === 'material_number' && search?.length > 0
          ? search.split('-').join('')
          : search;
      this.handleRemoteSearch(searchText);
    }
  }

  /**
   * Update current form value with new filter (options).
   */
  public updateFormValue(): void {
    const filteredItems = this.filterOptions.filter((it: any) => it.selected);

    this.selectAllChecked =
      filteredItems.length === this.filterOptions.length &&
      filteredItems.length > 0;

    this.selectAllIndeterminate =
      filteredItems.length < this.filterOptions.length &&
      filteredItems.length > 0;

    this.form.setValue(filteredItems);
  }

  /**
   * Reset Search Form Field.
   */
  public resetSearchField(): void {
    this.searchForm.reset();
  }

  /**
   * Filter all options by entered search value.
   */
  public filterItemsLocally(
    search: string,
    selectedValues: string[]
  ): IdValue[] {
    const result = [...this.filter.items].filter(
      (item: IdValue) =>
        !search ||
        search.length === 0 ||
        item.value.toLowerCase().includes(search.toLowerCase()) ||
        item.id.includes(search.toLowerCase()) ||
        selectedValues.includes(item.id)
    );

    return result;
  }

  /**
   * Toggle all options.
   */
  public selectAllChange(checked: boolean): void {
    this.selectAllChecked = checked;
    this.selectAllIndeterminate = false;
    this.form.setValue(this.selectAllChecked ? this.filterOptions : []);
  }

  /**
   * Check/Uncheck select all checkbox correctly dependent on selected options.
   */
  public selectionChange(evt: MatOptionSelectionChange): void {
    if (evt.isUserInput) {
      const isSelected = evt.source.selected;

      const formValueLength = isSelected
        ? +this.form.value.length + 1
        : +this.form.value.length - 1;

      this.selectAllChecked = formValueLength === this.filterOptions.length;

      this.selectAllIndeterminate =
        formValueLength < this.filterOptions.length && formValueLength > 0;
    }
  }

  /**
   * Update store when dropdown is closed / focus input on open.
   */
  public dropdownOpenedChange(isOpened: boolean): void {
    if (!isOpened) {
      this.emitUpdate(this.form.value);
    } else {
      setTimeout(() => {
        this.autocompleteInput.nativeElement.focus();
      }, 100);
    }
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(_index: number, item: IdValue): IdValue {
    return item;
  }

  /**
   * Search within given options.
   */
  private handleLocalSearch(search: string): void {
    const selectedIds = this.form.value.map((item: IdValue) => item.id);
    const updatedOptions = this.filterItemsLocally(search, selectedIds);

    const countSelectedOptions = this.form.value.length;

    this.selectAllChecked = countSelectedOptions === updatedOptions.length;

    this.selectAllIndeterminate =
      countSelectedOptions > 0 && countSelectedOptions < updatedOptions.length;

    this.filterOptions = updatedOptions;
  }

  /**
   * Get appropriate options via remote autocomplete / REST call.
   *
   */
  private handleRemoteSearch(search: string): void {
    // only dispatch event when search at at least of length 1
    if (search && search.length > 0) {
      this.emitUpdate(this.form.value);
      this.autocomplete.emit({ field: this.filter.name, value: search });
    } else {
      this.filterOptions = this.form.value;
    }
  }

  /**
   * Update store with current selections.
   */
  private emitUpdate(values: IdValue[]): void {
    this.updateFilter.emit({
      ...this.filter,
      items: [...this.filter.items].map((it) => {
        const tmp = { ...it };
        const item = values.find((i: IdValue) => i.id && i.id === it.id);

        tmp.selected = item !== undefined;

        return tmp;
      }),
    });
  }
  private getDebounceTimer(): any {
    let debounceTime = 0;

    if (this.filter?.autocomplete) {
      debounceTime =
        this.searchForm.value?.length > this.ONE_CHAR_LENGTH
          ? this.DEBOUNCE_TIME_DEFAULT
          : this.DEBOUNCE_TIME_ONE_CHAR;
    }

    return timer(debounceTime);
  }
}
