import { Component, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { TRANSLOCO_DATE_PIPE_CONFIG } from '@gq/process-case-view/tabs/overview-tab/components/approval-cockpit/approval-workflow-approver/consts/transloco-date-pipe-config';
import { QuotationAttachment } from '@gq/shared/models';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';

@Component({
  selector: 'gq-attachment-files',
  templateUrl: './attachment-files.component.html',
})
export class AttachmentFilesComponent {
  @Input() attachments: QuotationAttachment[];
  @Input() marginBottom = true;
  @Input() modalVersion = false;
  @Input() tooltipText = '';

  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;
  constructor(private readonly dialog: MatDialog) {}

  openAddFileDialog(): void {
    this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: { attachments: this.attachments },
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
