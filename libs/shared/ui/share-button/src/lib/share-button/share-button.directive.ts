import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Directive({
  selector: '[schaefflerShareButton]',
})
export class ShareButtonDirective {
  public constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly applicationInsights: ApplicationInsightsService,
    private readonly router: Router
  ) {}

  @HostListener('click')
  public shareUrl(): void {
    this.clipboard.copy(window.location.href);
    this.snackbar.open(
      translate('successMessage'),
      translate('dismissMessage'),
      { duration: 5000 }
    );

    const params = (this.router.routerState.snapshot.root.queryParamMap as any)[
      'params'
    ];
    this.applicationInsights.logEvent('Share URL', { params });
  }
}
