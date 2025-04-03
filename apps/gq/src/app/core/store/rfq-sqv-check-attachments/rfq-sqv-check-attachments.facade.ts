import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

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
  downloadAttachments(gqPositionId: string): void {
    this.store.dispatch(
      RfqSqvCheckAttachmentsActions.downloadAttachments({ gqPositionId })
    );
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
