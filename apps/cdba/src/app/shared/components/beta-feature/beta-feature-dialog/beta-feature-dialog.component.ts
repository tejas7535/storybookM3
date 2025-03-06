import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslocoService } from '@jsverse/transloco';

import { EMAIL_DEFAULT } from '@cdba/shared/constants/emails';

@Component({
  selector: 'cdba-beta-feature-dialog',
  templateUrl: './beta-feature-dialog.component.html',
  standalone: false,
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
