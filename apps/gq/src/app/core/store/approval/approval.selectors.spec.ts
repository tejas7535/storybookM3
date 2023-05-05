import { ApprovalLevel } from '@gq/shared/models/quotation';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks/state/approval-state.mock';
import * as fromApprovalSelector from './approval.selectors';
describe('ApprovalSelectors', () => {
  test('should return Approvers of requested Level 3', () => {
    expect(
      fromApprovalSelector
        .getApproversOfLevel(ApprovalLevel.L3)
        .projector(APPROVAL_STATE_MOCK.approvers)
    ).toEqual([
      ...APPROVAL_STATE_MOCK.approvers.filter(
        (item) =>
          item.approvalLevel !== ApprovalLevel.L1 &&
          item.approvalLevel !== ApprovalLevel.L2
      ),
    ]);
  });

  test('should return Approvers of requested Level 4', () => {
    expect(
      fromApprovalSelector
        .getApproversOfLevel(ApprovalLevel.L4)
        .projector(APPROVAL_STATE_MOCK.approvers)
    ).toEqual([
      ...APPROVAL_STATE_MOCK.approvers.filter(
        (item) =>
          item.approvalLevel === ApprovalLevel.L4 ||
          item.approvalLevel === ApprovalLevel.L5
      ),
    ]);
  });

  test('should return Approvers of requested Level 1 and check for sorting', () => {
    expect(
      fromApprovalSelector
        .getApproversOfLevel(ApprovalLevel.L1)
        .projector(APPROVAL_STATE_MOCK.approvers)
    ).toEqual([
      {
        userId: 'herpisef',
        firstName: 'Stefan',
        lastName: 'Herpich',
        approvalLevel: 1,
      },
      {
        userId: 'herpiseg',
        firstName: 'Franz',
        lastName: 'Albert',
        approvalLevel: 1,
      },
      {
        userId: 'herpiseg',
        firstName: 'Stefan',
        lastName: 'Albert',
        approvalLevel: 1,
      },
      {
        userId: 'schlesni',
        firstName: 'Stefanie',
        lastName: 'Schleer',
        approvalLevel: 2,
      },
      {
        userId: 'fischjny',
        firstName: 'Jenny',
        lastName: 'Fischer',
        approvalLevel: 3,
      },
      {
        userId: 'soehnpsc',
        firstName: 'Pascal',
        lastName: 'Soehnlein',
        approvalLevel: 4,
      },
      {
        userId: 'anyId',
        firstName: 'Jan',
        lastName: 'Schmitt',
        approvalLevel: 5,
      },
    ]);
  });
});
