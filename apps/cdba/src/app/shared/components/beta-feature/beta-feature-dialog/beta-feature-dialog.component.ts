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
    @Inject(MAT_DIALOG_DATA) public emailAddress: string = EMAIL_DEFAULT
  ) {
    this.emailTemplate = `mailto:${
      this.emailAddress
    }?subject=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.subject'
    )}&body=${this.translocoService.translate(
      'shared.betaFeature.feedback.email.body'
    )}`;
  }
}
