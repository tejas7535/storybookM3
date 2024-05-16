import { Component, Input, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { GridApi, IRowNode } from 'ag-grid-enterprise';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getSelectedCalculationNodeIds,
  getSelectedRefTypeNodeIds,
} from '@cdba/core/store';
import {
  COMPARE_ITEMS_MAX_COUNT,
  COMPARE_ITEMS_MIN_COUNT,
} from '@cdba/shared/constants/table';
import { isDetailRoute } from '@cdba/shared/utils';

@Component({
  selector: 'cdba-compare-button',
  templateUrl: './compare-button.component.html',
})
export class CompareButtonComponent implements OnInit {
  @Input() public gridApi: GridApi;

  public selectedNodeIds$: Observable<string[]>;
  public appRoutePath = AppRoutePath;
  public minCount = COMPARE_ITEMS_MIN_COUNT;
  public maxCount = COMPARE_ITEMS_MAX_COUNT;

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

  public agInit(): void {}

  public showCompareView(nodeIds: string[]): void {
    const queryParams: Params = {};
    const route: string[] = [AppRoutePath.ComparePath];

    const currentPath = this.router.routerState.snapshot.url.split('?')[0];

    nodeIds
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
}
