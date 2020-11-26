import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

import { AppRoutePath } from '../../../app-route-path.enum';

@Component({
  selector: 'gq-open-case-button',
  templateUrl: './open-case-button.component.html',
  styleUrls: ['./open-case-button.component.scss'],
})
export class OpenCaseButtonComponent {
  selections: any[] = [];
  private params: IStatusPanelParams;

  constructor(private readonly router: Router) {}

  agInit(params: IStatusPanelParams): void {
    this.params = params;
    this.params.api.addEventListener(
      'selectionChanged',
      this.onSelectionChange.bind(this)
    );
  }

  onSelectionChange(): void {
    this.selections = this.params.api.getSelectedRows();
  }

  openCase(): void {
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParams: {
        quotation_number: this.selections[0].gqId,
        customer_number: this.selections[0].customer.id,
      },
    });
  }
}
