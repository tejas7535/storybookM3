import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RowNode } from '@ag-grid-community/core/dist/cjs/entities/rowNode';
import { GridApi, ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import { AppRoutePath } from '@cdba/app-route-path.enum';
import { DetailRoutePath } from '@cdba/detail/detail-route-path.enum';
import { ReferenceType } from '@cdba/shared/models';

@Component({
  selector: 'cdba-material-designation-cell-render',
  templateUrl: './material-designation-cell-render.component.html',
})
export class MaterialDesignationCellRenderComponent {
  public materialDesignation: string;
  public referenceType: ReferenceType;
  public gridApi: GridApi;
  public node: RowNode;

  public constructor(private readonly router: Router) {}

  public agInit(params: ICellRendererParams): void {
    this.materialDesignation = params.value;
    this.referenceType = params.data;
    this.gridApi = params.api;
    this.node = params.node;
  }

  public onMaterialDesignationClick(): void {
    this.gridApi.deselectAll();

    setTimeout(() => {
      this.router.navigate(
        [`${AppRoutePath.DetailPath}/${DetailRoutePath.DetailsPath}`],
        {
          queryParams: {
            material_number: this.referenceType.materialNumber,
            plant: this.referenceType.plant,
          },
        }
      );
    }, 5);
  }
}
