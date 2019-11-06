import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from '@angular/material/snack-bar';

export enum SnackBarMessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  NOTIFICATION = 'information'
}

export interface SnackBarData {
  message: string;
  type: SnackBarMessageType;
}

@Component({
  selector: 'schaeffler-snackbar',
  styleUrls: ['snackbar.component.scss'],
  templateUrl: 'snackbar.component.html'
})
export class SnackBarComponent {
  public iconMap: Map<string, string> = new Map([
    ['success', 'icon-toast-success'],
    ['error', 'icon-toast-error'],
    ['warning', 'icon-toast-warning'],
    ['information', 'icon-toast-information']
  ]);
  public snackBarRef: MatSnackBarRef<SnackBarComponent>;
  public message: string;
  public type: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {
    this.message = data.message ? data.message : '';
    this.type = data.type ? data.type : SnackBarMessageType.NOTIFICATION;
  }

  /**
   * Closes the snackbar if an instance is given
   */
  public dismissSnackBar(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
}
