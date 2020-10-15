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

import { AutocompleteSearch, IdValue } from '../../../core/store/models';

@Component({
  selector: 'gq-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
})
export class AutocompleteInputComponent implements OnDestroy, OnInit {
  @Input() autocompleteLoading = false;

  @Input() set options(itemOptions: IdValue[]) {
    this.selectedIdValue = itemOptions.find((it) => it.selected);
    this.unselectedOptions = itemOptions.filter((it) => !it.selected);
    if (this.selectedIdValue && this.autofilled) {
      this.valueInput.nativeElement.value = this.selectedIdValue.value;
      this.searchFormControl.setValue(this.selectedIdValue.value);
      this.autofilled = false;
    }
  }

  @Input() filterName: string;

  @Output() private readonly autocomplete: EventEmitter<
    AutocompleteSearch
  > = new EventEmitter();

  @Output() readonly unselected: EventEmitter<any> = new EventEmitter();

  @Output() readonly added: EventEmitter<IdValue> = new EventEmitter();

  @Output() readonly isValid: EventEmitter<boolean> = new EventEmitter();

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
          filter(
            () =>
              this.filterName &&
              this.searchFormControl.value &&
              typeof this.searchFormControl.value === 'string'
          ),
          debounce(() =>
            this.searchFormControl.value.length > this.ONE_CHAR_LENGTH
              ? timer(this.DEBOUNCE_TIME_DEFAULT)
              : EMPTY
          )
        )
        .subscribe((searchFor) => {
          this.debounceIsActive = false;
          this.autocomplete.emit({ searchFor, filter: this.filterName });
          this.isValid.emit(
            !this.searchFormControl.hasError('invalidQuotation')
          );
        })
    );
    this.searchFormControl.setValidators([this.isInputValid.bind(this)]);
  }

  isInputValid(control: AbstractControl): ValidationErrors {
    const formValue = control.value;

    const isValid =
      !formValue ||
      formValue.length === 0 ||
      (this.selectedIdValue && this.selectedIdValue.value === formValue) ||
      (this.unselectedOptions &&
        this.unselectedOptions.find((opt) => opt.value === formValue)) !==
        undefined;

    if (!isValid) {
      this.unselect();

      return { invalidQuotation: true };
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
    // emit new avlue
    this.added.emit(event.option.value);
    this.autofilled = true;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
