import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  Signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { SelectableValue } from '../../inputs/autocomplete/selectable-values.utils';
import {
  GlobalSelectionFilters,
  GlobalSelectionState,
} from '../global-selection-state.service';

/**
 * Internal Interface for SelectableFormValue
 *
 * @interface SelectableFormValue
 */
interface SelectableFormValue {
  id?: string;
  text: string;
  field: string;
}

/**
 * The "minimized version" of the GlobalSelectionCriteria
 *
 * @export
 * @class MinimizedGlobalSelectionCriteriaComponent
 */
@Component({
  selector: 'd360-minimized-global-selection-criteria',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './minimized-global-selection-criteria.component.html',
  styleUrls: ['./minimized-global-selection-criteria.component.scss'],
})
export class MinimizedGlobalSelectionCriteriaComponent {
  /**
   * The current filter values.
   *
   * @type {InputSignal<GlobalSelectionState>}
   * @memberof MinimizedGlobalSelectionCriteriaComponent
   */
  public filters: InputSignal<GlobalSelectionState> = input.required();

  /**
   * The form group instance
   *
   * @type {InputSignal<FormGroup<GlobalSelectionFilters>>}
   * @memberof MinimizedGlobalSelectionCriteriaComponent
   */
  public form: InputSignal<FormGroup<GlobalSelectionFilters>> =
    input.required();

  /**
   * The output event emitter to emit filter changes to the parent.
   *
   * @memberof MinimizedGlobalSelectionCriteriaComponent
   */
  public selectionChanged = output();

  /**
   * Returns the current values to render
   *
   * @type {Signal<SelectableFormValue[]>}
   * @memberof MinimizedGlobalSelectionCriteriaComponent
   */
  public values: Signal<SelectableFormValue[]> = computed(() => {
    const currentValues: GlobalSelectionState = this.filters();
    let values: SelectableFormValue[] = [];

    Object.keys(currentValues).forEach((key) => {
      const formValues: SelectableValue[] | string = (currentValues as any)[
        key
      ];

      if (Array.isArray(formValues)) {
        values = [
          ...values,
          ...(formValues as SelectableValue[]).map((value) => ({
            id: value.id,
            text: value.text,
            field: key,
          })),
        ];
      } else if (formValues !== '') {
        values = [...values, { id: key, text: formValues, field: key }];
      }
    });

    return values;
  });

  /**
   * Remove a filter
   *
   * @param {SelectableFormValue} filter
   * @memberof MinimizedGlobalSelectionCriteriaComponent
   */
  public remove(filter: SelectableFormValue): void {
    const control: any = this.form().get(filter.field);
    let currentValue = control.value;

    if (Array.isArray(currentValue)) {
      currentValue = currentValue.filter(
        (value) => value.id !== filter.id && value.text !== filter.text
      );

      control.setValue(currentValue);
    } else {
      control.setValue(null);
    }

    // emit to the parent
    this.selectionChanged.emit();
  }
}
