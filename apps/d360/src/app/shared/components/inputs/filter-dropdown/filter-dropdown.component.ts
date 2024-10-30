import { NgClass, NgFor } from '@angular/common';
import { Component, effect, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

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
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgClass,
    NgFor,
  ],
  templateUrl: './filter-dropdown.component.html',
})
export class FilterDropdownComponent implements OnInit {
  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    const values:
      | Partial<SelectableValue>
      | Partial<SelectableValue>[]
      | string = this.control().getRawValue();

    // run the onSelectionChange event to set the values during initialization
    this.onSelectionChange({
      value: (Array.isArray(values) ? values : [values]).map((option: any) =>
        typeof option === 'string' ? option : option.id
      ),
    } as any);
  }

  /**
   * The form control.
   *
   * @type {(InputSignal<
   *     FormControl<Partial<SelectableValue> | Partial<SelectableValue>[] | string>
   *   >)}
   * @memberof FilterDropdownComponent
   */
  public control: InputSignal<
    FormControl<Partial<SelectableValue> | Partial<SelectableValue>[] | string>
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
   * Is the field is disabled?
   * Hint: we use an effect here, to enable disable the form control.
   *
   * @type {InputSignal<boolean>}
   * @memberof FilterDropdownComponent
   */
  public disabled: InputSignal<boolean> = input(false);

  /**
   * A hint test to get rendered below the filter dropdown.
   *
   * @type {InputSignal<string>}
   * @memberof FilterDropdownComponent
   */
  public hintText?: InputSignal<string> = input();

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
   * Creates an instance of FilterDropdownComponent.
   *
   * @memberof FilterDropdownComponent
   */
  public constructor() {
    effect(() => this.control()[this.disabled() ? 'disable' : 'enable']());
  }

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

    const newRaw = event.value;
    const newValue = Array.isArray(newRaw)
      ? SelectableValueUtils.mapToOptionsIfPossible(newRaw, this.options()) ||
        []
      : SelectableValueUtils.matchOptionIfPossible(newRaw, this.options()) || {
          id: '',
          text: '',
        };

    // newValue has the correct type since the onChange of the Select component returns the correct
    // values based on the multiple prop
    this.control().setValue(newValue);
  }

  /**
   * Returns the current selected values as a formatted string.
   *
   * @protected
   * @return {string}
   * @memberof FilterDropdownComponent
   */
  protected getSelectedValues(): string {
    const values:
      | Partial<SelectableValue>
      | Partial<SelectableValue>[]
      | string = this.control().getRawValue();

    return (Array.isArray(values) ? values : [values])
      .map((element: any) =>
        typeof element === 'string'
          ? {
              id: element,
              text: element,
            }
          : element
      )
      .map((element: any) => this.formatSelectedValue()(element as any))
      .join(', ');
  }
}
