import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  inject,
  input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  SimpleChange,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatFormField } from '@angular/material/form-field';

import {
  debounce,
  EMPTY,
  filter,
  Subject,
  Subscription,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { AutocompleteSearch } from '@gq/shared/models/search/autocomplete-search.model';
import { IdValue } from '@gq/shared/models/search/id-value.model';

import { FilterNames } from './filter-names.enum';

@Directive()
export abstract class BaseAutocompleteInputComponent
  implements AfterViewInit, OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
  private readonly AUTOCOMPLETE_PANEL_MAX_WIDTH = '100%';
  private readonly DEBOUNCE_TIME_DEFAULT = 500;

  private readonly ngZone: NgZone = inject(NgZone);
  private readonly subscription: Subscription = new Subscription();

  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: IdValue) => void;
  private onTouched: () => void;

  public static readonly ONE_CHAR_LENGTH = 1;

  readonly isLoading = input<boolean>(false);
  readonly showFieldHint = input<boolean>(true);
  readonly fitContent = input<boolean>(false);
  readonly maxLength = input<number>();

  readonly options = input.required<IdValue[]>();
  readonly defaultValueWhenEmptyInput = input<string>();
  readonly isDisabled = input<boolean>(true);
  readonly isAutocompleteSearchDisabled = input<boolean>(false);

  readonly inputContent = output<boolean>();
  readonly isValid = output<boolean>();
  readonly autocomplete = output<AutocompleteSearch>();
  readonly added = output<IdValue>();
  readonly unselected = output();
  readonly cleared = output();

  autocompleteOptions: IdValue[] = [];
  selectedIdValue: IdValue;

  formControl: FormControl = new FormControl();
  showDefaultValueWhenEmptyInputHint = false;
  debounceIsActive = false;
  inputFocused: boolean;

  filterName: FilterNames;

  @ViewChild('formField') formFieldReference: MatFormField;
  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocomplete) autocompleteReference: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;

  constructor(@Inject(FilterNames) filterName: FilterNames) {
    this.filterName = filterName;
  }

  @HostListener('window:resize')
  handleWindowResize() {
    if (this.fitContent() && this.autocompleteReference.isOpen) {
      this.setAutocompletePanelWidthLimits();
    }
  }

  ngOnInit(): void {
    this.initFormControl();
  }

  ngAfterViewInit(): void {
    this.setupPanelWidthLimits();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges({
    options,
    isDisabled,
  }: {
    options?: SimpleChange;
    isDisabled?: SimpleChange;
  }) {
    if (options !== undefined) {
      this.onOptionsChange(options.previousValue, options.currentValue);
    }
    if (isDisabled !== undefined) {
      if (isDisabled.currentValue) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }

  unselect(): void {
    this.unselected.emit();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.added.emit(event.option.value);
  }

  clearInput(): void {
    this.valueInput.nativeElement.value = '';
    this.formControl.setValue('');
    this.cleared.emit();
  }

  focus(): void {
    this.valueInput.nativeElement.focus();
  }

  resetInputField(): void {
    this.formControl.setValue('');
  }

  onBlur(_event: FocusEvent): void {
    this.inputFocused = false;
    if (
      this.defaultValueWhenEmptyInput() &&
      !this.formControl.value &&
      this.isAutocompleteSearchDisabled()
    ) {
      this.formControl.setValue(this.defaultValueWhenEmptyInput());
      this.showDefaultValueWhenEmptyInputHint = false;
      this.autocompleteOptions.shift();
      this.autocompleteTrigger.closePanel();
      this.selectCorrectOption();
    }
  }

  onFocus(_event: FocusEvent): void {
    this.inputFocused = true;
  }

  // optional paste listener
  onPaste(_event: ClipboardEvent): void {}

  // Control Value Accessor Implementations
  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(value: IdValue): void {
    this.selectedIdValue = value;
    this.formControl.setValue(value ? this.transformFormValue(value) : value, {
      emitEvent: false,
    });
    // Call the callbacks when component has been defined as FormControl in parent component
    this.triggerControlValueChange();
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
    // prettier-ignore
    if (isDisabled) { // NOSONAR
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  protected onOptionsChange(
    _previousOptions: IdValue[],
    options: IdValue[]
  ): void {
    this.selectedIdValue = options.find((it: IdValue) => it.selected);
    this.autocompleteOptions = options.filter((it: IdValue) => it.id !== null);

    if (this.selectedIdValue) {
      this.debounceIsActive = true;
      this.setFormControlValue();
    }
  }

  protected transformFormValue(idValue: IdValue): string {
    return idValue?.id;
  }

  protected isInputValid(control: AbstractControl): ValidationErrors {
    const formValue = this.extractFormValue(control.value);
    const isValid = this.validateFormValue(formValue);

    if (!isValid) {
      this.unselect();

      return { invalidInput: true };
    }

    return undefined;
  }

  protected shouldEmitAutocomplete(value: string): boolean {
    return (
      Boolean(value && typeof value === 'string') &&
      !this.isAutocompleteSearchDisabled()
    );
  }

  protected extractFormValue(value: any): string {
    return value && typeof value === 'string' && value.includes('|')
      ? value.split(' | ')[0]
      : value;
  }

  protected validateFormValue(formValue: string): boolean {
    return (
      !formValue ||
      (formValue &&
        formValue.length > 0 &&
        this.selectedIdValue &&
        this.selectedIdValue.id === formValue)
    );
  }

  private initFormControl(): void {
    this.subscription.add(
      this.formControl.valueChanges
        .pipe(
          tap((value) => {
            this.debounceIsActive = true;
            if (value) {
              this.showDefaultValueWhenEmptyInputHint = false;
            } else {
              this.inputContent.emit(false);

              if (
                this.inputFocused &&
                this.defaultValueWhenEmptyInput() &&
                this.isAutocompleteSearchDisabled()
              ) {
                this.autocompleteOptions = [
                  {} as any,
                  ...this.autocompleteOptions,
                ];
                this.showDefaultValueWhenEmptyInputHint = true;
                this.selectCorrectOption();
              }
            }
          }),
          filter((value) => this.shouldEmitAutocomplete(value)),
          debounce((value) =>
            value.length > BaseAutocompleteInputComponent.ONE_CHAR_LENGTH
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
          this.isValid.emit(!this.formControl.hasError('invalidInput'));
        })
    );

    this.formControl.setValidators([this.isInputValid.bind(this)]);
  }

  protected setFormControlValue(): void {
    const formValue = this.transformFormValue(this.selectedIdValue);
    this.formControl.setValue(formValue, { emitEvent: false });
    this.isValid.emit(!this.formControl.hasError('invalidInput'));
    this.inputContent.emit(true);

    // Call the callbacks when component has been defined as FormControl in parent component
    this.triggerControlValueChange();

    this.selectCorrectOption();
  }

  private selectCorrectOption() {
    this.autocompleteReference?.options.forEach((opt) => {
      if (
        opt.value?.id === this.selectedIdValue?.id &&
        opt.value?.value === this.selectedIdValue?.value &&
        opt.value?.value2 === this.selectedIdValue?.value2
      ) {
        opt.select(false);
      } else {
        opt.deselect(false);
      }
    });
  }

  private triggerControlValueChange(): void {
    if (this.onChange) {
      this.onChange(this.selectedIdValue);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private setupPanelWidthLimits(): void {
    const unsubscribe$ = new Subject<void>();
    this.ngZone.onStable
      .pipe(
        takeUntil(unsubscribe$),
        filter(() => !!this.autocompleteReference)
      )
      .subscribe(() => {
        if (this.fitContent()) {
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
