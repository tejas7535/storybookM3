import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';
import { AppRoutePath } from '@cdba/app-route-path.enum';
import { DetailRoutePath } from '@cdba/detail/detail-route-path.enum';

@Component({
  selector: 'cdba-bom-material-designation-cell-render',
  templateUrl: './bom-material-designation-cell-render.component.html',
})
export class BomMaterialDesignationCellRenderComponent {
  public materialDesignation: string;
  public isRouterLink: boolean;

  private plant: string;
  private materialNumber: string;

  public constructor(private readonly router: Router) {}

  public agInit(params: ICellRendererParams): void {
    this.materialDesignation = params.value;
    this.plant = params.data.plant || params.data.procurement.plant;
    this.materialNumber =
      params.data.materialNumber || params.data.material?.materialNumber;

    this.isRouterLink = !!this.materialNumber && !!this.plant;
  }

  public navigateToDetailPage(): void {
    if (this.isRouterLink) {
      this.router.navigate(
        [`${AppRoutePath.DetailPath}/${DetailRoutePath.DetailsPath}`],
        {
          queryParams: {
            material_number: this.materialNumber,
            plant: this.plant,
          },
        }
      );
    }
  }
}
