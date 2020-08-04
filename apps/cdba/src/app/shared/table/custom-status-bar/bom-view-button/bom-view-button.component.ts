import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-community/core';

@Component({
  selector: 'cdba-bom-view-button',
  templateUrl: './bom-view-button.component.html',
  styleUrls: ['./bom-view-button.component.scss'],
})
export class BomViewButtonComponent {
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

  showBomView(): void {
    this.router.navigate(['/detail/bom'], {
      queryParams: {
        material_number: this.selections[0].materialNumber,
        plant: this.selections[0].plant,
      },
    });
  }
}
