import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';

@Component({
  selector: 'gq-share-button',
  templateUrl: './share-button.component.html',
})
export class ShareButtonComponent {
  constructor(
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar
  ) {}

  public shareUrl(): void {
    this.clipboard.copy(window.location.href);
    this.snackBar.open(
      translate('shared.shareUrl.toastSuccessMessage'),
      translate('shared.shareUrl.toastConfirmMessage')
    );
  }
}
