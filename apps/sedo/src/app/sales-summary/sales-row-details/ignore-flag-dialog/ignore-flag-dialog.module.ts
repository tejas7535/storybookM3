import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { IgnoreFlagDialogComponent } from './ignore-flag-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule],
  declarations: [IgnoreFlagDialogComponent],
  exports: [IgnoreFlagDialogComponent],
})
export class IgnoreFlagDialogModule {}
