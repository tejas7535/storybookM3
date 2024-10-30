import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  DestroyRef,
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
  >('');

  /**
   * The current input value (search string)
   *
   * @protected
   * @type {WritableSignal<string>}
   * @memberof AbstractMultiAutocompleteComponent
   */
  protected readonly inputValue: WritableSignal<string> = signal<string>('');

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
   * @inheritdoc
   */
  public ngOnInit(): void {
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

    this.input.nativeElement.value = '';
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
