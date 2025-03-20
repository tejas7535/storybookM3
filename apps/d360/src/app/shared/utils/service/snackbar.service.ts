import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  public openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 5000
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, action, {
      duration,
    });
  }
}
