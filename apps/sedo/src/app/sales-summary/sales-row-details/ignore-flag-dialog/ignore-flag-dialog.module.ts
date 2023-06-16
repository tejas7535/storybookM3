import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { IgnoreFlagDialogComponent } from './ignore-flag-dialog.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule],
  declarations: [IgnoreFlagDialogComponent],
  exports: [IgnoreFlagDialogComponent],
})
export class IgnoreFlagDialogModule {}
