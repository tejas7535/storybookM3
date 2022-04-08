import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { translate } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private readonly snackBar: MatSnackBar) {}

  public openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  public openGenericSnackBar(): void {
    this.openSnackBar(translate('error.content'), translate('error.confirm'));
  }
}
