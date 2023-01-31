import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SelectInputModule } from '../../select-input/select-input.module';
import { SharedModule } from '../../shared.module';
import { FeedbackDialogComponent } from './feedback-dialog.component';

@NgModule({
  declarations: [FeedbackDialogComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    SelectInputModule,
    LoadingSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class FeedbackDialogModule {}
