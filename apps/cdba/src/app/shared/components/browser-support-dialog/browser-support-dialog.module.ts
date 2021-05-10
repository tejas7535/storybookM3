import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@cdba/shared';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserSupportDialogComponent } from './browser-support-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  declarations: [BrowserSupportDialogComponent],
  exports: [BrowserSupportDialogComponent],
})
export class BrowserSupportDialogModule {}
