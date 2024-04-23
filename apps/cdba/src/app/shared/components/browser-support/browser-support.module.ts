import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BrowserSupportDetectorComponent } from './browser-support-detector/browser-support-detector.component';
import { BrowserSupportDialogComponent } from './browser-support-dialog/browser-support-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  declarations: [
    BrowserSupportDialogComponent,
    BrowserSupportDetectorComponent,
  ],
  exports: [BrowserSupportDetectorComponent],
})
export class BrowserSupportModule {}
