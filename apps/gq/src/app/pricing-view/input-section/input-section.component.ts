import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { autocomplete, updateFilter } from '../../core/store/actions';
import { FilterItem, TextSearch } from '../../core/store/models';
import { SearchState } from '../../core/store/reducers/search/search.reducer';
import { getAutocompleteLoading, getFilters } from '../../core/store/selectors';
import { MultiInputComponent } from './multi-input/multi-input.component';

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

  autocompleteLoading$: Observable<boolean>;
  filters$: Observable<FilterItem[]>;
  filter: FilterItem;
  selectedFilter = 'customerNumber';
  multiQuery: any;

  customers: Item[] = [];
  regions: Item[] = [];
  subRegions: Item[] = [];
  sectorManagements: Item[] = [];
  mainSectors: Item[] = [];
  subSectors: Item[] = [];
  sectorGPSDs: Item[] = [];
  soldToPartys: Item[] = [];
  materialNumbers: Item[] = [];
  quantitys: Item[] = [];

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;

  constructor(
    private readonly store: Store<SearchState>,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select(getFilters));
    this.autocompleteLoading$ = this.store.pipe(select(getAutocompleteLoading));
    this.getFilter();
  }

  public getFilter(): void {
    this.filters$.subscribe((value: FilterItem[]) => {
      this.filter = value.find(
        (value1: FilterItem) => value1.filter === this.selectedFilter
      );
      if (!this.filter) {
        this.filter = new FilterItem(this.selectedFilter, []);
      }
    });
  }

  /**
   * Get possible values for user input.
   */
  public autocomplete(textSearch: TextSearch): void {
    this.store.dispatch(autocomplete({ textSearch }));
  }

  public updateFilter(filter: FilterItem): void {
    this.store.dispatch(updateFilter({ item: filter }));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MultiInputComponent, {
      width: '80%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.multiQuery = result;
    });
  }

  public add(event: MatChipInputEvent, items: Item[]): void {
    const input = event.input;
    const value = event.value;

    // Add our item
    if (value && value.trim()) {
      items.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public remove(item: Item, items: Item[]): void {
    const index = items.indexOf(item);

    if (index >= 0) {
      items.splice(index, 1);
    }
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
