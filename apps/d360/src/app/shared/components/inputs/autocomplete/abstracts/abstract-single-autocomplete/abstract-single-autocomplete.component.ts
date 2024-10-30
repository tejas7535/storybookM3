import {
  Component,
  DestroyRef,
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

import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

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
    input.required<FormControl<SelectableValue | string>>();

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
   * @type {WritableSignal<string>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected readonly inputValue: WritableSignal<string> = signal<string>('');

  /**
   * The DestroyRef instance used for takeUntilDestroyed().
   *
   * @protected
   * @type {DestroyRef}
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.control()
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
   * After an option was selected, emit the new value.
   *
   * @protected
   * @memberof AbstractSingleAutocompleteComponent
   */
  protected onOptionSelected(): void {
    if (SelectableValueUtils.isSelectableValue(this.control().value)) {
      this.onSelectionChange.emit({
        option: this.control().value as SelectableValue,
      });
    }
  }
}
