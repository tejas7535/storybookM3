import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, filter, tap } from 'rxjs/operators';

import {
  AutocompleteSearch,
  FilterItem,
  IdValue,
} from '../../../core/store/models';

@Component({
  selector: 'gq-multi-select-input',
  templateUrl: './multi-select-input.component.html',
  styleUrls: ['./multi-select-input.component.scss'],
})
export class MultiSelectInputComponent implements OnDestroy, OnInit {
  ONE_CHAR_LENGTH = 1;
  DEBOUNCE_TIME_DEFAULT = 500;

  private _filter: FilterItem;
  readonly subscription: Subscription = new Subscription();
  debounceIsActive = false;
  searchForm = new FormControl();

  @Input() autocompleteLoading = false;

  @Input() set filter(filterItem: FilterItem) {
    this.selectedIdValues = filterItem.options.filter((it) => it.selected);
    this.unselectedOptions = filterItem.options.filter((it) => !it.selected);
    this._filter = filterItem;
    if (this.selectedIdValues.length >= 1 && !this.filter.multiSelect) {
      this.searchForm.disable({ emitEvent: false });
    } else {
      this.searchForm.enable({ emitEvent: false });
    }
  }

  get filter(): FilterItem {
    return this._filter;
  }

  @Output() private readonly autocomplete: EventEmitter<
    AutocompleteSearch
  > = new EventEmitter();

  @Output() readonly removed: EventEmitter<IdValue> = new EventEmitter();

  @Output() readonly added: EventEmitter<IdValue> = new EventEmitter();

  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedIdValues: IdValue[] = [];
  unselectedOptions: IdValue[] = [];

  ngOnInit(): void {
    this.subscription.add(
      this.searchForm.valueChanges
        .pipe(
          tap(() => (this.debounceIsActive = true)),
          filter(
            () =>
              this.filter &&
              this.filter.hasAutoComplete &&
              this.searchForm.value &&
              typeof this.searchForm.value === 'string'
          ),
          debounce(() =>
            this.searchForm.value.length > this.ONE_CHAR_LENGTH
              ? timer(this.DEBOUNCE_TIME_DEFAULT)
              : EMPTY
          )
        )
        .subscribe((searchFor) => {
          this.debounceIsActive = false;
          this.autocomplete.emit({ searchFor, filter: this.filter.filter });
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  add(event: MatChipInputEvent): void {
    if (this.filter.hasAutoComplete) {
      return;
    }

    const input = event.input;
    const value = event.value;

    // emit new value
    if (value) {
      this.added.emit({
        value,
        id: value,
        selected: true,
      });
    }

    // reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(idValue: IdValue): void {
    this.removed.emit(idValue);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    // emit new avlue
    this.added.emit(event.option.value);

    // reset input
    this.valueInput.nativeElement.value = '';
    this.searchForm.setValue(undefined);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
