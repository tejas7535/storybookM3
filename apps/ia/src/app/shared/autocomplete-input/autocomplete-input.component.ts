import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, filter, tap } from 'rxjs/operators';

import { Filter, IdValue, SelectedFilter } from '../models';
import { InputErrorStateMatcher } from './validation/input-error-state-matcher';

@Component({
  selector: 'ia-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteInputComponent implements OnInit, OnDestroy {
  @Input() autoCompleteLoading = false;
  @Input() label: string;
  @Input() hint: string;
  @Input() noResultMessage: string;
  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }
  @Input() filter: Filter;

  @Input() set value(value: string | IdValue) {
    if (!value) {
      this.inputControl.reset();
    } else {
      // if string provided map it to ID/Value pair
      const idValue = typeof value === 'string' ? { id: value, value } : value;

      this.inputControl.setValue(idValue, { emitEvent: false });
    }
  }

  @Input() appearance: MatFormFieldAppearance = 'fill';

  @Output()
  readonly selected: EventEmitter<SelectedFilter> = new EventEmitter();

  @Output()
  readonly invalidFormControl: EventEmitter<boolean> = new EventEmitter();

  @Output()
  private readonly autoComplete: EventEmitter<string> = new EventEmitter();

  private readonly subscription: Subscription = new Subscription();
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  readonly ONE_CHAR_LENGTH = 1;

  inputControl = new UntypedFormControl();
  isTyping = false;
  errorStateMatcher = new InputErrorStateMatcher();

  ngOnInit(): void {
    const optionSelected$ = this.inputControl.valueChanges.pipe(
      filter((val) => typeof val === 'object' && val !== null)
    );
    const searchOptions$ = this.inputControl.valueChanges.pipe(
      filter((val) => typeof val === 'string')
    );

    this.subscription.add(
      searchOptions$
        .pipe(
          tap(() => (this.isTyping = true)),
          debounce(() =>
            this.inputControl.value.length > this.ONE_CHAR_LENGTH
              ? timer(this.DEBOUNCE_TIME_DEFAULT)
              : EMPTY
          )
        )
        .subscribe((searchFor: string) => {
          this.autoComplete.emit(searchFor);
          this.isTyping = false;
          this.invalidFormControl.emit(
            this.inputControl.hasError('invalidInput')
          );
        })
    );

    this.subscription.add(
      optionSelected$.subscribe((idValue) => {
        this.selected.emit({
          name: this.filter.name,
          idValue,
        });
        this.invalidFormControl.emit(
          this.inputControl.hasError('invalidInput')
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByFn(index: number): number {
    return index;
  }

  displayFn(idValue: IdValue): string {
    return idValue?.value;
  }
}
