import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

import { environment } from '../../../../../environments/environment';

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
    this.router.navigate(['compare']);
  }
}
