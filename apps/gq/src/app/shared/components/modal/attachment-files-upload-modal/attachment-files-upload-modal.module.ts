import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { DragAndDropDirective } from '@gq/shared/directives/drag-and-drop/drag-and-drop-directive';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AttachmentFilesUploadModalComponent } from './attachment-files-upload-modal.component';

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
