import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { GridApi, IRowNode, IStatusPanelParams } from 'ag-grid-enterprise';

import {
  getExcludedCalculations,
  getSelectedCalculationNodeIds,
} from '@cdba/core/store';

@Component({
  selector: 'cdba-calculations-status-bar',
  templateUrl: './calculations-status-bar.component.html',
  styleUrls: ['./calculations-status-bar.component.scss'],
})
export class CalculationsStatusBarComponent implements OnInit, OnDestroy {
  excludedCalculations$ = this.store.select(getExcludedCalculations);

  selectedNodes$ = this.store.select(getSelectedCalculationNodeIds);
  selectedNodesSubscription: Subscription;
  selectedNodes: IRowNode[] = [];

  gridApi: GridApi;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedNodesSubscription = this.selectedNodes$.subscribe((nodes) => {
      this.selectedNodes = [];
      nodes?.forEach((node) =>
        this.selectedNodes.push(this.gridApi.getRowNode(node))
      );
    });
  }

  ngOnDestroy(): void {
    this.selectedNodesSubscription?.unsubscribe();
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }
}
