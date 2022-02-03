import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { GridApi } from '@ag-grid-enterprise/all-modules';
import { AppRoutePath } from '@cdba/app-route-path.enum';
import { getSelectedRefTypeNodeIds } from '@cdba/core/store';
import { DetailRoutePath } from '@cdba/detail/detail-route-path.enum';
import { ReferenceType } from '@cdba/shared/models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cdba-detail-view-button',
  templateUrl: './detail-view-button.component.html',
})
export class DetailViewButtonComponent implements OnInit {
  @Input() public gridApi: GridApi;

  public selectedNodeIds$: Observable<string[]>;

  public constructor(
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.selectedNodeIds$ = this.store.select(getSelectedRefTypeNodeIds);
  }

  public agInit(): void {}

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
