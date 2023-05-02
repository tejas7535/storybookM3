import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createSelector } from '@ngrx/store';

import { approvalFeature, ApprovalState } from './approval.reducer';

export const getAllLevelOneApprovers = createSelector(
  approvalFeature.selectApprovalState,
  (state: ApprovalState): Approver[] =>
    state.approvers.filter(
      (item: Approver) => item.approvalLevel === ApprovalLevel.L1
    )
);

export const getAllLevelTwoApprovers = createSelector(
  approvalFeature.selectApprovalState,
  getAllLevelOneApprovers,
  (state: ApprovalState, levelOneApprovers: Approver[]): Approver[] => [
    ...levelOneApprovers,
    ...state.approvers.filter(
      (item: Approver) => item.approvalLevel === ApprovalLevel.L2
    ),
  ]
);

export const getAllLevelThreeApprovers = createSelector(
  approvalFeature.selectApprovalState,
  getAllLevelTwoApprovers,
  (state: ApprovalState, levelTwoApprovers: Approver[]): Approver[] => [
    ...levelTwoApprovers,
    ...state.approvers.filter(
      (item: Approver) => item.approvalLevel === ApprovalLevel.L3
    ),
  ]
);

export const getAllLevelFourApprovers = createSelector(
  approvalFeature.selectApprovalState,
  getAllLevelThreeApprovers,
  (state: ApprovalState, levelThreeApprovers: Approver[]): Approver[] => [
    ...levelThreeApprovers,
    ...state.approvers.filter(
      (item: Approver) => item.approvalLevel === ApprovalLevel.L4
    ),
  ]
);

export const getAllLevelFiveApprovers = createSelector(
  approvalFeature.selectApprovalState,
  getAllLevelFourApprovers,
  (state: ApprovalState, levelFourApprovers: Approver[]): Approver[] => [
    ...levelFourApprovers,
    ...state.approvers.filter(
      (item: Approver) => item.approvalLevel === ApprovalLevel.L5
    ),
  ]
);
