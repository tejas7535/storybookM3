import { Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { Observable } from 'rxjs';

import {
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-compare-view-button',
  templateUrl: './compare-view-button.component.html',
  styleUrls: ['./compare-view-button.component.scss'],
})
export class CompareViewButtonComponent implements OnInit {
  public selectedNodeIds$: Observable<string[]>;
  public appRoutePath = AppRoutePath;

  private gridApi: GridApi;

  public constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.selectedNodeIds$ = this.router.routerState.snapshot.url.includes(
      AppRoutePath.ResultsPath
    )
      ? this.store.select(getSelectedRefTypeNodeIds)
      : this.store.select(getSelectedCalculationNodeIds);
  }

  public agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

  public showCompareView(nodeIds: string[]): void {
    const queryParams: Params = {};
    const route: string[] = [AppRoutePath.ComparePath];

    nodeIds
      .map((id) => this.gridApi.getRowNode(id))
      .forEach((selection: RowNode, index: number) => {
        queryParams[`material_number_item_${index + 1}`] =
          selection.data.materialNumber;
        queryParams[`plant_item_${index + 1}`] = selection.data.plant;
        queryParams[`identification_hash_item_${index + 1}`] =
          selection.data.identificationHash;
        queryParams[`node_id_item_${index + 1}`] = !selection.data
          .identificationHash
          ? selection.id
          : undefined;
      });

    this.router.navigate(route, {
      queryParams,
    });
  }
}
