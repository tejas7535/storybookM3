import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { GridApi, IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { select, Store } from '@ngrx/store';

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
    this.selectedNodeIds$ = this.store.pipe(
      select(getSelectedCalculationNodeIds)
    );
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

  loadBom(): void {
    const selectedNode = this.gridApi.getSelectedNodes()[0];

    this.store.dispatch(
      selectCalculation({
        nodeId: selectedNode.id,
        calculation: selectedNode.data,
      })
    );
  }
}
