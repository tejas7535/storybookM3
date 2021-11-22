import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { TranslocoService } from '@ngneat/transloco';

import { URL_SUPPORT } from '../constants/urls';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
  snackBarIsOpen = false;

  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  public handleHttpErrorDefault(): void {
    this.openErrorSnackbar();
  }

  private openErrorSnackbar(errorType: 'default' = 'default'): void {
    // prevent multiple popups of the same snackbar
    if (!this.snackBarIsOpen) {
      this.snackBarRef = this.snackBar.open(
        this.translocoService.translate(`http.error.message.${errorType}`),
        this.translocoService.translate(`http.error.action.${errorType}`),
        { duration: 5000 }
      );

      this.snackBarIsOpen = true;

      this.snackBarRef.onAction().subscribe(() => {
        window.open(URL_SUPPORT, '_blank').focus();
      });

      this.snackBarRef.afterDismissed().subscribe(() => {
        this.snackBarIsOpen = false;
      });
    }
  }
}
