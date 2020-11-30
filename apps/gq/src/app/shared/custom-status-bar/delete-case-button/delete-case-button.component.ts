import { Component } from '@angular/core';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'gq-delete-case-button',
  templateUrl: './delete-case-button.component.html',
  styleUrls: ['./delete-case-button.component.scss'],
})
export class DeleteCaseButtonComponent {
  selections: any[] = [];
  private params: IStatusPanelParams;

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
  deleteCase(): void {
    // ToDo: Delete case
  }
}
