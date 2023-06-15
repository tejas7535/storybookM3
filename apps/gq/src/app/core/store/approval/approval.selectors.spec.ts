import {
  ApprovalLevel,
  ApprovalStatus,
  Approver,
} from '@gq/shared/models/quotation';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks/state/approval-state.mock';
import * as fromApprovalSelector from './approval.selectors';
import { firstApproverLogic } from './constants/approvers';
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

  describe('should return ApprovalLevel', () => {
    test('should return approvalLevel for firstApprover', () => {
      expect(
        fromApprovalSelector.getApprovalLevelFirstApprover.projector({
          approvalLevel: ApprovalLevel.L1,
          thirdApproverRequired: false,
        } as ApprovalStatus)
      ).toEqual(ApprovalLevel.L1);
    });
    test('should return approvalLevel for secondApprover', () => {
      expect(
        fromApprovalSelector.getApprovalLevelSecondApprover.projector({
          approvalLevel: ApprovalLevel.L1,
          thirdApproverRequired: false,
        } as ApprovalStatus)
      ).toEqual(ApprovalLevel.L2);
    });
    test('should return approvalLevel for thirdApprover', () => {
      expect(
        fromApprovalSelector.getApprovalLevelThirdApprover.projector({
          approvalLevel: ApprovalLevel.L4,
          thirdApproverRequired: true,
        } as ApprovalStatus)
      ).toEqual(ApprovalLevel.L4);
    });
  });

  describe('should return the combination of all approvalLevels include to quotation', () => {
    test('should return string when 3rd Approver is not needed', () => {
      expect(
        fromApprovalSelector.getRequiredApprovalLevelsForQuotation.projector({
          approvalLevel: ApprovalLevel.L4,
          thirdApproverRequired: false,
        } as ApprovalStatus)
      ).toEqual(
        `${ApprovalLevel[ApprovalLevel.L4]} + ${
          ApprovalLevel[ApprovalLevel.L4]
        }`
      );
    });
    test('should return string when 3rd Approver is  needed', () => {
      expect(
        fromApprovalSelector.getRequiredApprovalLevelsForQuotation.projector({
          approvalLevel: ApprovalLevel.L4,
          thirdApproverRequired: true,
        } as ApprovalStatus)
      ).toEqual(
        `${ApprovalLevel[ApprovalLevel.L3]} + ${
          ApprovalLevel[ApprovalLevel.L4]
        } + ${ApprovalLevel[ApprovalLevel.L4]}`
      );
    });
  });

  describe('getFirstApprovers', () => {
    test('should return the approvers when 3ApproverRequired and approvalLevel is L1 (not possible)', () => {
      expect(
        fromApprovalSelector.getFirstApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            approvalLevel: ApprovalLevel.L1,
            thirdApproverRequired: true,
          } as ApprovalStatus
        )
      ).toEqual([]);
    });
    test('should return the approvers when 3ApproverRequired not and approvalLevel is L1 (would be L1)', () => {
      expect(
        fromApprovalSelector.getFirstApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: false,
            approvalLevel: ApprovalLevel.L1,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L1
        )
      );
    });
    test('should return the approvers for first when 3ApproverRequired true and approvalLevel is L5 (would be Level3)', () => {
      expect(
        fromApprovalSelector.getFirstApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L5,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L3
        )
      );
    });
  });

  describe('getSecondApprovers', () => {
    test('should return the approvers when 3ApproverRequired and approvalLevel is L1 (not possible)', () => {
      expect(
        fromApprovalSelector.getSecondApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L1,
          } as ApprovalStatus
        )
      ).toEqual([]);
    });
    test('should return the approvers when 3ApproverRequired =false and approvalLevel is L1 (would be L2)', () => {
      expect(
        fromApprovalSelector.getSecondApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: false,
            approvalLevel: ApprovalLevel.L1,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L2
        )
      );
    });
    test('should return the approvers for first when 3ApproverRequired true and approvalLevel is L5 (would be Level4)', () => {
      expect(
        fromApprovalSelector.getSecondApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L5,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L4
        )
      );
    });
  });

  describe('getThirdApprovers', () => {
    test('should return the approvers when 3ApproverRequired and approvalLevel is L1 (not possible)', () => {
      expect(
        fromApprovalSelector.getThirdApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L1,
          } as ApprovalStatus
        )
      ).toEqual([]);
    });
    test('should return the approvers when 3ApproverRequired = false and approvalLevel is L1 (would be undefined --> no 3rd Approver on Level 1)', () => {
      expect(
        fromApprovalSelector.getThirdApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: false,
            approvalLevel: ApprovalLevel.L1,
          } as ApprovalStatus
        )
      ).toEqual([]);
    });
    test('should return the approvers for first when 3ApproverRequired true and approvalLevel is L5 (would be Level5)', () => {
      expect(
        fromApprovalSelector.getThirdApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L5,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L5
        )
      );
    });

    test('should return the approvers for first when 3ApproverRequired true and approvalLevel is L4 (would be Level4)', () => {
      expect(
        fromApprovalSelector.getThirdApprovers.projector(
          APPROVAL_STATE_MOCK.approvers,
          {
            thirdApproverRequired: true,
            approvalLevel: ApprovalLevel.L4,
          } as ApprovalStatus
        )
      ).toEqual(
        APPROVAL_STATE_MOCK.approvers.filter(
          (item: Approver) => item.approvalLevel >= ApprovalLevel.L4
        )
      );
    });
  });
  describe('test the array logic', () => {
    test('should return undefined', () => {
      const result = firstApproverLogic[1][ApprovalLevel.L1];
      expect(result).toBeUndefined();
    });

    test('should return 3 for ApprovalLevel 3 when not required', () => {
      const result = firstApproverLogic[0][ApprovalLevel.L3];
      expect(result).toBe(ApprovalLevel.L3);
    });
    test('should return 2 for ApprovalLevel 3 when IS required', () => {
      const result = firstApproverLogic[1][ApprovalLevel.L3];
      expect(result).toBe(ApprovalLevel.L2);
    });
  });
});
