import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { GridApi, IRowNode, IStatusPanelParams } from 'ag-grid-enterprise';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { getSelectedRefTypeNodeIds, requestBomExport } from '@cdba/core/store';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { isDetailRoute } from '@cdba/shared/utils';

@Component({
  selector: 'cdba-results-status-bar',
  templateUrl: './results-status-bar.component.html',
  styleUrls: ['./results-status-bar.component.scss'],
})
export class ResultsStatusBarComponent implements OnInit, OnDestroy {
  gridApi: GridApi;

  selectedNodeIds: string[];
  selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
  selectedNodeIdsSubscription: Subscription;

  ngOnInit(): void {
    this.selectedNodeIdsSubscription = this.selectedNodeIds$.subscribe(
      (nodeIds) => {
        this.selectedNodeIds = nodeIds;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.selectedNodeIdsSubscription) {
      this.selectedNodeIdsSubscription.unsubscribe();
    }
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

  showCompareView(): void {
    const queryParams: Params = {};
    const route: string[] = [AppRoutePath.ComparePath];

    const currentPath = this.router.routerState.snapshot.url.split('?')[0];

    this.selectedNodeIds
      .map((id) => this.gridApi.getRowNode(id))
      .forEach((selection: IRowNode, index: number) => {
        queryParams[`material_number_item_${index + 1}`] =
          selection.data.materialNumber;
        queryParams[`plant_item_${index + 1}`] = selection.data.plant;
        queryParams[`node_id_item_${index + 1}`] = isDetailRoute(currentPath)
          ? selection.id
          : undefined;
      });

    this.router.navigate(route, {
      queryParams,
    });
  }

  requestBomExport(): void {
    const identifiers: ReferenceTypeIdentifier[] = [];

    this.selectedNodeIds.forEach((nodeId) => {
      const rowValue = this.gridApi.getRowNode(nodeId);

      if (rowValue) {
        let materialNumber = rowValue.data.materialNumber as string;
        materialNumber = materialNumber.replace('-', '');
        const plant = rowValue.data.plant;

        identifiers.push(new ReferenceTypeIdentifier(materialNumber, plant));
      }
    });

    if (identifiers.length > 0) {
      this.store.dispatch(requestBomExport({ ids: identifiers }));
    }
  }

  constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}
}
