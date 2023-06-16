import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

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
