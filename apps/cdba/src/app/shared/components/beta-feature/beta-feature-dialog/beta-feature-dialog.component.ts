import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslocoService } from '@jsverse/transloco';

import { EMAIL_DEFAULT } from '@cdba/shared/constants/emails';

import { BetaFeatureDialogData } from '../model/beta-feature-dialog.model';

@Component({
  selector: 'cdba-beta-feature-dialog',
  templateUrl: './beta-feature-dialog.component.html',
  standalone: false,
})
export class BetaFeatureDialogComponent {
  emailTemplate: string;

  private readonly dialogRef = inject(MatDialogRef<BetaFeatureDialogComponent>);

  constructor(
    private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA)
    public modalData: BetaFeatureDialogData
  ) {
    this.emailTemplate = `mailto:${
      this.modalData.emailAddress || EMAIL_DEFAULT
    }?subject=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.subject'
    )}&body=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.body'
    )}`;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
