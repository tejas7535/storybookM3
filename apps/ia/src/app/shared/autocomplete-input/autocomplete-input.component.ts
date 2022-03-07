import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';

import { Filter, IdValue, SelectedFilter } from '../models';
import { InputErrorStateMatcher } from './validation/input-error-state-matcher';

@Component({
  selector: 'ia-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteInputComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private _filter: Filter;
  private _disabled: boolean;
  @Input() label: string;
  @Input() hint: string;
  @Input() set disabled(disable: boolean) {
    this._disabled = disable;
    if (disable) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }
  @Input() set filter(filter: Filter) {
    this._filter = filter;
    if (
      this._filter === undefined ||
      this._filter.options.length === 0 ||
      this._disabled
    ) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
    this.errorStateMatcher = new InputErrorStateMatcher(this.filter?.options);
  }
  get filter(): Filter {
    return this._filter;
  }

  @Input() set value(value: string) {
    if (!value) {
      this.inputControl.reset();
      this.lastEmittedValue = '';
    } else {
      this.inputControl.setValue(value);
    }
  }

  @Input() appearance: MatFormFieldAppearance = 'fill';

  @Output()
  readonly selected: EventEmitter<SelectedFilter> = new EventEmitter();

  @Output()
  readonly invalidFormControl: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('matInput') private readonly matInput: ElementRef;

  readonly subscription: Subscription = new Subscription();
  inputControl = new FormControl();
  filteredOptions: Observable<IdValue[]>;
  errorStateMatcher: ErrorStateMatcher;

  private lastEmittedValue = '';

  ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      fromEvent(this.matInput.nativeElement, 'blur')
        .pipe(debounceTime(200))
        .subscribe((event: any) => {
          const value = event.target.value;
          const option = this.filter.options.find((opt) => opt.id === value);

          if (!option) {
            this.inputControl.setErrors({
              invalidInput: translate('filters.invalidInputHint'),
            });
          } else {
            if (this.lastEmittedValue !== value) {
              this.lastEmittedValue = value;
              this.selected.emit({
                name: this.filter.name,
                value: option.id,
              });
            }
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private filterOptions(value: string): IdValue[] {
    const filterValue = value?.toLowerCase() ?? '';

    return this.filter?.options.filter((option: IdValue) =>
      option.value.toLowerCase().includes(filterValue)
    );
  }

  validateInput(event: any): void {
    const value = event.target.value;
    const option = this.filter.options.find((opt) => opt.id === value);

    this.invalidFormControl.emit(option === undefined);
  }

  optionSelected(_evt: any): void {
    this.matInput.nativeElement.blur();
  }

  trackByFn(index: number): number {
    return index;
  }
}
