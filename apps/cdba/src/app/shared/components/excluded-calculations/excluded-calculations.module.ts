import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ExcludedCalculationsButtonComponent } from './excluded-calculations-button/excluded-calculations-button.component';
import { ExcludedCalculationsDialogComponent } from './excluded-calculations-dialog/excluded-calculations-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,

    SharedTranslocoModule,
  ],
  declarations: [
    ExcludedCalculationsButtonComponent,
    ExcludedCalculationsDialogComponent,
  ],
  exports: [ExcludedCalculationsButtonComponent],
})
export class ExcludedCalculationsModule {}
