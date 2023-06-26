import { ActiveDirectoryUser } from '@gq/shared/models';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ApprovalActions } from './approval.actions';

export interface ApprovalState {
  approvers: Approver[];
  activeDirectoryUsers: ActiveDirectoryUser[];
  approversLoading: boolean;
  activeDirectoryUsersLoading: boolean;
  approvalStatusLoading: boolean;
  approvalStatus: {
    sapId: string;
    currency: string;
    approvalLevel: ApprovalLevel;
    thirdApproverRequired: boolean;
    autoApproval: boolean;
    totalNetValue: number;
    gpm: number;
    priceDeviation: number;
  };
  triggerApprovalWorkflowInProgress: boolean;
  updateApprovalWorkflowInProgress: boolean;
  error: Error;
}

const APPROVAL_KEY = 'approval';

export const initialState: ApprovalState = {
  approvers: [],
  activeDirectoryUsers: [],
  approversLoading: false,
  activeDirectoryUsersLoading: false,
  approvalStatusLoading: false,
  approvalStatus: {
    sapId: undefined,
    currency: undefined,
    approvalLevel: undefined,
    thirdApproverRequired: false,
    autoApproval: false,
    totalNetValue: undefined,
    gpm: undefined,
    priceDeviation: undefined,
  },
  triggerApprovalWorkflowInProgress: false,
  updateApprovalWorkflowInProgress: false,
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
        approversLoading: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.allApproversAlreadyLoaded,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approversLoading: false,
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
    ),
    on(
      ApprovalActions.getApprovalStatus,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: true,
      })
    ),
    on(
      ApprovalActions.approvalStatusAlreadyLoaded,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        approvalStatusLoading: false,
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
    ),
    on(
      ApprovalActions.getActiveDirectoryUsers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        activeDirectoryUsersLoading: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getActiveDirectoryUsersSuccess,
      (state: ApprovalState, { activeDirectoryUsers }): ApprovalState => ({
        ...state,
        activeDirectoryUsers,
        activeDirectoryUsersLoading: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.getActiveDirectoryUsersFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        activeDirectoryUsersLoading: false,
        activeDirectoryUsers: [],
        error,
      })
    ),
    on(
      ApprovalActions.clearActiveDirectoryUsers,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        activeDirectoryUsers: [],
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflow,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflowSuccess,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.triggerApprovalWorkflowFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        triggerApprovalWorkflowInProgress: false,
        error,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflow,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: true,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflowSuccess,
      (state: ApprovalState): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
      })
    ),
    on(
      ApprovalActions.updateApprovalWorkflowFailure,
      (state: ApprovalState, { error }): ApprovalState => ({
        ...state,
        updateApprovalWorkflowInProgress: false,
        error,
      })
    )
  ),
});
