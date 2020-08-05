import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-community/core';

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
    this.router.navigate(['/detail/detail'], {
      queryParams: {
        material_number: this.selections[0].materialNumber,
        plant: this.selections[0].plant,
        rfq: this.selections[0].rfq !== undefined ? this.selections[0].rfq : '',
        pcm_calculation_date:
          this.selections[0].pcmCalculationDate !== undefined
            ? this.selections[0].pcmCalculationDate
            : '',
        pcm_quantity:
          this.selections[0].pcmQuantity !== undefined
            ? this.selections[0].pcmQuantity
            : '',
      },
    });
  }
}
