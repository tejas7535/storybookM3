import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { getIsQuotationStatusActive } from '@gq/core/store/active-case/active-case.selectors';
import { TRANSLOCO_DATE_PIPE_CONFIG } from '@gq/process-case-view/tabs/overview-tab/components/approval-cockpit/approval-workflow-approver/consts/transloco-date-pipe-config';
import { QuotationAttachment } from '@gq/shared/models';
import { Store } from '@ngrx/store';

import { AttachmentFilesUploadModalComponent } from '../modal/attachment-files-upload-modal/attachment-files-upload-modal.component';
import { DeletingAttachmentModalComponent } from '../modal/delete-attachment-modal/delete-attachment-modal.component';
@Component({
  selector: 'gq-attachment-files',
  templateUrl: './attachment-files.component.html',
  standalone: false,
})
export class AttachmentFilesComponent implements OnInit {
  @Input() attachments: QuotationAttachment[];
  @Input() marginBottom = true;
  @Input() modalVersion = false;
  @Input() tooltipText = '';
  @Input() workflowInProgress: boolean;
  @Input() quotationFullyApproved: boolean;

  quotationActive$: Observable<boolean>;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;
  constructor(
    private readonly dialog: MatDialog,
    public readonly activeCaseFacade: ActiveCaseFacade,
    private readonly store: Store
  ) {}
  ngOnInit(): void {
    this.quotationActive$ = this.store.select(getIsQuotationStatusActive);
  }

  openAddFileDialog(): void {
    this.dialog.open(AttachmentFilesUploadModalComponent, {
      width: '634px',
      disableClose: true,
      data: { attachments: this.attachments },
    });
  }

  openConfirmDeleteAttachmentDialog(attachment: QuotationAttachment): void {
    this.dialog.open(DeletingAttachmentModalComponent, {
      width: '634px',
      disableClose: true,
      data: { attachment },
    });
  }

  downloadAttachment(attachment: QuotationAttachment): void {
    this.activeCaseFacade.downloadAttachment(attachment);
  }
}
