import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EMAIL_DEFAULT } from '@cdba/shared/constants/emails';

import { BetaFeatureDialogComponent } from '../beta-feature-dialog/beta-feature-dialog.component';
import { BetaFeatureDialogData } from '../model/beta-feature-dialog.model';

@Component({
  selector: 'cdba-beta-feature-badge',
  templateUrl: './beta-feature-badge.component.html',
  standalone: false,
})
export class BetaFeatureBadgeComponent {
  @Input() emailAddress: string = EMAIL_DEFAULT;
  @Input() contentType: 'specific' | 'general' = 'specific';

  private readonly dialog = inject(MatDialog);

  onBadgeClick(event: { target: any }): void {
    const target = event.target;

    if (target) {
      target.blur();
    }

    this.dialog.open(BetaFeatureDialogComponent, {
      hasBackdrop: true,
      maxWidth: 400,
      autoFocus: false,
      data: {
        emailAddress: this.emailAddress,
        contentType: this.contentType,
      } as BetaFeatureDialogData,
    });
  }
}
