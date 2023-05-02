import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';

export interface ApprovalState {
  approvers: Approver[];
  approversLoading: boolean;
  error: Error;
}

const APPROVAL_KEY = 'approval';

export const initialState: ApprovalState = {
  approvers: [],
  approversLoading: false,
  error: undefined,
};

export const approvalFeature = createFeature({
  name: APPROVAL_KEY,
  reducer: createReducer(
    initialState,
    on(
      ApprovalActions.getAllApprovers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvers: [],
        approversLoading: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getAllApproversSuccess,
      (state: ApprovalState, { approvers }): ApprovalState => ({
        ...state,
        approvers,
        approversLoading: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getAllApproversFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        approvers: [],
        approversLoading: false,
        error,
      })
    )
  ),
});
