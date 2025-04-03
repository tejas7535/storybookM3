import { createFeature, createReducer, on } from '@ngrx/store';

import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';

const RFQ_SQV_CHECK_ATTACHMENTS_FEATURE_KEY = 'rfqSqvCheckAttachments';
export interface RfqSqvCheckAttachmentsState {
  attachmentsUploading: boolean;
  gqPositionId: string;
}

export const initialState: RfqSqvCheckAttachmentsState = {
  attachmentsUploading: false,
  gqPositionId: undefined,
};

export const rfqSqvCheckAttachmentsFeature = createFeature({
  name: RFQ_SQV_CHECK_ATTACHMENTS_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(
      RfqSqvCheckAttachmentsActions.uploadAttachments,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsUploading: true,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsUploading: false,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.uploadAttachmentsFailure,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsUploading: false,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.setGqPositionId,
      (state, { gqPositionId }): RfqSqvCheckAttachmentsState => ({
        ...state,
        gqPositionId,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.resetGqPositionId,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        gqPositionId: undefined,
      })
    )
  ),
});
