import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ChargeableSoonDialogComponent } from '../chargeable-soon-dialog/chargeable-soon-dialog.component';

@Component({
  selector: 'cdba-chargeable-soon-badge',
  templateUrl: './chargeable-soon-badge.component.html',
})
export class ChargeableSoonBadgeComponent {
  public constructor(private readonly dialog: MatDialog) {}

  public onBadgeClick(event: { target: any }): void {
    const target = event.target;

    if (target) {
      target.blur();
    }

    this.dialog.open(ChargeableSoonDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      maxWidth: 400,
      autoFocus: false,
    });
  }
}
