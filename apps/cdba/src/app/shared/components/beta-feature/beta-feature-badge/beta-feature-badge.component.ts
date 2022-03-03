import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EMAIL_DEFAULT } from '@cdba/shared/constants/emails';

import { BetaFeatureDialogComponent } from '../beta-feature-dialog/beta-feature-dialog.component';

@Component({
  selector: 'cdba-beta-feature-badge',
  templateUrl: './beta-feature-badge.component.html',
})
export class BetaFeatureBadgeComponent {
  @Input() emailAddress: string = EMAIL_DEFAULT;
  @Input() public contentType: 'specific' | 'general' = 'specific';

  public constructor(private readonly dialog: MatDialog) {}

  public onBadgeClick(event: { target: any }): void {
    const target = event.target;

    if (target) {
      target.blur();
    }

    this.dialog.open(BetaFeatureDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      maxWidth: 400,
      autoFocus: false,
      data: {
        emailAddress: this.emailAddress,
        contentType: this.contentType,
      },
    });
  }
}
