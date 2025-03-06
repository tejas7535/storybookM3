/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { debounce, filter, takeUntil, tap } from 'rxjs/operators';

import { MATERIAL_FILTERS } from '@gq/shared/constants';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Keyboard } from '../../models';
import { AutocompleteSearch, IdValue } from '../../models/search';
import { FilterNames } from './filter-names.enum';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

@Component({
  selector: 'gq-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    NoResultsFoundPipe,
    FormsModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'case-view',
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true,
    },
  ],
})
export class AutocompleteInputComponent
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
  @Input() autocompleteLoading = false;
  @Input() showFieldHint = true;
  @Input() filterName: string;
  @Input() maxLength: number;

  /**
   * If true, the autocomplete panel will dynamically increase its width,
   * in order to display the content completely until the max. allowed width of the panel is reached.
   */
  @Input() fitContent = false;
  private readonly ngZone: NgZone = inject(NgZone);
  private readonly ONE_CHAR_LENGTH = 1;
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  private readonly AUTOCOMPLETE_PANEL_MAX_WIDTH = '100%';
  readonly filterNames = FilterNames;

  @Output() readonly unselected: EventEmitter<any> = new EventEmitter();

  @Output() readonly added: EventEmitter<IdValue> = new EventEmitter();

  @Output() readonly isValid: EventEmitter<boolean> = new EventEmitter(true);

  @Output() readonly inputContent: EventEmitter<boolean> = new EventEmitter(
    true
  );
  @ViewChild('formField') formFieldReference: MatFormField;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;

  @ViewChild(MatAutocomplete) autocompleteReference: MatAutocomplete;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output()
  private readonly autocomplete: EventEmitter<AutocompleteSearch> =
    new EventEmitter();

  debounceIsActive = false;

  readonly subscription: Subscription = new Subscription();
  selectedIdValue: IdValue;
  unselectedOptions: IdValue[];

  searchFormControl: UntypedFormControl = new UntypedFormControl();
  MATERIAL_FILTERS: typeof MATERIAL_FILTERS;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() set isDisabled(isDisabled: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDisabled
      ? this.searchFormControl.disable()
      : this.searchFormControl.enable();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() set options(itemOptions: IdValue[]) {
    this.selectedIdValue = itemOptions.find((it) => it.selected);
    this.unselectedOptions = itemOptions.filter(
      (it) => !it.selected && it.id !== null
    );
    if (
      this.unselectedOptions.length === 1 &&
      itemOptions.length === 1 &&
      !MATERIAL_FILTERS.includes(this.filterName)
    ) {
      this.selectedIdValue = this.unselectedOptions[0];
      this.unselectedOptions = [];

      this.added.emit(this.selectedIdValue);
    }
    if (this.selectedIdValue) {
      this.debounceIsActive = true;
      this.setFormControlValue();
    }
    if (
      this.filterName === FilterNames.CUSTOMER_MATERIAL &&
      this.selectedIdValue &&
      this.selectedIdValue.id === null
    ) {
      this.unselectedOptions = [];
      this.searchFormControl.reset();
    }
  }
  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: IdValue) => void;
  private onTouched: () => void;

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
          tap(() => {
            // emit for parent component  errorHandling such as disabling buttons
            if (
              this.searchFormControl.value.length === this.ONE_CHAR_LENGTH &&
              MATERIAL_FILTERS.includes(this.filterName)
            ) {
              this.isValid.emit(
                !this.searchFormControl.hasError('invalidInput')
              );
            }
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
    const unsubscribe$ = new Subject<void>();
    this.ngZone.onStable
      .pipe(
        takeUntil(unsubscribe$),
        filter(() => !!this.autocompleteReference)
      )
      .subscribe(() => {
        if (this.fitContent) {
          this.autocompleteReference.panelWidth = 'auto';
          this.subscription.add(
            this.autocompleteReference.opened.subscribe(() =>
              this.setAutocompletePanelWidthLimits()
            )
          );
        }
        unsubscribe$.next();
        unsubscribe$.complete();
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setFormControlValue(): void {
    let id = this.selectedIdValue.value;
    let value = this.selectedIdValue.id;
    let value2 = this.selectedIdValue.value2;

    if (MATERIAL_FILTERS.includes(this.filterName)) {
      id = this.selectedIdValue.id;
      value = undefined;
      value2 = undefined;
    }

    const formValue = this.transformFormValue(id, value, value2);
    this.searchFormControl.setValue(formValue, { emitEvent: false });
    this.isValid.emit(!this.searchFormControl.hasError('invalidInput'));
    this.inputContent.emit(true);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.selectedIdValue);
    }
    if (this.onTouched) {
      this.onTouched();
    }
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
        .replaceAll(
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
      if (this.filterName !== FilterNames.CUSTOMER_MATERIAL) {
        return { invalidInput: true };
      }
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

  resetInputField(): void {
    this.searchFormControl.setValue('');
  }

  // Control Value Accessor Implementations

  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(value: IdValue): void {
    this.selectedIdValue = value;
    this.searchFormControl.setValue(
      value
        ? this.transformFormValue(value.value, value.id, value.value2)
        : value,
      { emitEvent: false }
    );
    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.selectedIdValue);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: IdValue) => void): void {
    this.onChange = callback;
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for the touched state of the formControl
   */
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }
  /**
   * Implementation of ControlValueAccessor
   *
   * @param isDisabled value to set the disabled state of the formControl
   */
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchFormControl.disable();
    } else {
      this.searchFormControl.enable();
    }
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

  private transformFormValue(
    id: string,
    value: string,
    value2?: string
  ): string {
    if (!id) {
      return id;
    }

    let string = `${id}`;

    if (value) {
      string += ` | ${value}`;
    }

    if (value2) {
      string += ` | ${value2}`;
    }

    return string;
  }
}
