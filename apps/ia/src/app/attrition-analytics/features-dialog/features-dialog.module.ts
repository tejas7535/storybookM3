import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { FeaturesDialogComponent } from './features-dialog.component';

@NgModule({
  declarations: [FeaturesDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatButtonModule,
    DragDropModule,
    MatSnackBarModule,
  ],
  exports: [FeaturesDialogComponent],
})
export class FeaturesDialogModule {}
