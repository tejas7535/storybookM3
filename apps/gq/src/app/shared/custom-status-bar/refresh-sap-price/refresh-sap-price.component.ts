import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { refreshSapPricing } from '../../../core/store';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'gq-refresh-sap-price',
  templateUrl: './refresh-sap-price.component.html',
})
export class RefreshSapPriceComponent {
  icon = 'update';
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  agInit(): void {}

  refreshSapPricing(): void {
    const displayText = translate<string>(
      'processCaseView.confirmRefreshSapPricing.text'
    );

    const confirmButton = translate<string>(
      'processCaseView.confirmRefreshSapPricing.refreshButton'
    );

    const cancelButton = translate<string>(
      'processCaseView.confirmRefreshSapPricing.cancelButton'
    );

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      maxHeight: '80%',
      data: { displayText, confirmButton, cancelButton, icon: this.icon },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(refreshSapPricing());
      }
    });
  }
}
