import { PositionAttachment } from '@gq/shared/services/rest/attachments/models/position-attachment.interface';
import {
  ActionCreator,
  createFeature,
  createReducer,
  on,
  ReducerTypes,
} from '@ngrx/store';

import { ActiveCaseState } from '../active-case/active-case.reducer';
import { RfqSqvCheckAttachmentsActions } from './rfq-sqv-check-attachments.actions';

const RFQ_SQV_CHECK_ATTACHMENTS_FEATURE_KEY = 'rfqSqvCheckAttachments';
export interface RfqSqvCheckAttachmentsState {
  attachmentsUploading: boolean;
  attachmentsLoading: boolean;
  attachments: PositionAttachment[];
  gqPositionId: string;
}

export const initialState: RfqSqvCheckAttachmentsState = {
  attachmentsUploading: false,
  attachmentsLoading: false,
  attachments: [],
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
      RfqSqvCheckAttachmentsActions.getAllAttachments,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsLoading: true,
        attachments: [],
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.getAllAttachmentsSuccess,
      (state, { attachments }): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsLoading: false,
        attachments,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.getAllAttachmentsFailure,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachmentsLoading: false,
      })
    ),
    on(
      RfqSqvCheckAttachmentsActions.resetAttachments,
      (state): RfqSqvCheckAttachmentsState => ({
        ...state,
        attachments: [],
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

export const UploadRfqAttachmentsSuccessReducer: ReducerTypes<
  ActiveCaseState,
  ActionCreator[]
> = on(
  RfqSqvCheckAttachmentsActions.uploadAttachmentsSuccess,
  (state, { gqPositionId, newApprovalStatus }): ActiveCaseState => ({
    ...state,
    quotation: {
      ...state.quotation,
      quotationDetails: state.quotation.quotationDetails.map((qd) => {
        if (qd.gqPositionId === gqPositionId) {
          return {
            ...qd,
            rfq4: {
              ...qd.rfq4,
              sqvApprovalStatus: newApprovalStatus,
            },
          };
        }

        return qd;
      }),
    },
  })
);
