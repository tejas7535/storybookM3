import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  Optional,
  Self,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { DisplaySelectableValuePipe } from '@gq/shared/pipes/display-selectable-value/display-selectable-value.pipe';
import { displaySelectableValue } from '@gq/shared/utils/misc.utils';

import { SharedTranslocoModule } from '@schaeffler/transloco';

export type Appearance = 'fill' | 'outline';

@Component({
  selector: 'gq-autocomplete-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatError,
    MatInput,
    MatLabel,
    MatOption,
    MatIcon,
    MatSuffix,
    MatProgressSpinner,
    DisplaySelectableValuePipe,
    FormsModule,
    SharedTranslocoModule,
  ],
  templateUrl: './autocomplete-selection.component.html',
})
export class AutocompleteSelectionComponent
  implements ControlValueAccessor, OnInit
{
  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: SelectableValue) => void;
  private onTouched: () => void;
  private readonly debounceTime = 300;
  private readonly destroyRef = inject(DestroyRef);
  private readonly selectedValue: WritableSignal<SelectableValue | null> =
    signal(null);

  readonly label: InputSignal<string> = input.required<string>();
  readonly options: InputSignal<SelectableValue[]> =
    input.required<SelectableValue[]>();
  readonly appearance: InputSignal<Appearance> = input<Appearance>('outline');
  readonly isLoading: InputSignal<boolean> = input<boolean>(true);
  readonly isEditMode: InputSignal<boolean> = input<boolean>(false);

  readonly defaultSelection: Signal<SelectableValue> = computed(() =>
    this.options()?.find((option) => option.defaultSelection)
  );
  readonly defaultSelection$ = toObservable(this.defaultSelection);

  filteredOptions: WritableSignal<SelectableValue[]> = signal([]);
  isDisabled = false;
  formControl!: FormControl<string | SelectableValue>;

  // By using this trick with injecting NgControl with @Self() and @Optional()
  // we can use this component as a formControl in a parent component
  // Setting valueAccessor to this component is necessary to avoid Circular Dependency issue.
  // Whole explanation can be found here: https://stackoverflow.com/a/56061527 and https://www.youtube.com/watch?v=CD_t3m2WMM8
  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (!ngControl) {
      throw new Error(
        'Please provide ngControl for AutocompleteSelectionComponent'
      );
    }
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.formControl = this.ngControl.control as FormControl;

    this.defaultSelection$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((defaultSelection) => {
        if (
          !this.isEditMode() &&
          !this.getSelectedValue() &&
          defaultSelection
        ) {
          this.selectedValue.set(defaultSelection);
        }
        this.formControl.setValue(this.getSelectedValue());
        this.onChange(this.getSelectedValue());
      });

    this.formControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        startWith(''),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.filteredOptions.set(
          this.options()?.filter((option) => {
            if (typeof value === 'string') {
              const searchValue = value.toLowerCase();

              return this.includesOption(option, searchValue);
            }

            return option;
          })
        );

        // If only one option left during filtering - set it automatically
        if (this.filteredOptions().length === 1) {
          const option = this.filteredOptions()[0];
          this.formControl.setValue(option);
          this.selectedValue.set(option);
        }

        this.handleErrors(value);
      });
  }

  private includesOption(option: SelectableValue, searchValue: string) {
    return (
      option.id.toLowerCase().includes(searchValue) ||
      option.value.toLowerCase().includes(searchValue) ||
      (option.value2 && option.value2.toLowerCase().includes(searchValue))
    );
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes a new value to the formControl
   */
  writeValue(value: SelectableValue): void {
    if (!value?.id) {
      // eslint-disable-next-line no-param-reassign
      value = null;
    }
    this.selectedValue.set(value);
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: SelectableValue) => void): void {
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
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onOptionSelected(args: MatAutocompleteSelectedEvent) {
    this.onChange(args.option.value);
    this.onTouched();
  }

  displayFn(value: SelectableValue) {
    return displaySelectableValue(value);
  }

  getSelectedValue() {
    return this.selectedValue();
  }

  handleErrors(value: string | SelectableValue) {
    const error = this.valueNotFound(value) ? { notFound: true } : null;
    if (error) {
      // Force to mark as touched to display an error for example for wrong initial values
      this.formControl.markAsTouched();
    }
    this.formControl.setErrors(error);
  }

  private valueNotFound(value: string | SelectableValue) {
    if (typeof value !== 'string' && value !== null) {
      return !this.options().some(
        (option) =>
          option.id === value.id &&
          option.value === value.value &&
          option?.value2 === value?.value2
      );
    }

    return this.filteredOptions().length === 0;
  }

  onBlur() {
    let error = null;
    const value = this.formControl.value;
    if (
      (typeof value === 'string' && value !== '') ||
      this.valueNotFound(value)
    ) {
      error = { wrongSelection: true };
    }
    this.formControl.setErrors(error);
    this.onTouched();
  }
}
