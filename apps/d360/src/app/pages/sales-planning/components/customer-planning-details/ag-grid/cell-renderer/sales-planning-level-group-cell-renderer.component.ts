import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { AbstractBaseCellRendererComponent } from '../../../../../../shared/components/ag-grid/cell-renderer/abstract-cell-renderer.component';

@Component({
  standalone: true,
  template: `{{ value }}`,
})
export class SalesPlanningLevelGroupCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  protected setValue(parameters: ICellRendererParams<any, T>): void {
    this.value =
      parameters.node.level === 1 &&
      ['planningMaterial', 'planningMaterialText'].every((v) =>
        Object.keys(parameters.data).includes(v)
      )
        ? `${parameters.data.planningMaterial} - ${parameters.data.planningMaterialText}`
        : parameters.data.planningYear;
  }
}
