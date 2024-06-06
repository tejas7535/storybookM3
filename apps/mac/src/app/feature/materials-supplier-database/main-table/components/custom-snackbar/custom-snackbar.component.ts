import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatIconModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class CustomSnackbarComponent {
  public visibleDetails = false;

  constructor(
    public snackBar: MatSnackBarRef<any>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  public hasDetail() {
    return !!this.data.detail;
  }

  public toggleDetails() {
    this.visibleDetails = !this.visibleDetails;
  }

  public close() {
    this.snackBar.dismiss();
  }

  public getItems() {
    return this.data.detail?.items ?? [];
  }
}
