import { Component, input, InputSignal, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  SelectableValue,
  SelectableValueUtils,
} from '../autocomplete/selectable-values.utils';
import { DisplayFunctions } from './../display-functions.utils';

/**
 * The FilterDropdown Component.
 *
 * @export
 * @class FilterDropdownComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'd360-filter-dropdown',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedTranslocoModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
})
export class FilterDropdownComponent implements OnInit {
  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    const value: SelectableValue | SelectableValue[] =
      SelectableValueUtils.toSelectableValueOrNull(
        this.control().getRawValue(),
        this.multiSelect()
      );

    this.control().setValue(value, { emitEvent: false });

    // run the onSelectionChange event to set the values during initialization
    this.onSelectionChange({ value } as any);
  }

  /**
   * The form control.
   *
   * @type {(InputSignal<
   *     FormControl<SelectableValue | SelectableValue[]>
   *   >)}
   * @memberof FilterDropdownComponent
   */
  public control: InputSignal<
    FormControl<SelectableValue | SelectableValue[]>
  > = input.required();

  /**
   * The form group.
   *
   * @type {InputSignal<FormGroup>}
   * @memberof FilterDropdownComponent
   */
  public form: InputSignal<FormGroup> = input.required();

  /**
   * The required form label
   *
   * @type {InputSignal<string>}
   * @memberof FilterDropdownComponent
   */
  public label: InputSignal<string> = input.required();

  /**
   * A hint test to get rendered below the filter dropdown.
   *
   * @type {InputSignal<string>}
   * @memberof FilterDropdownComponent
   */
  public hintText?: InputSignal<string> = input();

  /**
   * A CSS Class to style the panel.
   *
   * @type {(InputSignal<string | string[]>)}
   * @memberof FilterDropdownComponent
   */
  public panelClass: InputSignal<string | string[]> = input<string | string[]>(
    ''
  );

  /**
   * The available options.
   *
   * @type {InputSignal<SelectableValue[]>}
   * @memberof FilterDropdownComponent
   */
  public options: InputSignal<SelectableValue[]> = input([]);

  /**
   * The current loading state
   *
   * @type {(InputSignal<boolean | undefined | null>)}
   * @memberof FilterDropdownComponent
   */
  public loading: InputSignal<boolean | undefined | null> = input(false);

  /**
   * If available a loading error message.
   *
   * @type {(InputSignal<string | undefined | null>)}
   * @memberof FilterDropdownComponent
   */
  public loadingError?: InputSignal<string | undefined | null> = input();

  /**
   * Is the dropdown a single or multiselect?
   *
   * @type {InputSignal<boolean>}
   * @memberof FilterDropdownComponent
   */
  public multiSelect: InputSignal<boolean> = input(false);

  /**
   * Add a clear button to the component.
   *
   * @type {InputSignal<boolean>}
   * @memberof AbstractSingleAutocompleteComponent
   */
  public addClearButton: InputSignal<boolean> = input(false);

  /**
   * If you don't want to use valueChanges, bind to this output emitter
   *
   * @memberof FilterDropdownComponent
   */
  public onSelectionChangeEmitter = output<
    Partial<SelectableValue> | Partial<SelectableValue>[] | string
  >({ alias: 'selectionChange' });

  /**
   * A callback to format the selected values
   *
   * @memberof FilterDropdownComponent
   */
  public formatSelectedValue: InputSignal<(value: SelectableValue) => string> =
    input((value) =>
      value.id === value.text
        ? DisplayFunctions.displayFnId(value)
        : DisplayFunctions.displayFnUnited(value)
    );

  /**
   * A callback to format the options
   *
   * @memberof FilterDropdownComponent
   */
  public formatOptionValue: InputSignal<(value: SelectableValue) => string> =
    input((value) =>
      value.id === value.text
        ? DisplayFunctions.displayFnId(value)
        : DisplayFunctions.displayFnUnited(value)
    );

  /**
   * Set the value after the selection was changed.
   *
   * @protected
   * @param {MatSelectChange} event
   * @return {void}
   * @memberof FilterDropdownComponent
   */
  protected onSelectionChange(event: MatSelectChange): void {
    // Do nothing if component is loading or has an error
    if (this.loading() || (this.loadingError() && event.value)) {
      return;
    }

    const newRaw = SelectableValueUtils.toSelectableValueOrNull(
      event.value,
      this.multiSelect()
    );

    const newValue = this.multiSelect()
      ? SelectableValueUtils.mapToOptionsIfPossible(
          newRaw as SelectableValue[],
          this.options()
        ) || []
      : SelectableValueUtils.matchOptionIfPossible(
          newRaw as SelectableValue,
          this.options()
        ) || null;

    // newValue has the correct type since the onChange of the Select component returns the correct
    // values based on the multiple prop
    this.control().setValue(newValue, { emitEvent: true });

    // emit the value also to all connected components
    this.onSelectionChangeEmitter.emit(newValue);
  }

  /**
   * Returns the current selected values as a formatted string.
   *
   * @protected
   * @return {string}
   * @memberof FilterDropdownComponent
   */
  protected getSelectedValues(): string {
    const values: Partial<SelectableValue> | Partial<SelectableValue>[] | null =
      this.control().getRawValue();

    return (Array.isArray(values) ? values : [values])
      .map((element: any) =>
        element === null ? { id: element, text: element } : element
      )
      .map((element: any) => this.formatSelectedValue()(element as any))
      .join(', ');
  }

  /**
   * On Clear Button Action, to delete the current values and to emit the data.
   *
   * @protected
   * @memberof FilterDropdownComponent
   */
  protected onClear(): void {
    this.onSelectionChange({ value: this.multiSelect() ? [] : null } as any);
  }

  /**
   * The compare method to check, if a SelectableValue is selected
   *
   * @protected
   * @param {SelectableValue} value1
   * @param {SelectableValue} value2
   * @return {boolean}
   * @memberof FilterDropdownComponent
   */
  protected compareFn(
    value1: SelectableValue,
    value2: SelectableValue
  ): boolean {
    return value1 && value2 ? value1.id === value2.id : value1 === value2;
  }
}
