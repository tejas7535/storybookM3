import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  addOption,
  autocomplete,
  removeOption,
  selectedFilterChange,
} from '../../core/store/actions';
import {
  AutocompleteSearch,
  FilterItem,
  IdValue,
} from '../../core/store/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import {
  getAutocompleteLoading,
  getFilterQueryInputs,
  getFilters,
  getMaterialNumberAndQuantity,
  getOptionalFilters,
  getSelectedFilter,
} from '../../core/store/selectors';
import { MultipleInputDialogComponent } from './multiple-input-dialog/multiple-input-dialog.component';

export interface Item {
  name: string;
}

@Component({
  selector: 'gq-input-section',
  templateUrl: './input-section.component.html',
  styleUrls: ['./input-section.component.scss'],
})
export class InputSectionComponent implements OnInit {
  @ViewChild('autocomplete') autocompleteInput: ElementRef;

  filterQueryInputs$: Observable<string[]>;
  autocompleteLoading$: Observable<string>;
  filters$: Observable<FilterItem[]>;
  selectedFilter$: Observable<FilterItem>;
  optionalFilters$: Observable<FilterItem[]>;
  materialNumberAndQuantities$: Observable<FilterItem[]>;

  multiQuery: any;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private readonly store: Store<SearchState>,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
    this.filterQueryInputs$ = this.store.pipe(select(getFilterQueryInputs));
    this.selectedFilter$ = this.store.pipe(select(getSelectedFilter));
    this.optionalFilters$ = this.store.pipe(select(getOptionalFilters));
    this.materialNumberAndQuantities$ = this.store.pipe(
      select(getMaterialNumberAndQuantity)
    );
  }

  autocomplete(autocompleteSearch: AutocompleteSearch): void {
    this.store.dispatch(autocomplete({ autocompleteSearch }));
  }

  selectedFilterChange(evt: MatSelectChange): void {
    this.store.dispatch(selectedFilterChange({ filterName: evt.value }));
  }

  removeOption(option: IdValue, filterName: string): void {
    this.store.dispatch(removeOption({ option, filterName }));
  }

  addOption(option: IdValue, filterName: string): void {
    this.store.dispatch(addOption({ option, filterName }));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MultipleInputDialogComponent, {
      width: '80%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.multiQuery = result;
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
