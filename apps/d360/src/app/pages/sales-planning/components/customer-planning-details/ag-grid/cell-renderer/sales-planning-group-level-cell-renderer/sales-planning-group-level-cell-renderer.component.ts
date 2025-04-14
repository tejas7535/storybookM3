import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { AbstractSalesPlanningCellRendererComponent } from '../abstract-sales-planning-cell-renderer.component';

@Component({
  selector: 'd360-sales-planning-group-level-cell-renderer',
  imports: [],
  templateUrl: './sales-planning-group-level-cell-renderer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sales-planning-group-level-cell-renderer.component.scss',
})
export class SalesPlanningGroupLevelCellRendererComponent extends AbstractSalesPlanningCellRendererComponent<string> {
  public get isGroup(): boolean {
    return !!this.parameters?.node?.group;
  }

  public get isChildElement(): boolean {
    return this.parameters?.node?.level === 1;
  }

  public get rowData(): DetailedCustomerSalesPlan {
    return this.parameters?.node?.data;
  }

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
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, string> & {
      clickAction: () => void;
    }
  ): void {
    this.parameters = parameters;

    this.value =
      this.parameters?.node.level === 1 &&
      ['planningMaterial', 'planningMaterialText'].every((v) =>
        Object.keys(this.rowData).includes(v)
      )
        ? `${this.rowData.planningMaterial} - ${this.rowData.planningMaterialText}`
        : this.rowData.planningYear;

    this.onClickAction = parameters.clickAction;
    this.expanded.set(this.parameters?.node.expanded);

    this.parameters?.node.addEventListener('expandedChanged', this.onExpand);
  }

  public onClickExpand() {
    this.expanded.set(!this.parameters?.node.expanded);
    this.parameters?.node.setExpanded(!this.parameters?.node.expanded);
  }

  public destroy() {
    this.parameters?.node.removeEventListener('expandedChanged', this.onExpand);
  }

  private readonly onExpand = () => {
    this.expanded.set(this.parameters?.node.expanded);
  };
}
