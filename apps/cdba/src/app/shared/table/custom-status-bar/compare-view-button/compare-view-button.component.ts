import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import { CompareRoutePath } from '@cdba/compare/compare-route-path.enum';
import { ReferenceType } from '@cdba/core/store/reducers/shared/models';
import { environment } from '@cdba/environments/environment';

@Component({
  selector: 'cdba-compare-view-button',
  templateUrl: './compare-view-button.component.html',
  styleUrls: ['./compare-view-button.component.scss'],
})
export class CompareViewButtonComponent {
  selections: any[] = [];
  production = environment.production;

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

  showCompareView(): void {
    const queryParams = {} as any;
    this.selections.forEach((selection: ReferenceType, index) => {
      queryParams[`material_number_item_${index + 1}`] =
        selection.materialNumber;
      queryParams[`plant_item_${index + 1}`] = selection.plant;
      queryParams[`identification_hash_item_${index + 1}`] =
        selection.identificationHash;
    });

    this.router.navigate(
      [`${AppRoutePath.ComparePath}/${CompareRoutePath.DetailsPath}`],
      {
        queryParams,
      }
    );
  }
}
