import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';

@Injectable({
  providedIn: 'any',
})
export class MsdSnackbarService {
  private static readonly DEFAULT_ACTION_KEY =
    'materialsSupplierDatabase.mainTable.dialog.close';
  private static readonly DEFAULT_CONFIG = {
    duration: 5000,
  } as MatSnackBarConfig;

  constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Open Snackbar with message stored under given msgKey.
   *
   * @param msgKey key of message to be displayed
   * @param actionKey (optional) key of action message
   * @param config (optional) SnackBar configuration
   */
  open(
    msgKey: string,
    actionKey = MsdSnackbarService.DEFAULT_ACTION_KEY,
    config?: MatSnackBarConfig
  ) {
    this.openTranslated(translate(msgKey), translate(actionKey), config);
  }

  /**
   * Open Snackbar with message.
   *
   * @param msgKey message to be displayed
   * @param actionKey action message
   * @param config (optional) SnackBar configuration
   */
  openTranslated(
    message: string,
    close: string,
    config = MsdSnackbarService.DEFAULT_CONFIG
  ) {
    this.snackBar.open(message, close, config);
  }
}
