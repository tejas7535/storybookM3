import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ConfirmationModalData } from '@gq/shared/components/modal/confirmation-modal/models/confirmation-modal-data.model';
import { translate } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { ConfirmationModalComponent } from '../../../components/modal/confirmation-modal/confirmation-modal.component';
import { EVENT_NAMES, QuotationStatus } from '../../../models';

@Component({
  selector: 'gq-refresh-sap-price',
  templateUrl: './refresh-sap-price.component.html',
})
export class RefreshSapPriceComponent {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly insightsService: ApplicationInsightsService = inject(
    ApplicationInsightsService
  );
  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);

  icon = 'update';
  simulationModeEnabled$: Observable<boolean> =
    this.activeCaseFacade.simulationModeEnabled$;
  quotationStatus = QuotationStatus;

  agInit(): void {}

  refreshSapPricing(): void {
    const displayTitle = translate(
      'processCaseView.confirmRefreshSapPricing.title'
    );
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
      width: '40%',
      data: {
        title: displayTitle,
        subtitle: displayText,
        confirmButtonText: confirmButton,
        cancelButtonText: cancelButton,
        confirmButtonIcon: this.icon,
      } as ConfirmationModalData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activeCaseFacade.refreshSapPricing();
        this.insightsService.logEvent(EVENT_NAMES.SAP_DATA_REFRESHED);
      }
    });
  }
}
