import { Component, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { Observable } from 'rxjs';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';

@Component({
  selector: 'gq-attachment-files',
  templateUrl: './attachment-files.component.html',
})
export class AttachmentFilesComponent {
  @Input() marginBottom = true;
  @Input() modalVersion = false;
  @Input() tooltipText = '';

  selectedFilesList$: Observable<string[]>;
  date = Date.now();

  constructor(private readonly dialog: MatDialog) {}

  openAddFileDialog(): void {
    this.selectedFilesList$ = this.dialog
      .open(AttachmentFilesUploadModalComponent, {
        width: '634px',
        disableClose: true,
      })
      .afterClosed();
  }
}
