import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { GridApi, IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { AppRoutePath } from '@cdba/app-route-path.enum';
import { getSelectedRefTypeNodeIds } from '@cdba/core/store';
import { DetailRoutePath } from '@cdba/detail/detail-route-path.enum';
import { ReferenceType } from '@cdba/shared/models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-detail-view-button',
  templateUrl: './detail-view-button.component.html',
  styleUrls: ['./detail-view-button.component.scss'],
})
export class DetailViewButtonComponent implements OnInit {
  public selectedNodeIds$: Observable<string[]>;

  private gridApi: GridApi;

  public constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
  }

  public agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;
  }

  public showDetailView(nodeId: string): void {
    const selection: ReferenceType = this.gridApi.getRowNode(nodeId).data;

    this.router.navigate(
      [`${AppRoutePath.DetailPath}/${DetailRoutePath.DetailsPath}`],
      {
        queryParams: {
          material_number: selection.materialNumber,
          plant: selection.plant,
          identification_hash: selection.identificationHash,
        },
      }
    );
  }
}
