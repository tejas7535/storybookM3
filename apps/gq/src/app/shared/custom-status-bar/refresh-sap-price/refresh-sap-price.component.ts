import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getSimulationModeEnabled,
  refreshSapPricing,
} from '../../../core/store';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'gq-refresh-sap-price',
  templateUrl: './refresh-sap-price.component.html',
})
export class RefreshSapPriceComponent {
  icon = 'update';
  public simulationModeEnabled$: Observable<boolean>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  agInit(): void {
    this.simulationModeEnabled$ = this.store.select(getSimulationModeEnabled);
  }

  refreshSapPricing(): void {
    const displayText = translate(
      'processCaseView.confirmRefreshSapPricing.text'
    );

    const confirmButton = translate(
      'processCaseView.confirmRefreshSapPricing.refreshButton'
    );

    const cancelButton = translate(
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
