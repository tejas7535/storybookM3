import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { translateOr } from '../../../../ag-grid/grid-value-formatter';
import { parseDemandCharacteristicIfPossible } from '../../../../utils/parse-values';
import { AbstractBaseCellRendererComponent } from '../abstract-cell-renderer.component';

@Component({
  selector: 'd360-select-demand-characteristic-or-original-cell-renderer',
  standalone: true,
  imports: [],
  template: `{{ value }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDemandCharacteristicOrOriginalCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  /**
   * @inheritdoc
   * @override
   */
  protected setValue(params: ICellRendererParams<any, T>): void {
    this.value = params.value
      ? parseDemandCharacteristicIfPossible(String(params.value))
      : null;

    this.value = this.value
      ? translateOr(
          `field.demandCharacteristic.value.${this.value}`,
          undefined,
          ''
        )
      : params.value ?? null;
  }
}
