import {
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
import { UntypedFormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, filter, tap } from 'rxjs/operators';

import { Filter, IdValue, SelectedFilter } from '../models';
import { InputType } from './models';
import {
  createAutocompleteInputValidator,
  createSelectInputValidator,
} from './validation/autocomplete-validator-functions';
import { InputErrorStateMatcher } from './validation/input-error-state-matcher';

@Component({
  selector: 'ia-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteInputComponent implements OnInit, OnDestroy {
  latestSelection: IdValue;
  errorStateMatcher: InputErrorStateMatcher;

  private _type: InputType;

  @Input() set type(type: InputType) {
    this._type = type;
    if (type.type === 'autocomplete') {
      this.inputControl.setValidators(
        createAutocompleteInputValidator(type.label)
      );
    } else {
      this.inputControl.setValidators(createSelectInputValidator(type.label));
    }
  }

  get type() {
    return this._type;
  }

  @Input() autoCompleteLoading = false;
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
    if (value) {
      // if string provided map it to ID/Value pair
      const idValue = typeof value === 'string' ? { id: value, value } : value;

      this.inputControl.setValue(idValue, { emitEvent: false });
      this.latestSelection = idValue;
    } else {
      this.inputControl.reset();
    }
  }

  @Input() appearance: MatFormFieldAppearance = 'fill';

  @Input() minCharLength = 0;

  @Output()
  selected: EventEmitter<SelectedFilter> = new EventEmitter();

  @Output()
  invalidFormControl: EventEmitter<boolean> = new EventEmitter();

  @Output()
  readonly autoComplete: EventEmitter<string> = new EventEmitter();

  private readonly subscription: Subscription = new Subscription();
  private readonly DEBOUNCE_TIME_DEFAULT = 500;

  inputControl = new UntypedFormControl();
  isTyping = false;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('matInput') matInput: ElementRef;

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
            this.inputControl.value.length >= this.minCharLength
              ? timer(this.DEBOUNCE_TIME_DEFAULT)
              : EMPTY
          )
        )
        .subscribe((searchFor: string) => {
          this.autoComplete.emit(searchFor.trim());
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

  focus(): void {
    this.matInput.nativeElement.click();
    this.autocompleteTrigger.openPanel();
  }

  clearInput(): void {
    this.latestSelection = this.inputControl.value;
    this.inputControl.setValue('');
  }

  setLatestSelection(): void {
    if (this.inputControl.invalid) {
      this.inputControl.setValue(this.latestSelection, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  displayFn(idValue: IdValue): string {
    return idValue?.value;
  }
}
