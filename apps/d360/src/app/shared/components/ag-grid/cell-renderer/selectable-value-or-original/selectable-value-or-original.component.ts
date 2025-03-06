import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import {
  SelectableValue,
  SelectableValueUtils,
} from '../../../inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../inputs/display-functions.utils';
import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

export interface AdditionalProps {
  options: SelectableValue[];
  getLabel?: (v: SelectableValue) => string;
}

/**
 * This is a custom cell renderer to render the action dropdown menu.
 *
 * @export
 * @class ActionsMenuCellRendererComponent
 * @extends {AbstractBaseCellRendererComponent<T>}
 * @template T
 */
@Component({
  selector: 'd360-selectable-value-or-original-cell-renderer',
  template: `{{ value }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableValueOrOriginalCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    params: ICellRendererParams<any, T> & AdditionalProps
  ): void {
    let value = String(DisplayFunctions.displayFnId(params.value as any) || '');
    value = value === '-' ? '' : value;

    const getLabel = params.getLabel ?? DisplayFunctions.displayFnUnited;

    if (value === '') {
      this.value = '';

      return;
    }

    let foundValue = (params?.options || []).find((option) =>
      DisplayFunctions.displayFnUnited(option).includes(value)
    );

    // Fallback
    if (
      !params?.options &&
      !foundValue &&
      SelectableValueUtils.isSelectableValue(params.value)
    ) {
      foundValue = params.value;
    }

    if (foundValue) {
      this.value = getLabel(foundValue);

      return;
    }

    this.value = value as any;
  }
}
