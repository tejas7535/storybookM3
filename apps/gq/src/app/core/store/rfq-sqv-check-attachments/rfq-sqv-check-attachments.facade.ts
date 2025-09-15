import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';
import { rfqSqvCheckAttachmentsFeature } from './rfq-sqv-check-attachments.reducer';

Injectable({
  providedIn: 'root',
});
export class RfqSqvCheckAttachmentFacade {
  private readonly store: Store = inject(Store);
  private readonly actions$: Actions = inject(Actions);

  attachmentsUploading$: Observable<boolean> = this.store.select(
    rfqSqvCheckAttachmentsFeature.selectAttachmentsUploading
  );

  attachmentsLoading$: Observable<boolean> = this.store.select(
    rfqSqvCheckAttachmentsFeature.selectAttachmentsLoading
  );

  attachments$: Observable<PositionAttachment[]> = this.store.select(
    rfqSqvCheckAttachmentsFeature.selectAttachments
  );

  uploadAttachmentsSuccess$: Observable<void> = this.actions$.pipe(
    ofType(RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess)
  );

  // #####################################################################
  // ######### methods to dispatch actions to the store ##################
  // ################################################################
  uploadAttachments(files: File[]): void {
    this.store.dispatch(
      RfqSqvCheckAttachmentsActions.uploadAttachments({ files })
    );
  }

  updateAttachments(filesToUpload: File[], fileNamesToDelete: string[]): void {
    alert(
      `'hello I update attachments', ${JSON.stringify(filesToUpload)}, ${JSON.stringify(fileNamesToDelete)}`
    );
  }

  downloadAttachments(gqPositionId: string, file?: Attachment): void {
    this.store.dispatch(
      RfqSqvCheckAttachmentsActions.downloadAttachments({
        gqPositionId,
        file,
      })
    );
  }

  getAllAttachments(gqPositionId: string): void {
    this.store.dispatch(
      RfqSqvCheckAttachmentsActions.getAllAttachments({ gqPositionId })
    );
  }

  resetAttachments(): void {
    this.store.dispatch(RfqSqvCheckAttachmentsActions.resetAttachments());
  }

  setGqPositionId(gqPositionId: string): void {
    this.store.dispatch(
      RfqSqvCheckAttachmentsActions.setGqPositionId({ gqPositionId })
    );
  }

  resetGqPositionId(): void {
    this.store.dispatch(RfqSqvCheckAttachmentsActions.resetGqPositionId());
  }
}
