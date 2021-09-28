import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Directive({
  selector: '[cdbaShareButton]',
})
export class ShareButtonDirective {
  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbar: MatSnackBar,
    private readonly applicationInsights: ApplicationInsightsService,
    private readonly router: Router
  ) {}

  @HostListener('click')
  shareUrl(): void {
    this.clipboard.copy(window.location.href);
    this.snackbar.open(
      translate('shared.shareUrl.successMessage'),
      translate('shared.basic.dismissMessage')
    );

    const params = (this.router.routerState.snapshot.root.queryParamMap as any)[
      'params'
    ];
    this.applicationInsights.logEvent('Share URL', { params });
  }
}
