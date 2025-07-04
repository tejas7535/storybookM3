/* eslint-disable max-lines */
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
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  Observable,
  of,
  switchMap,
} from 'rxjs';

import { OptionsLoadingResult } from '../../../../../services/selectable-options.service';
import { keyHandler } from '../../../../../utils/general';
import {
  DisplayFunction,
  DisplayFunctions,
} from '../../../display-functions.utils';
import {
  SelectableValue,
  SelectableValueUtils,
} from '../../selectable-values.utils';

@Component({
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
   * The key handler for the mat icon.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected keyHandler = keyHandler;

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
   * Indicator, if the autocomplete dropdown is open.
   * Hint: Needed to show only 2 chips for non focused fields.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected isAutocompleteOpen = false;

  /**
   * Indicator, if the autocomplete input is focused.
   * Hint: Needed to show only 2 chips for non focused fields.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected isInputFocused = false;

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
   * Abstract method to handle the search control change.
   *
   * @protected
   * @abstract
   * @param {string} value
   * @return {(Observable<unknown | void>)}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected abstract onSearchControlChange$(
    value: string
  ): Observable<unknown | void>;

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
   * The trigger element of the autocomplete
   *
   * @private
   * @type {ElementRef<HTMLInputElement>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  @ViewChild(MatAutocompleteTrigger)
  private readonly trigger: MatAutocompleteTrigger;

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
   * A BehaviorSubject that holds the temporary search string value
   *
   * @private
   * @memberof AbstractMultiAutocompleteComponent
   */
  private readonly tempSearchString$ = new BehaviorSubject(null);

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

        // reset the initial options based on current selected values
        this.resetOptions();

        this.first = false;
      }
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    // Convert the raw value from the form control to SelectableValue[] and set it back to the form control
    this.control().setValue(
      SelectableValueUtils.toSelectableValueOrNull(
        this.control().getRawValue(),
        true
      ) as SelectableValue[],
      { emitEvent: false }
    );

    // reset the initial options based on current selected values
    this.resetOptions();

    // Subscribe to value changes of the search control and handle them accordingly
    this.searchControl()
      .valueChanges.pipe(
        switchMap((value) =>
          // If the value is a SelectableValue, ignore it; otherwise, handle as a search value change
          SelectableValueUtils.isSelectableValue(value)
            ? EMPTY
            : this.handleSearchValueChange(value ? String(value) : null)
        ),

        // Handle the search control changes
        switchMap(this.onSearchControlChange$.bind(this)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Handles the change in the search value and returns an Observable<string> that emits the updated search string
   *
   * @private
   * @param {string} next - The new search string value
   * @return {Observable<string>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  private handleSearchValueChange(next: string | null): Observable<string> {
    if (this.isPreloaded) {
      // If the data is already preloaded, return the new search string as an observable
      return of(next);
    } else {
      // If the new search string has more than one character, set loading state to true
      if ((next || '').length > 1) {
        this.loading.set(true);
      }

      // Update the temporary search string subject with the new value
      this.tempSearchString$.next(next);

      // Return an observable that emits the debounced and distinct search strings
      return this.debounce$();
    }
  }

  /**
   * Returns an Observable that emits the debounced and distinct search string from the temporary search string subject
   *
   * @private
   * @return {Observable<string>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  private debounce$(): Observable<string> {
    return this.tempSearchString$.pipe(
      debounceTime(250),
      distinctUntilChanged()
    );
  }

  /**
   * On Clear Button Action, to delete the current values and to emit the data.
   *
   * @memberof AbstractMultiAutocompleteComponent
   */
  public onClear(): void {
    this.control().patchValue([]);
    this.isInputFocused = false;

    this.trigger.closePanel();
    this.resetOptions();

    if (this.input?.nativeElement) {
      this.input.nativeElement.value = null;
    }
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
      this.isInputFocused = true;
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

  /**
   * On focus callback for the dropdown search field.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onFocus(): void {
    this.isInputFocused = true;
  }

  /**
   * On blur callback for the dropdown search field.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onBlur(): void {
    // we need a short timeout here to avoid a race condition.
    setTimeout(() => (this.isInputFocused = false), 100);
  }

  /**
   * On input click callback for the dropdown search field.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onInputClick(): void {
    if (!this.isAutocompleteOpen) {
      this.onAutocompleteOpened();
    }
  }

  /**
   * Callback triggered after the dropdown was opened.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onAutocompleteOpened(): void {
    this.isAutocompleteOpen = true;
  }

  /**
   * Callback triggered after the dropdown was closed.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected onAutocompleteClosed(): void {
    this.isAutocompleteOpen = false;
  }

  /**
   * Toggles the dropdown panel open or closed.
   *
   * @protected
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected togglePanel(): void {
    if (this.control().enabled) {
      this.trigger.openPanel();
    } else {
      this.trigger.closePanel();
    }
  }
}
