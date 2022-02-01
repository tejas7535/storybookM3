import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
