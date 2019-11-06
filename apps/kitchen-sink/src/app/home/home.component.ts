import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SnackBarComponent,
  SnackBarMessageType
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private readonly snackBar: MatSnackBar) {}

  title = 'kitchen-sink';

  openSnackbar(): void {
    const snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
      panelClass: 'success-message',
      data: {
        message: `Yippi, the Snackbar works!`,
        type: SnackBarMessageType.SUCCESS
      }
    });
    snackBarRef.instance.snackBarRef = snackBarRef;
  }
}
