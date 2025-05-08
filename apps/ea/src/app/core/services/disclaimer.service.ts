import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CalculationDisclaimerComponent } from '@ea/calculation/calculation-disclaimer/calculation-disclaimer.component';

@Injectable({ providedIn: 'root' })
export class DisclaimerService {
  private readonly matDialog = inject(MatDialog);

  /**
   * Open the disclaimer modal that explains the methodology
   * for the CO2 calculation
   * @param scrollToDownstream indicate if the dialog should automatically scroll to the downstream section
   **/
  openCO2Disclaimer(scrollToDownstream: boolean) {
    this.matDialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
      panelClass: 'legal-disclaimer-dialog',
      data: {
        isDownstreamDisclaimer: scrollToDownstream,
      },
    });
  }
}
