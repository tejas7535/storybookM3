import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { translate } from '@jsverse/transloco';

import { CustomSnackbarComponent } from '../../main-table/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'any',
})
export class MsdSnackbarService {
  private static readonly DEFAULT_CONFIG = {
    duration: 5000,
  } as MatSnackBarConfig;

  constructor(private readonly snackBar: MatSnackBar) {}

  info(msgKey: string) {
    this.open(msgKey);
  }

  infoTranslated(message: string) {
    this.openTranslated(message);
  }

  error(
    msgKey: string,
    detailMessage?: string,
    items?: { key: string; value: any }[]
  ) {
    this.open(msgKey, detailMessage, items, {});
  }

  errorTranslated(
    message: string,
    detailMessage?: string,
    items?: { key: string; value: any }[]
  ) {
    this.openTranslated(message, detailMessage, items, {});
  }

  /**
   * Open Snackbar with message stored under given msgKey.
   *
   * @param msgKey key of message to be displayed
   * @param detailMessage (optional) detail message to be displayed
   * @param items (optional) items list to be displayed
   * @param config (optional) SnackBar configuration
   */
  private open(
    msgKey: string,
    detailMessage?: string,
    items?: { key: string; value: any }[],
    config = MsdSnackbarService.DEFAULT_CONFIG
  ) {
    this.openTranslated(translate(msgKey), detailMessage, items, config);
  }

  /**
   * Open Snackbar with message.
   *
   * @param message message to be displayed
   * @param detailMessage (optional) detail message to be displayed
   * @param items (optional) items list to be displayed
   * @param config (optional) SnackBar configuration
   */
  private openTranslated(
    message: string,
    detailMessage?: string,
    items?: { key: string; value: any }[],
    config = MsdSnackbarService.DEFAULT_CONFIG
  ) {
    const snackBarConfig = items
      ? ({
          ...config,
          data: { message, detail: { message: detailMessage, items } },
        } as MatSnackBarConfig)
      : { ...config, data: { message } };
    this.snackBar.openFromComponent(CustomSnackbarComponent, snackBarConfig);
  }
}
