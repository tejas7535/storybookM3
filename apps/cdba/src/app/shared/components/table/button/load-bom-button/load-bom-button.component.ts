import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { GridApi, IRowNode } from 'ag-grid-enterprise';

import { selectCalculation } from '@cdba/core/store';
import { Calculation } from '@cdba/shared/models';

@Component({
  selector: 'cdba-load-bom-button',
  templateUrl: './load-bom-button.component.html',
})
export class LoadBomButtonComponent {
  @Input() public gridApi: GridApi;

  selections: Calculation[] = [];

  constructor(private readonly store: Store) {}

  agInit(): void {}

  loadBom(): void {
    const nodeSelected = this.selectedNodes()[0];

    this.store.dispatch(
      selectCalculation({
        nodeId: nodeSelected.id,
        calculation: nodeSelected.data,
      })
    );
  }

  public buttonDisabled(): boolean {
    const nodesSelected = this.selectedNodes();

    if (nodesSelected.length !== 1) {
      return true;
    }

    return nodesSelected[0]?.data?.costType === 'RFQ';
  }

  public tooltipDisabled(): boolean {
    const nodesSelected = this.selectedNodes();

    if (nodesSelected.length !== 1) {
      return true;
    }

    return nodesSelected[0]?.data?.costType !== 'RFQ';
  }

  private readonly selectedNodes = (): IRowNode[] =>
    this.gridApi ? this.gridApi.getSelectedNodes() || [] : [];
}
