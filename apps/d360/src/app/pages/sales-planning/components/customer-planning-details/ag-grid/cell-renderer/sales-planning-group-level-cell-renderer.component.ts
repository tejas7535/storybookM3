import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../feature/sales-planning/model';
import { AbstractBaseCellRendererComponent } from '../../../../../../shared/components/ag-grid/cell-renderer/abstract-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-group-level-cell-renderer',
  standalone: true,
  imports: [],
  templateUrl: './sales-planning-group-level-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sales-planning-group-level-cell-renderer.component.scss',
})
// TODO: Introduce abstraction for toggling with upcoming cell renderer of D360-164-VOD-DOH
export class SalesPlanningGroupLevelCellRendererComponent<
  T = any,
> extends AbstractBaseCellRendererComponent<T> {
  public isGroup!: boolean;
  public isChildElement!: boolean;
  public rowData!: DetailedCustomerSalesPlan;

  public expanded: WritableSignal<boolean> = signal(false);

  public onClickAction: (
    rowData: DetailedCustomerSalesPlan,
    isChildElement: boolean
  ) => void;

  /**
   * @inheritdoc
   * @override
   */
  protected setValue(
    parameters: ICellRendererParams<any, T> & {
      clickAction: () => void;
    }
  ): void {
    this.value =
      parameters.node.level === 1 &&
      ['planningMaterial', 'planningMaterialText'].every((v) =>
        Object.keys(parameters.data).includes(v)
      )
        ? `${parameters.data.planningMaterial} - ${parameters.data.planningMaterialText}`
        : parameters.data.planningYear;

    this.isGroup = !!parameters.node.group;
    this.parameters = parameters;
    this.isChildElement = parameters.node.level === 1;
    this.rowData = parameters.data;

    this.onClickAction = parameters.clickAction;
    this.expanded.set(this.parameters.node.expanded);

    this.parameters.node.addEventListener('expandedChanged', this.onExpand);
  }

  public onClickExpand() {
    this.expanded.set(!this.parameters.node.expanded);
    this.parameters.node.setExpanded(!this.parameters.node.expanded);
  }

  public destroy() {
    this.parameters.node.removeEventListener('expandedChanged', this.onExpand);
  }

  private readonly onExpand = () => {
    this.expanded.set(this.parameters.node.expanded);
  };
}
