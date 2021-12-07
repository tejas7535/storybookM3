import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { merge, Observable } from 'rxjs';
import { mapTo, take, tap } from 'rxjs/operators';

import { SnackBarComponent } from './snackbar.component';
import { SnackBarData } from './snackbar-data.model';
import { SnackBarType } from './snackbar-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  public constructor(private readonly snackBar: MatSnackBar) {}

  /**
   * Displays a Snackbar of type SUCCESS
   */
  public showSuccessMessage(
    message: string = 'Changes are saved successfully',
    action?: string
  ): Observable<string> {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: 'success-message',
      data: new SnackBarData(message, action, SnackBarType.SUCCESS),
      duration: 3000,
    };

    return this.showMessage(snackBarConfig);
  }

  /**
   * Displays a Snackbar of type WARNING
   */
  public showWarningMessage(
    message: string,
    action?: string
  ): Observable<string> {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: 'warning-message',
      data: new SnackBarData(message, action, SnackBarType.WARNING),
    };

    return this.showMessage(snackBarConfig);
  }

  /**
   * Displays a Snackbar of type ERROR
   */
  public showErrorMessage(
    message: string,
    action?: string,
    shouldStay?: boolean
  ): Observable<string> {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: 'error-message',
      data: new SnackBarData(message, action, SnackBarType.ERROR),
      ...(shouldStay && { duration: Number.POSITIVE_INFINITY }),
    };

    return this.showMessage(snackBarConfig);
  }

  /**
   * Displays a Snackbar of type INFORMATION
   */
  public showInfoMessage(message: string, action?: string): Observable<string> {
    const snackBarConfig: MatSnackBarConfig = {
      panelClass: 'info-message',
      data: new SnackBarData(message, action, SnackBarType.INFORMATION),
    };

    return this.showMessage(snackBarConfig);
  }

  public dismiss(): void {
    this.snackBar.dismiss();
  }

  /**
   * opens the snackbar with the given config
   */
  private showMessage(snackBarConfig: MatSnackBarConfig): Observable<string> {
    const snackBarRef: MatSnackBarRef<SnackBarComponent> =
      this.snackBar.openFromComponent(SnackBarComponent, snackBarConfig);

    const action$ = snackBarRef.instance.action.pipe(
      tap(() => snackBarRef.dismiss()),
      mapTo('action')
    );

    const afterDismissed$ = snackBarRef
      .afterDismissed()
      .pipe(mapTo('dismissed'));

    return merge(action$, afterDismissed$).pipe(take(1));
  }
}
