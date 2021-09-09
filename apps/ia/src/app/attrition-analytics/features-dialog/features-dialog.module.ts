import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { FeaturesDialogComponent } from './features-dialog.component';

@NgModule({
  declarations: [FeaturesDialogComponent],
  entryComponents: [FeaturesDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    SharedTranslocoModule,
    MatButtonModule,
    DragDropModule,
    SnackBarModule,
    MatSnackBarModule,
  ],
  exports: [FeaturesDialogComponent],
  providers: [SnackBarService],
})
export class FeaturesDialogModule {}
