import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ChargeableSoonConfirmationComponent } from '../chargeable-soon-confirmation/chargeable-soon-confirmation.component';

@Component({
  selector: 'cdba-browser-support-dialog',
  templateUrl: './chargeable-soon-dialog.component.html',
})
export class ChargeableSoonDialogComponent {
  public constructor(private readonly dialog: MatDialog) {}

  public onSecondaryActionClick(): void {
    this.dialog.open(ChargeableSoonConfirmationComponent, {
      hasBackdrop: false,
      maxWidth: 400,
    });
  }
}
