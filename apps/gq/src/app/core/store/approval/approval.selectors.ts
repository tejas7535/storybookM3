import {
  approvalLevelOfQuotationLogic,
  firstApproverLogic,
  secondApproverLogic,
  thirdApproverLogic,
} from '@gq/core/store/approval/constants/approvers';
import { ApprovalStatus } from '@gq/shared/models/quotation';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createSelector } from '@ngrx/store';

import { approvalFeature } from './approval.reducer';

export const getApproversOfLevel = (approvalLevel: ApprovalLevel) =>
  createSelector(
    approvalFeature.selectApprovers,
    (allApprovers: Approver[]): Approver[] =>
      getApproversByApprovalLevel(allApprovers, approvalLevel)
  );

// ###############################################################################################################
// ###  For approver Logic see documentation                                                                   ###
// ###  https://confluence.schaeffler.com/pages/viewpage.action?spaceKey=PARS&title=Advanced+Approval+Process  ###
// ###############################################################################################################
export const getFirstApprovers = createSelector(
  approvalFeature.selectApprovers,
  approvalFeature.selectApprovalStatus,
  (approvers: Approver[], approvalStatus: ApprovalStatus) =>
    getApproversForFirstApprover(approvers, approvalStatus)
);

export const getSecondApprovers = createSelector(
  approvalFeature.selectApprovers,
  approvalFeature.selectApprovalStatus,
  (approvers: Approver[], approvalStatus: ApprovalStatus) =>
    getApproversForSecondApprover(approvers, approvalStatus)
);

export const getThirdApprovers = createSelector(
  approvalFeature.selectApprovers,
  approvalFeature.selectApprovalStatus,
  (approvers: Approver[], approvalStatus: ApprovalStatus) =>
    getApproversForThirdApprover(approvers, approvalStatus)
);

export const getApprovalLevelFirstApprover = createSelector(
  approvalFeature.selectApprovalStatus,
  ({ approver3Required, approvalLevel }: ApprovalStatus): ApprovalLevel =>
    firstApproverLogic[+approver3Required][approvalLevel]
);

export const getApprovalLevelSecondApprover = createSelector(
  approvalFeature.selectApprovalStatus,
  ({ approver3Required, approvalLevel }: ApprovalStatus): ApprovalLevel =>
    secondApproverLogic[+approver3Required][approvalLevel]
);

export const getApprovalLevelThirdApprover = createSelector(
  approvalFeature.selectApprovalStatus,
  ({ approvalLevel }: ApprovalStatus): ApprovalLevel =>
    thirdApproverLogic[approvalLevel]
);

export const getRequiredApprovalLevelsForQuotation = createSelector(
  approvalFeature.selectApprovalStatus,
  ({ approver3Required, approvalLevel }: ApprovalStatus): string =>
    approvalLevelOfQuotationLogic[+approver3Required][approvalLevel]
);

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state {@link ApprovalState}
 * @returns the ApprovalLevel for the first Approver
 */
function getApproversForFirstApprover(
  approvers: Approver[],
  { approver3Required, approvalLevel }: ApprovalStatus
): Approver[] {
  return getApproversByApprovalLevel(
    approvers,
    firstApproverLogic[+approver3Required][approvalLevel]
  );
}

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state:ApprovalState
 * @returns the ApprovalLevel for the second Approver
 */
function getApproversForSecondApprover(
  approvers: Approver[],
  { approver3Required, approvalLevel }: ApprovalStatus
): Approver[] {
  return getApproversByApprovalLevel(
    approvers,
    secondApproverLogic[+approver3Required][approvalLevel]
  );
}

/**
 * checks in two dimensions array which ApprovalLevel is to be set
 *
 * @param  state:ApprovalState
 * @returns the ApprovalLevel for the third optional Approver
 */
function getApproversForThirdApprover(
  approvers: Approver[],
  { approver3Required, approvalLevel }: ApprovalStatus
): Approver[] {
  return approver3Required
    ? getApproversByApprovalLevel(approvers, thirdApproverLogic[approvalLevel])
    : [];
}

/**
 * Filters approvers by level
 *
 * @param approvers all approvers
 * @param level level to filter
 * @returns list of filtered approvers
 */
function getApproversByApprovalLevel(
  approvers: Approver[],
  level: ApprovalLevel
): Approver[] {
  return approvers.filter((item) => item.approvalLevel >= level);
}
