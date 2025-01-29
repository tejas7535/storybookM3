import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { GridApi, IRowNode, IStatusPanelParams } from 'ag-grid-enterprise';

import { getSelectedRefTypeNodeIds, requestBomExport } from '@cdba/core/store';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';

@Component({
  selector: 'cdba-results-status-bar',
  templateUrl: './results-status-bar.component.html',
  styleUrls: ['./results-status-bar.component.scss'],
})
export class ResultsStatusBarComponent implements OnInit, OnDestroy {
  selectedNodes: IRowNode[] = [];
  selectedNodes$ = this.store.select(getSelectedRefTypeNodeIds);
  selectedNodesSubscription: Subscription;

  gridApi: GridApi;

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

  requestBomExport(): void {
    const identifiers: ReferenceTypeIdentifier[] = [];

    this.selectedNodes.forEach((node) => {
      if (node) {
        let materialNumber = node.data.materialNumber as string;
        materialNumber = materialNumber.replace('-', '');
        const plant = node.data.plant;

        identifiers.push(new ReferenceTypeIdentifier(materialNumber, plant));
      }
    });

    if (identifiers.length > 0) {
      this.store.dispatch(requestBomExport({ ids: identifiers }));
    }
  }

  constructor(private readonly store: Store) {}
}
