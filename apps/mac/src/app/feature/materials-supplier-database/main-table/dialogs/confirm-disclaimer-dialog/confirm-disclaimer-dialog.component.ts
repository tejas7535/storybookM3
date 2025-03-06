import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdAgGridStateService } from '@mac/feature/materials-supplier-database/services';

@Component({
  selector: 'mac-confirm-disclaimer-dialog',
  imports: [
    // angular material
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    // libs
    SharedTranslocoModule,
  ],
  templateUrl: './confirm-disclaimer-dialog.component.html',
})
export class ConfirmDisclaimerDialogComponent {
  public storeConsent: boolean;

  constructor(private readonly msdAgGridStateService: MsdAgGridStateService) {}

  public consent() {
    if (this.storeConsent) {
      const timeout = new Date();
      timeout.setDate(timeout.getDate() + 7);
      this.msdAgGridStateService.storeDisclaimerConsentTimeout(
        timeout.getTime()
      );
    }
  }
}
