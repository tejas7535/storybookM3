import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { Observable } from 'rxjs';

import {
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { CompareRoutePath } from '@cdba/compare/compare-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';

@Component({
  selector: 'cdba-compare-view-button',
  templateUrl: './compare-view-button.component.html',
  styleUrls: ['./compare-view-button.component.scss'],
})
export class CompareViewButtonComponent implements OnInit {
  selectedNodeIds$: Observable<string[]>;

  private gridApi: GridApi;

  constructor(private readonly router: Router, private readonly store: Store) {}

  ngOnInit(): void {
    if (
      this.router.routerState.snapshot.url.includes(AppRoutePath.SearchPath)
    ) {
      this.selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
    } else {
      this.selectedNodeIds$ = this.store.select(getSelectedCalculationNodeIds);
    }
  }

  agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

  showCompareView(nodeIds: string[]): void {
    const queryParams: Params = {};

    nodeIds
      .map((id) => this.gridApi.getRowNode(id))
      .forEach((selection: RowNode, index: number) => {
        queryParams[`material_number_item_${index + 1}`] =
          selection.data.materialNumber;
        queryParams[`plant_item_${index + 1}`] = selection.data.plant;
        queryParams[`node_id_item_${index + 1}`] = !selection.data
          .identificationHash
          ? selection.id
          : undefined;
      });

    this.router.navigate(
      [`${AppRoutePath.ComparePath}/${CompareRoutePath.BomPath}`],
      {
        queryParams,
      }
    );
  }
}
