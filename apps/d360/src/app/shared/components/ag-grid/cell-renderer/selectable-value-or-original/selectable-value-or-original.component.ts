import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererParams } from 'ag-grid-community';

import { SelectableValue } from '../../../inputs/autocomplete/selectable-values.utils';
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
  selector: 'app-selectable-value-or-original-cell-renderer',
  standalone: true,
  imports: [MatTooltipModule, MatIconButton, MatIcon, MatMenuModule],
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

    const foundValue = (params?.options || []).find((option) =>
      DisplayFunctions.displayFnUnited(option).includes(value)
    );

    if (foundValue) {
      this.value = getLabel(foundValue);

      return;
    }

    this.value = value as any;
  }
}
