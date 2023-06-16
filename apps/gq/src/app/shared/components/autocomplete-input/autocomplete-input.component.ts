/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatLegacyAutocomplete as MatAutocomplete,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent,
} from '@angular/material/legacy-autocomplete';
import { MatLegacyFormField as MatFormField } from '@angular/material/legacy-form-field';

import { EMPTY, Subscription, timer } from 'rxjs';
import { debounce, filter, tap } from 'rxjs/operators';

import { Keyboard } from '../../models';
import { AutocompleteSearch, IdValue } from '../../models/search';
import { FilterNames } from './filter-names.enum';

@Component({
  selector: 'gq-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
})
export class AutocompleteInputComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() autocompleteLoading = false;

  @Input() set isDisabled(isDisabled: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDisabled
      ? this.searchFormControl.disable()
      : this.searchFormControl.enable();
  }

  @Input() set options(itemOptions: IdValue[]) {
    this.selectedIdValue = itemOptions.find((it) => it.selected);
    this.unselectedOptions = itemOptions.filter((it) => !it.selected);
    if (
      this.unselectedOptions.length === 1 &&
      this.filterName === FilterNames.MATERIAL_NUMBER
    ) {
      this.unselectedOptions = [];
    }
    if (this.selectedIdValue) {
      this.debounceIsActive = true;
      this.setFormControlValue();
    }
  }

  @Input() filterName: string;

  /**
   * If true, the autocomplete panel will dynamically increase its width,
   * in order to display the content completely until the max. allowed width of the panel is reached.
   */
  @Input() fitContent = false;

  @Output()
  private readonly autocomplete: EventEmitter<AutocompleteSearch> = new EventEmitter();

  @Output() readonly unselected: EventEmitter<any> = new EventEmitter();

  @Output() readonly added: EventEmitter<IdValue> = new EventEmitter();

  @Output() readonly isValid: EventEmitter<boolean> = new EventEmitter(true);

  @Output() readonly inputContent: EventEmitter<boolean> = new EventEmitter(
    true
  );

  @ViewChild('formField') formFieldReference: MatFormField;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocomplete) autocompleteReference: MatAutocomplete;

  private readonly ONE_CHAR_LENGTH = 1;
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  private readonly AUTOCOMPLETE_PANEL_MAX_WIDTH = '420px';

  debounceIsActive = false;

  readonly subscription: Subscription = new Subscription();

  selectedIdValue: IdValue;
  unselectedOptions: IdValue[];
  searchFormControl: UntypedFormControl = new UntypedFormControl();

  @HostListener('window:resize')
  handleWindowResize() {
    if (this.fitContent && this.autocompleteReference.isOpen) {
      this.setAutocompletePanelWidthLimits();
    }
  }

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
        .subscribe((searchFor: string) => {
          this.debounceIsActive = false;
          this.inputContent.emit(true);

          this.autocomplete.emit({
            searchFor,
            filter: this.filterName,
          });
          this.isValid.emit(!this.searchFormControl.hasError('invalidInput'));
        })
    );
    this.searchFormControl.setValidators([this.isInputValid.bind(this)]);
  }

  ngAfterViewInit(): void {
    if (this.fitContent) {
      this.autocompleteReference.panelWidth = 'auto';
      this.subscription.add(
        this.autocompleteReference.opened.subscribe(() =>
          this.setAutocompletePanelWidthLimits()
        )
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setFormControlValue(): void {
    let id = this.selectedIdValue.value;
    let value = this.selectedIdValue.id;

    if (
      this.filterName === FilterNames.MATERIAL_NUMBER ||
      this.filterName === FilterNames.MATERIAL_DESCRIPTION
    ) {
      id = this.selectedIdValue.id;
      value = undefined;
    }
    const value2 = this.selectedIdValue.value2;
    const formValue = this.transformFormValue(id, value, value2);
    this.searchFormControl.setValue(formValue, { emitEvent: false });
    this.isValid.emit(!this.searchFormControl.hasError('invalidInput'));
    this.inputContent.emit(true);
  }

  private transformFormValue(
    id: string,
    value: string,
    value2?: string
  ): string {
    let string = `${id}`;

    if (value) {
      string += ` | ${value}`;
    }

    if (value2) {
      string += ` | ${value2}`;
    }

    return string;
  }

  sliceMaterialString(text: string): string {
    // 17 equals max string length with dashes
    return text.slice(0, 17);
  }

  onPaste(event: ClipboardEvent): void {
    if (this.filterName === FilterNames.MATERIAL_NUMBER) {
      event.preventDefault();
      const data = this.formatMaterialNumber(
        event.clipboardData.getData('text')
      );

      this.searchFormControl.setValue(this.sliceMaterialString(data));
    }
  }

  formatMaterialNumber(inputNumber: string): string {
    return (
      inputNumber
        // split string by separators to array
        .split(Keyboard.DASH)
        // join array to string again
        .join('')
        /**
         * Regex checks for two groups:
         * 1st: until 9th character
         * 2nd: the four characters after
         * when replacing:
         * check the string length to insert '-' separator only if string is long enough
         */
        .replace(
          /^(.{9})(.{0,4})/g,
          `$1-$2${inputNumber.length <= 13 ? '' : Keyboard.DASH}`
        )
    );
  }

  isInputValid(control: AbstractControl): ValidationErrors {
    const formValue: string =
      control.value &&
      typeof control.value === 'string' &&
      control.value.includes('|')
        ? control.value.split(' | ')[1]
        : control.value;
    const isValid =
      !formValue ||
      (formValue &&
        formValue.length > 0 &&
        this.selectedIdValue &&
        this.selectedIdValue.id === formValue);

    if (!isValid) {
      this.unselect();

      return { invalidInput: true };
    }

    return undefined;
  }

  unselect(): void {
    this.unselected.emit();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.added.emit(event.option.value);
  }

  clearInput(): void {
    this.unselect();
    this.valueInput.nativeElement.value = '';
    this.searchFormControl.setValue('');
  }

  focus(): void {
    this.valueInput.nativeElement.focus();
  }

  trackByFn(index: number): number {
    return index;
  }

  resetInputField(): void {
    this.searchFormControl.setValue('');
  }

  private setAutocompletePanelWidthLimits(): void {
    // The timeout is needed because the autocomplete panel might not be rendered when min. and max. width are set!
    setTimeout(() => {
      this.autocompleteReference.panel.nativeElement.style.minWidth = `${
        this.formFieldReference.getConnectedOverlayOrigin().nativeElement
          .clientWidth
      }px`;
      this.autocompleteReference.panel.nativeElement.style.maxWidth =
        this.AUTOCOMPLETE_PANEL_MAX_WIDTH;
    });
  }
}
