import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DeletingAttachmentModalComponent } from './delete-attachment-modal.component';

@NgModule({
  declarations: [DeletingAttachmentModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    DialogHeaderModule,
    MatButtonModule,
    SharedTranslocoModule,
    PushPipe,
    LoadingSpinnerModule,
  ],
  exports: [DeletingAttachmentModalComponent],
})
export class DeletingAttachmentModalModule {}
