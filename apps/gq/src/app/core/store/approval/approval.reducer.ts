import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';

export interface ApprovalState {
  approvers: Approver[];
  approversLoading: boolean;
  approvalStatusLoading: boolean;
  approvalStatus: {
    sapId: string;
    currency: string;
    approvalLevel: ApprovalLevel;
    approver3Required: boolean;
    autoApproval: boolean;
    netValue: number;
    gpm: number;
    deviation: number;
  };
  error: Error;
}

const APPROVAL_KEY = 'approval';

export const initialState: ApprovalState = {
  approvers: [],
  approversLoading: false,
  approvalStatusLoading: false,
  approvalStatus: {
    sapId: undefined,
    currency: undefined,
    approvalLevel: undefined,
    approver3Required: false,
    autoApproval: false,
    netValue: undefined,
    gpm: undefined,
    deviation: undefined,
  },
  error: undefined,
};

export const approvalFeature = createFeature({
  name: APPROVAL_KEY,
  reducer: createReducer(
    initialState,
    on(
      ApprovalActions.clearApprovalStatus,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus: { ...initialState.approvalStatus },
      })
    ),
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
        approvers: approvers
          .map((item: Approver) => ({
            ...item,
            // approvalLevel comes as string from BE, so let's map ('L1' to 1)
            approvalLevel: +ApprovalLevel[item.approvalLevel],
          }))
          .sort(
            (a, b) =>
              a.approvalLevel - b.approvalLevel ||
              a.userId.localeCompare(b.userId) ||
              a.firstName?.localeCompare(b?.firstName) ||
              a.lastName?.localeCompare(b?.lastName)
          ),
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
    ),
    on(
      ApprovalActions.getApprovalStatus,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: true,
      })
    ),
    on(
      ApprovalActions.getApprovalStatusSuccess,
      (state: ApprovalState, { approvalStatus }): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus,
      })
    ),
    on(
      ApprovalActions.getApprovalStatusFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
        approvalStatus: {
          ...initialState.approvalStatus,
        },
        error,
      })
    )
  ),
});
