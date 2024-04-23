import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { Subscription } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { StringOption } from '@schaeffler/inputs';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { FilterItemIdValue } from '@cdba/core/store/reducers/search/models';
import { SearchUtilityService } from '@cdba/search/services/search-utility.service';
import { MaterialNumberPipe } from '@cdba/shared/pipes';
import { MaterialNumberModule } from '@cdba/shared/pipes/material-number/material-number.module';

import { Filter } from '../filter';
import { FormatValuePipe } from '../multi-select-filter/pipes/format-value.pipe';
import { MultiSelectValuePipe } from '../multi-select-filter/pipes/multi-select-value.pipe';

@Component({
  selector: 'cdba-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
  providers: [MaterialNumberPipe],
})
export class MultiSelectFilterComponent
  implements OnInit, OnChanges, OnDestroy, Filter
{
  @Output()
  private readonly autocomplete: EventEmitter<{
    searchFor: string;
    filter: FilterItemIdValue;
  }> = new EventEmitter();

  @Output()
  private readonly updateFilter: EventEmitter<FilterItemIdValue> =
    new EventEmitter();

  @ViewChild('select')
  private readonly selectComponent!: SelectComponent;

  public filterName = '';
  public formControl = new FormControl();

  public stringOptions: StringOption[] = [];

  public readonly subscription: Subscription = new Subscription();

  private selectedFilterOptions: StringOption[] = [];
  private invariantLocalSearchFilterOptions: StringOption[] = [];

  private _filter: FilterItemIdValue;

  constructor(private readonly searchUtilities: SearchUtilityService) {}

  get filter(): FilterItemIdValue {
    return this._filter;
  }

  @Input()
  set filter(filter: FilterItemIdValue) {
    this._filter = filter;

    if (filter.selectedItems) {
      this.selectedFilterOptions = filter.selectedItems;
    }

    if (filter.items) {
      this.stringOptions = filter.items
        .map(
          (x) =>
            ({
              id: x.id,
              title: x.title,
            }) as StringOption
        )
        .filter((x) => !this.selectedFilterOptions.some((y) => y.id === x.id));

      this.stringOptions = [
        ...this.selectedFilterOptions,
        ...this.stringOptions,
      ];

      this.formControl.setValue(this.formControl.value, { onlySelf: true });
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.formControl.valueChanges.subscribe((value) => {
        if (value) {
          this.selectedFilterOptions = [...value];
        }
      })
    );

    this.createInvariantFilterOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter.currentValue?.selectedItems?.length > 0) {
      this.formControl.setValue(this.filter.selectedItems);
    }
    if (
      changes.filter.currentValue?.items.length !==
      changes.filter.previousValue?.items.length
    ) {
      this.createInvariantFilterOptions();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearchUpdated(search: string): void {
    let searchText = search?.trim();
    if (this.filter.autocomplete) {
      searchText =
        this.filter.name === 'material_number' && searchText?.length > 0
          ? searchText.split('-').join('')
          : searchText;
      this.handleRemoteSearch(searchText);
    } else {
      this.handleLocalSearch(searchText);
    }
  }

  onOpenedChange(change: boolean): void {
    if (change) {
      this.formControl.setValue(this.formControl.value, { onlySelf: true });
    } else {
      const options = this.stringOptions
        .filter((x) => !this.selectedFilterOptions.some((y) => y.id === x.id))
        .map(
          (x) =>
            ({
              id: x.id,
              title: x.title,
            }) as StringOption
        );

      this.stringOptions = [...this.selectedFilterOptions, ...options];

      this.updateFilter.emit({
        ...this.filter,
        items: this.stringOptions,
        selectedItems: this.selectedFilterOptions,
      });
    }
  }

  /**
   * Reset search field and the form itself.
   */
  reset(): void {
    this.stringOptions = this.filter.autocomplete
      ? []
      : this.invariantLocalSearchFilterOptions;
    this.selectComponent.resetControls();
    this.formControl.setValue([]);
  }

  /**
   * Creates the list of options for prepopulated filters (plant and product line)
   */
  private createInvariantFilterOptions() {
    if (!this.filter.autocomplete) {
      this.invariantLocalSearchFilterOptions = this.filter.items;
    }
  }

  /**
   * Filter all invariant/local options by entered search value.
   */
  private filterItemsLocally(search: string): StringOption[] {
    const result = this.invariantLocalSearchFilterOptions.filter(
      (item: StringOption) =>
        // search only in title since it also contains the id
        item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );

    return result;
  }

  /**
   * Search within prepopulated filter with options.
   */
  private handleLocalSearch(search: string): void {
    if (search && search.length > 0) {
      const filteredItemsLocally = this.filterItemsLocally(search);
      this.stringOptions = this.searchUtilities.mergeOptionsWithSelectedOptions(
        this.selectedFilterOptions,
        filteredItemsLocally
      );
    } else {
      this.stringOptions = this.searchUtilities.mergeOptionsWithSelectedOptions(
        this.invariantLocalSearchFilterOptions,
        this.selectedFilterOptions
      );
    }
  }

  /**
   * Get appropriate options via remote autocomplete / REST call.
   *
   */
  private handleRemoteSearch(search: string): void {
    // only dispatch event when search contains at least 1 character
    if (search && search.length > 0) {
      this.autocomplete.emit({
        searchFor: search,
        filter: this.filter,
      });
    } else {
      this.stringOptions = [...this.selectedFilterOptions];
    }
  }
}

@NgModule({
  declarations: [
    MultiSelectFilterComponent,
    FormatValuePipe,
    MultiSelectValuePipe,
  ],
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    LoadingSpinnerModule,
    PushPipe,
    MatSliderModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MaterialNumberModule,
    TranslocoModule,
  ],
  exports: [MultiSelectFilterComponent],
})
export class MultiSelectFilterComponentModule {}
