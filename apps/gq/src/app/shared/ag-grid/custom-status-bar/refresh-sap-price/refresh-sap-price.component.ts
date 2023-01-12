import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  getSimulationModeEnabled,
  refreshSapPricing,
} from '../../../../core/store';
import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';
import { EVENT_NAMES, QuotationStatus } from '../../../models';

@Component({
  selector: 'gq-refresh-sap-price',
  templateUrl: './refresh-sap-price.component.html',
})
export class RefreshSapPriceComponent {
  icon = 'update';
  public simulationModeEnabled$: Observable<boolean>;
  public quotationStatus = QuotationStatus;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly insightsService: ApplicationInsightsService
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
        this.insightsService.logEvent(EVENT_NAMES.SAP_DATA_REFRESHED);
      }
    });
  }
}
