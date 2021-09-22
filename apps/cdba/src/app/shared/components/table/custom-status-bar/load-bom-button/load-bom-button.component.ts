import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { GridApi, IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { Store } from '@ngrx/store';

import {
  getSelectedCalculationNodeIds,
  selectCalculation,
} from '@cdba/core/store';
import { Calculation } from '@cdba/shared/models';

@Component({
  selector: 'cdba-load-bom-button',
  templateUrl: './load-bom-button.component.html',
  styleUrls: ['./load-bom-button.component.scss'],
})
export class LoadBomButtonComponent implements OnInit {
  selections: Calculation[] = [];
  selectedNodeIds$: Observable<string[]>;

  private gridApi: GridApi;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedNodeIds$ = this.store.select(getSelectedCalculationNodeIds);
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

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

  private readonly selectedNodes = (): RowNode[] =>
    this.gridApi ? this.gridApi.getSelectedNodes() || [] : [];
}
