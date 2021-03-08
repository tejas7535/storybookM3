import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ReferenceType } from '../../../../core/store/reducers/shared/models';
import { DetailRoutePath } from '../../../../detail/detail-route-path.enum';

@Component({
  selector: 'cdba-detail-view-button',
  templateUrl: './detail-view-button.component.html',
  styleUrls: ['./detail-view-button.component.scss'],
})
export class DetailViewButtonComponent {
  selections: any[] = [];

  private params: IStatusPanelParams;

  constructor(private readonly router: Router) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;

    this.params.api.addEventListener('gridReady', this.onGridReady.bind(this));
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onGridReady(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  showDetailView(): void {
    const selection: ReferenceType = this.selections[0];

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
