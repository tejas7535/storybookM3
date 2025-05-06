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
            detailCosts: {
              ...qd.detailCosts,
              sqvApprovalStatus: newApprovalStatus,
            },
          };
        }

        return qd;
      }),
    },
  })
);
