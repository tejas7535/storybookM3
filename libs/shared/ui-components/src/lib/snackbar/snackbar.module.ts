import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { SnackBarComponent } from './snackbar.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  entryComponents: [SnackBarComponent],
  declarations: [SnackBarComponent],
  exports: [SnackBarComponent],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
  ]
})
export class SnackBarModule {}
