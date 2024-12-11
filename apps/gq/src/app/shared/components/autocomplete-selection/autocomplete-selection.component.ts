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

  defaultSelection: Signal<SelectableValue> = computed(() =>
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
        if (!this.selectedValue() && defaultSelection) {
          this.selectedValue.set(defaultSelection);
          this.formControl.setValue(defaultSelection);
          this.onChange(defaultSelection);
        }
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
              const searchValue = (value as string).toLowerCase();

              return (
                option.id.toLowerCase().includes(searchValue) ||
                option.value.toLowerCase().includes(searchValue) ||
                (option.value2 &&
                  option.value2.toLowerCase().includes(searchValue))
              );
            }

            return option;
          })
        );

        const error =
          this.filteredOptions().length === 0 ? { notFound: true } : null;
        this.formControl.setErrors(error);
      });
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes a new value to the formControl
   */
  writeValue(value: SelectableValue): void {
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
}
