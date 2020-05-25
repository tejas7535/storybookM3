import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core/option';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

import {
  FilterItemIdValue,
  IdValue,
  TextSearch,
} from '../../../core/store/reducers/search/models';

@Component({
  selector: 'cdba-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
})
export class MultiSelectFilterComponent
  implements OnChanges, OnDestroy, OnInit {
  @Input() filter: FilterItemIdValue;

  @Output() private readonly removeFilter: EventEmitter<
    string
  > = new EventEmitter();

  @Output() private readonly updateFilter: EventEmitter<
    FilterItemIdValue
  > = new EventEmitter();

  @Output() private readonly autocomplete: EventEmitter<
    TextSearch
  > = new EventEmitter();

  form = new FormControl();
  searchForm = new FormControl();
  selectAllChecked = false;
  selectAllIndeterminate = false;
  modifiedFilter: FilterItemIdValue = new FilterItemIdValue(undefined, []);
  readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(
      this.searchForm.valueChanges
        .pipe(
          debounce(() =>
            this.modifiedFilter.autocomplete ? timer(500) : EMPTY
          )
        )
        .subscribe((val) => {
          this.searchFieldChange(val);
        })
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      this.modifiedFilter.name = changes.filter.currentValue.name;
      this.modifiedFilter.items = changes.filter.currentValue.items;

      // consider current search string if local search
      if (!changes.filter.currentValue.autocomplete) {
        const selectedIds = this.modifiedFilter.items
          .filter((item: IdValue) => item.selected)
          .map((item: IdValue) => item.id);
        this.modifiedFilter.items = this.filterItemsLocally(
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
   * Listener for search input changes.
   */
  public searchFieldChange(search: string): void {
    if (!this.filter.autocomplete) {
      this.handleLocalSearch(search);
    } else {
      this.handleRemoteSearch(search);
    }
  }

  public updateFormValue(): void {
    const filteredItems = this.modifiedFilter.items.filter(
      (it: any) => it.selected
    );

    this.selectAllChecked =
      filteredItems.length === this.modifiedFilter.items.length &&
      filteredItems.length > 0;

    this.selectAllIndeterminate =
      filteredItems.length < this.modifiedFilter.items.length &&
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
    const result = this.filter.items.filter(
      (item: IdValue) =>
        !search ||
        search.length === 0 ||
        item.value.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
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
    this.form.setValue(this.selectAllChecked ? this.modifiedFilter.items : []);
  }

  public selectionChange(evt: MatOptionSelectionChange): void {
    if (evt.isUserInput) {
      const isSelected = evt.source.selected;

      const formValueLength = isSelected
        ? +this.form.value.length + 1
        : +this.form.value.length - 1;

      this.selectAllChecked =
        formValueLength === this.modifiedFilter.items.length;

      this.selectAllIndeterminate =
        formValueLength < this.modifiedFilter.items.length &&
        formValueLength > 0;
    }
  }

  public updateFiltersOnDropdownClose(isOpened: boolean): void {
    if (!isOpened) {
      if (this.form.value.length === 0) {
        this.removeFilter.emit(this.modifiedFilter.name);
      } else {
        this.emitUpdate();
      }
    }
  }

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(_index: number, item: IdValue): string {
    return item.id;
  }

  private handleLocalSearch(search: string): void {
    const selectedIds = this.form.value.map((item: IdValue) => item.id);
    const updatedOptions = this.filterItemsLocally(search, selectedIds);

    const countSelectedOptions = this.form.value.length;

    this.selectAllChecked = countSelectedOptions === updatedOptions.length;

    this.selectAllIndeterminate =
      countSelectedOptions > 0 && countSelectedOptions < updatedOptions.length;

    this.modifiedFilter.items = updatedOptions;
  }

  private handleRemoteSearch(search: string): void {
    // only dispatch event when search at at least of length 1
    if (search && search.length > 0) {
      this.emitUpdate();
      this.autocomplete.emit({ field: this.filter.name, value: search });
    } else {
      this.modifiedFilter.items = this.form.value;
    }
  }

  private emitUpdate(): void {
    this.updateFilter.emit({
      ...this.modifiedFilter,
      items: this.modifiedFilter.items.slice().map((it) => {
        const tmp = { ...it };
        const item = this.form.value.find(
          (i: IdValue) => i.id && i.id === it.id
        );
        if (item) {
          tmp.selected = true;
        }

        return tmp;
      }),
    });
  }
}
