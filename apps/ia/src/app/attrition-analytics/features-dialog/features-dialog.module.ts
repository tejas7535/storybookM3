import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FeaturesDialogComponent } from './features-dialog.component';

@NgModule({
  declarations: [FeaturesDialogComponent],
  entryComponents: [FeaturesDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatButtonModule,
    DragDropModule,
  ],
  exports: [FeaturesDialogComponent],
})
export class FeaturesDialogModule {}
