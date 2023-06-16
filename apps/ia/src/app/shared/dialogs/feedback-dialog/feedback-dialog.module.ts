import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

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
