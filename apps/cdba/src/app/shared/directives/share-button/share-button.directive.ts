import { Clipboard } from '@angular/cdk/clipboard';
import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { SnackBarService } from '@schaeffler/snackbar';

@Directive({
  selector: '[cdbaShareButton]',
})
export class ShareButtonDirective {
  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbarService: SnackBarService,
    private readonly applicationInsights: ApplicationInsightsService,
    private readonly router: Router
  ) {}

  @HostListener('click')
  shareUrl(): void {
    this.clipboard.copy(window.location.href);
    this.snackbarService.showSuccessMessage(
      translate('shared.shareUrl.toastSuccessMessage'),
      translate('shared.shareUrl.toastConfirmMessage')
    );

    const params = (this.router.routerState.snapshot.root.queryParamMap as any)[
      'params'
    ];
    this.applicationInsights.logEvent('Share URL', { params });
  }
}
