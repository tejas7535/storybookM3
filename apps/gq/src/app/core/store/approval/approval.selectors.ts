import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createSelector } from '@ngrx/store';

import { approvalFeature } from './approval.reducer';

export const getApproversOfLevel = (approvalLevel: ApprovalLevel) =>
  createSelector(
    approvalFeature.selectApprovers,
    (allApprovers: Approver[]): Approver[] =>
      allApprovers.filter((item) => item.approvalLevel >= approvalLevel)
  );
