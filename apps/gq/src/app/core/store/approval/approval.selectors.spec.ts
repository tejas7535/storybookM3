import { ApprovalLevel } from '@gq/shared/models/quotation';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks/state/approval-state.mock';
import { ApprovalState } from './approval.reducer';
import * as fromApprovalSelector from './approval.selectors';
describe('ApprovalSelectors', () => {
  const fakeState: ApprovalState = APPROVAL_STATE_MOCK;

  test('ShouldSelectLevelOneApprovers', () => {
    const expectedList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) => item.approvalLevel === ApprovalLevel.L1
    );
    expect(
      fromApprovalSelector.getAllLevelOneApprovers.projector(fakeState)
    ).toEqual(expectedList);
  });
  test('ShouldSelectLevelTwoApprovers', () => {
    const levelOneList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) => item.approvalLevel === ApprovalLevel.L1
    );
    const expectedList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2
    );
    expect(
      fromApprovalSelector.getAllLevelTwoApprovers.projector(
        fakeState,
        levelOneList
      )
    ).toEqual(expectedList);
  });
  test('ShouldSelectLevelThreeApprovers', () => {
    const levelTwoList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2
    );

    const expectedList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2 ||
        item.approvalLevel === ApprovalLevel.L3
    );
    expect(
      fromApprovalSelector.getAllLevelThreeApprovers.projector(
        fakeState,
        levelTwoList
      )
    ).toEqual(expectedList);
  });
  test('ShouldSelectLevelFourApprovers', () => {
    const levelThreeList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2 ||
        item.approvalLevel === ApprovalLevel.L3
    );
    const expectedList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2 ||
        item.approvalLevel === ApprovalLevel.L3 ||
        item.approvalLevel === ApprovalLevel.L4
    );
    expect(
      fromApprovalSelector.getAllLevelFourApprovers.projector(
        fakeState,
        levelThreeList
      )
    ).toEqual(expectedList);
  });

  test('ShouldSelectLevelFiveApprovers', () => {
    const levelFourList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2 ||
        item.approvalLevel === ApprovalLevel.L3 ||
        item.approvalLevel === ApprovalLevel.L4
    );
    const expectedList = APPROVAL_STATE_MOCK.approvers.filter(
      (item) =>
        item.approvalLevel === ApprovalLevel.L1 ||
        item.approvalLevel === ApprovalLevel.L2 ||
        item.approvalLevel === ApprovalLevel.L3 ||
        item.approvalLevel === ApprovalLevel.L4 ||
        item.approvalLevel === ApprovalLevel.L5
    );
    expect(
      fromApprovalSelector.getAllLevelFiveApprovers.projector(
        fakeState,
        levelFourList
      )
    ).toEqual(expectedList);
  });
});
