import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { SnackBarService } from '@schaeffler/snackbar';

@Component({
  selector: 'gq-share-button',
  templateUrl: './share-button.component.html',
})
export class ShareButtonComponent {
  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackbarService: SnackBarService
  ) {}

  public shareUrl(): void {
    this.clipboard.copy(window.location.href);
    this.snackbarService.showSuccessMessage(
      translate('shared.shareUrl.toastSuccessMessage'),
      translate('shared.shareUrl.toastConfirmMessage')
    );
  }
}
