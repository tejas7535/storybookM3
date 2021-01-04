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
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, filter, tap } from 'rxjs/operators';

import {
  AutocompleteSearch,
  IdValue,
  SapQuotation,
} from '../../core/store/models';

@Component({
  selector: 'gq-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
})
export class AutocompleteInputComponent implements OnDestroy, OnInit {
  @Input() autocompleteLoading = false;

  @Input() set isDisabled(isDisabled: boolean) {
    isDisabled
      ? this.searchFormControl.disable()
      : this.searchFormControl.enable();
  }

  @Input() set options(itemOptions: IdValue[] | SapQuotation[]) {
    this.selectedIdValue = itemOptions.find((it) => it.selected);
    this.unselectedOptions = itemOptions.filter((it) => !it.selected);
    if (this.selectedIdValue && this.autofilled) {
      const value =
        this.filterName === 'customer'
          ? `${this.selectedIdValue.value} | ${this.selectedIdValue.id}`
          : this.isSapQuotation(this.selectedIdValue)
          ? `${this.selectedIdValue.customerName} | ${this.selectedIdValue.id}`
          : this.selectedIdValue.id;
      this.valueInput.nativeElement.value = value;
      this.searchFormControl.setValue(value);
      this.autofilled = false;
    }
  }

  @Input() filterName: string;

  @Output()
  private readonly autocomplete: EventEmitter<AutocompleteSearch> = new EventEmitter();

  @Output() readonly unselected: EventEmitter<any> = new EventEmitter();

  @Output() readonly added: EventEmitter<IdValue> = new EventEmitter();

  @Output() readonly isValid: EventEmitter<boolean> = new EventEmitter();

  @Output() readonly inputContent: EventEmitter<boolean> = new EventEmitter(
    true
  );

  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;

  private readonly ONE_CHAR_LENGTH = 1;
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  debounceIsActive = false;

  readonly subscription: Subscription = new Subscription();

  selectedIdValue: IdValue;
  unselectedOptions: IdValue[];
  autofilled = false;
  searchFormControl: FormControl = new FormControl();

  ngOnInit(): void {
    this.subscription.add(
      this.searchFormControl.valueChanges
        .pipe(
          tap(() => (this.debounceIsActive = true)),
          filter((value) => {
            if (!value) {
              this.inputContent.emit(false);
            }

            return (
              this.filterName &&
              this.searchFormControl.value &&
              typeof this.searchFormControl.value === 'string'
            );
          }),
          debounce(() =>
            this.searchFormControl.value.length > this.ONE_CHAR_LENGTH
              ? timer(this.DEBOUNCE_TIME_DEFAULT)
              : EMPTY
          )
        )
        .subscribe((searchFor) => {
          this.debounceIsActive = false;
          this.inputContent.emit(true);

          this.autocomplete.emit({ searchFor, filter: this.filterName });
          this.isValid.emit(!this.searchFormControl.hasError('invalidInput'));
        })
    );
    this.searchFormControl.setValidators([this.isInputValid.bind(this)]);
  }

  isInputValid(control: AbstractControl): ValidationErrors {
    const formValue =
      (this.filterName === 'customer' || this.filterName === 'quotation') &&
      control.value &&
      typeof control.value === 'string'
        ? control.value.split(' | ')[1]
        : control.value;

    const isValid =
      !formValue ||
      (formValue &&
        formValue.length !== 0 &&
        this.selectedIdValue &&
        this.selectedIdValue.id === formValue);

    if (!isValid) {
      this.unselect();

      return { invalidInput: true };
    }

    return undefined;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  unselect(): void {
    this.unselected.emit();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.added.emit(event.option.value);
    this.autofilled = true;
  }

  public clearInput(): void {
    this.unselect();
    this.valueInput.nativeElement.value = '';
    this.searchFormControl.setValue('');
  }

  public trackByFn(index: number): number {
    return index;
  }

  public isSapQuotation(
    sapQuotation: IdValue | SapQuotation
  ): sapQuotation is SapQuotation {
    return (sapQuotation as SapQuotation).customerName !== undefined;
  }
}
