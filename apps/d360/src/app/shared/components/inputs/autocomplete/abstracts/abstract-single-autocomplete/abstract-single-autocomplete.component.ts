import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';

import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { isEqual } from '../../../../../../shared/utils/validation/data-validation';
import {
  DisplayFunction,
  DisplayFunctions,
} from '../../../display-functions.utils';
import { SingleAutocompleteSelectedEvent } from '../../model';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../selectable-values.utils';

/**
 * The SingleAutocompleteOnType Component.
 *
 * @export
 * @abstract
 * @class AbstractSingleAutocompleteComponent
 * @implements {OnInit}
 */
@Component({
  standalone: true,
  imports: [],
  template: '',
})
export abstract class AbstractSingleAutocompleteComponent implements OnInit {
  /**
   * Indicates if the autocomplete is the single or multiselect variant.
   *
   * @protected
   * @abstract
   * @type {boolean}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected abstract isPreloaded: boolean;

  /**
   * The filtered options to be render in the dropdown.
   *
   * @protected
   * @abstract
   * @type {Signal<SelectableValue[]>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected abstract filteredOptions: Signal<SelectableValue[]>;

  /**
   * The render function to display the selection in the input field.
   *
   * @abstract
   * @memberof AbstractSingleAutocompleteComponent
   */
  public abstract displayFn:
    | InputSignal<(option: SelectableValue | string) => string>
    | InputSignal<(option?: SelectableValue) => string>;

  /**
   * The label of the autocomplete.
   *
   * @type {InputSignal<string>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public label: InputSignal<string> = input.required<string>();

  /**
   * The FormGroup the autocomplete belongs to.
   *
   * @type {InputSignal<FormGroup>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public form: InputSignal<FormGroup> = input.required<FormGroup>();

  /**
   * The FormControl for the autocomplete instance.
   *
   * @type {(InputSignal<FormControl<SelectableValue | string>>)}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public control: InputSignal<FormControl<SelectableValue | string>> =
    input.required();

  /**
   * The render function to display the options in the dropdown.
   *
   * @memberof AbstractSingleAutocompleteComponent
   */
  public getOptionName: InputSignal<DisplayFunction> = input(
    (option) => DisplayFunctions.displayFnUnited(option),
    { alias: 'getOptionLabelInTag' }
  );

  /**
   * The OutputEmitter to emit selection changes.
   *
   * @type {OutputEmitterRef<SingleAutocompleteSelectedEvent>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public onSelectionChange: OutputEmitterRef<SingleAutocompleteSelectedEvent> =
    output<SingleAutocompleteSelectedEvent>({ alias: 'selectionChange' });

  /**
   * Add a clear button to the component.
   *
   * @type {InputSignal<boolean>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public addClearButton: InputSignal<boolean> = input(false);

  /**
   * Add a dropdown icon to the component.
   *
   * @type {InputSignal<boolean>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public addDropdownIcon: InputSignal<boolean> = input(true);

  /**
   * A CSS Class to style the panel.
   *
   * @type {(InputSignal<string | string[]>)}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public panelClass: InputSignal<string | string[]> = input<string | string[]>(
    ''
  );

  /**
   * A signal for the current loading state.
   *
   * @protected
   * @type {WritableSignal<boolean>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected loading: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * The mat-error message for loading errors.
   *
   * @protected
   * @type {(WritableSignal<string | null>)}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected loadingError: WritableSignal<string | null> = signal<string | null>(
    null
  );

  /**
   * The current input value (search string).
   *
   * @protected
   * @type {WritableSignal<string | null>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected readonly inputValue: WritableSignal<string | null> = signal<
    string | null
  >(null);

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @protected
   * @type {DestroyRef}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * Indicator for the first run.
   *
   * @protected
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected first = true;

  /**
   * A custom error message, if needed.
   *
   * @protected
   * @type {InputSignal<string>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected errorMessage: InputSignal<string> = input('');

  /**
   * This is the current selected value, not the string visible in the search field.
   * It's just needed for some internal checks.
   *
   * @protected
   * @type {SelectableValue}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected value: SelectableValue;

  /**
   * Creates an instance of AbstractSingleAutocompleteComponent.
   *
   * @memberof AbstractSingleAutocompleteComponent
   */
  public constructor() {
    effect(() => {
      // the first time we receive data, we need to clean up the initial values
      if (this.filteredOptions()?.length > 0 && this.first) {
        this.control().setValue(
          SelectableValueUtils.matchOptionIfPossible(
            this.control().getRawValue(),
            this.filteredOptions()
          ) || null,
          { emitEvent: false }
        );
        this.value = this.getTypedValue();

        this.first = false;
      }
    });
  }

  /**
   * Abstract method to handle the search control change.
   *
   * @protected
   * @abstract
   * @param {string} value
   * @param {boolean} [setFormControlValue]
   * @return {(Observable<unknown | void>)}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected abstract onSearchControlChange$(
    value: string,
    setFormControlValue?: boolean
  ): Observable<unknown | void>;

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    // convert to SelectableValue[]
    this.control().setValue(
      SelectableValueUtils.toSelectableValueOrNull(
        this.control().getRawValue(),
        false
      ) as SelectableValue,
      { emitEvent: false }
    );
    this.value = this.getTypedValue();

    this.control()
      .valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        filter((value) => !SelectableValueUtils.isSelectableValue(value)),
        map((value) => (value ? String(value) : null)),
        switchMap((value) => this.onSearchControlChange$(value, false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * A method to reset the filtered options.
   * Hint: Needs to be implemented, if needed.
   *
   * @protected
   * @abstract
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected abstract resetOptions(): void;

  /**
   * On blur we need to reset the search field, if there was no selection made.
   *
   * @protected
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected onSearchFieldBlur(): void {
    if (!isEqual(this.getTypedValue(), this.value) && !!this.value) {
      setTimeout(() => {
        this.control().setValue(this.value);
        this.resetOptions();
      }, 250);
    }
  }

  /**
   * Returns a typed value of type SelectableValue
   *
   * @protected
   * @return {SelectableValue}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected getTypedValue(): SelectableValue {
    return this.control().getRawValue() as SelectableValue;
  }

  /**
   * After an option was selected, emit the new value.
   *
   * @protected
   * @abstract
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected abstract onOptionSelected(): void;

  /**
   * Returns, if the current value is not empty.
   *
   * @protected
   * @return {boolean}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected notEmpty(): boolean {
    return SelectableValueUtils.isSelectableValue(this.control().value)
      ? (this.control()?.value as SelectableValue)?.id?.length > 0
      : (this.control()?.value as string)?.length > 1;
  }

  /**
   * On Clear Button Action, to delete the current values and to emit the data.
   *
   * @protected
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected onClear(): void {
    this.inputValue.set(null);
    this.control().patchValue(null);
    this.onSelectionChange.emit({ option: { id: null, text: null } });
    this.value = null;
  }
}
