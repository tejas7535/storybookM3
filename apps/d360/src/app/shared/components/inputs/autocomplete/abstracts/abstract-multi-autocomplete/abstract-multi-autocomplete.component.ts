import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs';

import {
  DisplayFunction,
  DisplayFunctions,
} from '../../../display-functions.utils';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../selectable-values.utils';
import { OptionsLoadingResult } from './../../../../../services/selectable-options.service';

@Component({
  standalone: true,
  imports: [],
  template: '',
})
export abstract class AbstractMultiAutocompleteComponent implements OnInit {
  /**
   * Indicates if the autocomplete is the single or multiselect variant.
   *
   * @protected
   * @abstract
   * @type {boolean}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected abstract isPreloaded: boolean;

  /**
   * The FormGroup the autocomplete belongs to.
   *
   * @type {InputSignal<FormGroup>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public form: InputSignal<FormGroup> = input.required<FormGroup>();

  /**
   * The FormControl for the autocomplete instance.
   *
   * @type {InputSignal<FormControl>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public control: InputSignal<FormControl> = input.required<FormControl>();

  /**
   * The search field form control.
   *
   * @type {InputSignal<FormControl>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public searchControl: InputSignal<FormControl> =
    input.required<FormControl>();

  /**
   * Returns the formatted option / chip name.
   *
   * @type {InputSignal<DisplayFunction>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public getOptionName: InputSignal<DisplayFunction> = input(
    (option) => DisplayFunctions.displayFnText(option),
    { alias: 'getOptionLabelInTag' }
  );

  /**
   * Returns the formatted options
   *
   * @type {InputSignal<DisplayFunction>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public getOptionLabel: InputSignal<DisplayFunction> = input((option) =>
    DisplayFunctions.displayFnUnited(option)
  );

  /**
   * The label used in the autocomplete field.
   *
   * @type {(InputSignal<string | null | undefined>)}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public autocompleteLabel: InputSignal<string | null | undefined> = input<
    string | null | undefined
  >(null);

  /**
   * A CSS Class to style the panel.
   *
   * @type {(InputSignal<string | string[]>)}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public panelClass: InputSignal<string | string[]> = input<string | string[]>(
    ''
  );

  /**
   * Add a clear button to the component.
   *
   * @type {InputSignal<boolean>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public addClearButton: InputSignal<boolean> = input(false);

  /**
   * Add a dropdown icon to the component.
   *
   * @type {InputSignal<boolean>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public addDropdownIcon: InputSignal<boolean> = input(true);

  /**
   * The current input value (search string)
   *
   * @protected
   * @type {WritableSignal<string | null>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected readonly inputValue: WritableSignal<string | null> = signal<
    string | null
  >(null);

  /**
   * The available options
   *
   * @protected
   * @type {WritableSignal<SelectableValue[]>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected options: WritableSignal<SelectableValue[]> = signal<
    SelectableValue[]
  >([]);
  protected loading: WritableSignal<boolean | undefined> = signal<
    boolean | undefined
  >(false);
  protected loadingError: WritableSignal<string | null | undefined> = signal<
    string | null | undefined
  >(null);

  /**
   * The options loading result.
   *
   * @type {InputSignal<OptionsLoadingResult>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  public optionsLoadingResult: InputSignal<OptionsLoadingResult> =
    input<OptionsLoadingResult>();

  /**
   * The native element of the autocomplete
   *
   * @private
   * @type {ElementRef<HTMLInputElement>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  @ViewChild('multiAutocomplete', { static: false })
  private readonly input!: ElementRef<HTMLInputElement>;

  /**
   * The possible keyboard keys.
   *
   * @protected
   * @type {number[]}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @protected
   * @type {DestroyRef}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The abstract method to reset the options
   *
   * @protected
   * @abstract
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected abstract resetOptions(): void;

  /**
   * Indicator for the first run.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected first = true;

  /**
   * A custom error message, if needed.
   *
   * @protected
   * @type {InputSignal<string>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected errorMessage: InputSignal<string> = input('');

  /**
   * Creates an instance of AbstractMultiAutocompleteComponent.
   *
   * @memberof AbstractMultiAutocompleteComponent
   */
  public constructor() {
    effect(() => {
      // the first time we receive data, we need to clean up the initial values
      if (this.optionsLoadingResult()?.options?.length > 0 && this.first) {
        const value = this.control().getRawValue();

        this.control().setValue(
          SelectableValueUtils.mapToOptionsIfPossible(
            Array.isArray(value)
              ? value
              : // eslint-disable-next-line unicorn/no-nested-ternary
                typeof value === 'string' && value.length > 0
                ? [value]
                : [],
            this.optionsLoadingResult()?.options
          ),
          { emitEvent: false }
        );

        this.first = false;
      }
    });
  }

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    // convert to SelectableValue[]
    this.control().setValue(
      SelectableValueUtils.toSelectableValueOrNull(
        this.control().getRawValue(),
        true
      ) as SelectableValue[],
      { emitEvent: false }
    );

    // enable search field
    this.searchControl()
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => !SelectableValueUtils.isSelectableValue(value)),
        map((value) => value as string),
        tap((value) => {
          // set loading state
          if (!this.isPreloaded && value) {
            this.loading.set(true);
          }

          this.inputValue.set(value);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * On Clear Button Action, to delete the current values and to emit the data.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onClear(): void {
    this.inputValue.set(null);
    this.control().patchValue([]);
  }

  /**
   * The onOptionSelected Callback
   *
   * @protected
   * @param {MatAutocompleteSelectedEvent} event
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    if (this.control().value) {
      this.control().setValue([...this.control().value, event.option.value]);
    }

    this.input.nativeElement.value = null;
    this.searchControl().setValue(null);
    this.searchControl().reset();

    this.resetOptions();
  }

  /**
   * Remove a specific chip.
   *
   * @protected
   * @param {SelectableValue} option
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected remove(option: SelectableValue): void {
    const index = this.control().value.indexOf(option);

    if (index >= 0) {
      this.control().value.splice(index, 1);
      this.control().setValue([...this.control().value]);
    }

    this.resetOptions();
  }
}
