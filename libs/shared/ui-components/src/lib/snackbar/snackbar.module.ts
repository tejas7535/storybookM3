import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SnackBarComponent } from './snackbar.component';

@NgModule({
  imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
  entryComponents: [SnackBarComponent],

  declarations: [SnackBarComponent],
  exports: [SnackBarComponent]
})
export class SnackBarModule {}
