import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
export class CustomSnackbarComponent implements OnInit {
  public visibleDetails = false;
  public items = false;

  constructor(
    private readonly snackBar: MatSnackBarRef<any>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.items = this.data.detail?.items ?? [];
  }

  public toggleDetails() {
    this.visibleDetails = !this.visibleDetails;
  }

  public close() {
    this.snackBar.dismiss();
  }
}
