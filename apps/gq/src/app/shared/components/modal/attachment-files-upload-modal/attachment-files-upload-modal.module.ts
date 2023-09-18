import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { DragAndDropDirective } from '@gq/shared/directives/drag-and-drop/drag-and-drop-directive';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AttachmentFilesUploadModalComponent } from './attachment-files-upload-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AttachmentFilesUploadModalComponent, DragAndDropDirective],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    DialogHeaderModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    PushPipe,
    LoadingSpinnerModule,
    MatTooltipModule,
  ],
  exports: [AttachmentFilesUploadModalComponent],
})
export class AttachmentFilesUploadModalModule {}
