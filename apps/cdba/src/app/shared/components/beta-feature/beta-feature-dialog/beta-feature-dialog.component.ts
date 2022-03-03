import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EMAIL_DEFAULT } from '@cdba/shared/constants/emails';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'cdba-beta-feature-dialog',
  templateUrl: './beta-feature-dialog.component.html',
})
export class BetaFeatureDialogComponent {
  public emailTemplate: string;

  constructor(
    private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      emailAddress: string;
      contentType: 'specific' | 'general';
    }
  ) {
    this.emailTemplate = `mailto:${
      this.modalData.emailAddress || EMAIL_DEFAULT
    }?subject=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.subject'
    )}&body=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.body'
    )}`;
  }
}
