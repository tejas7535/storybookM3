import { ApprovalLevel, ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks';
import { ApprovalActions } from './approval.actions';
import { approvalFeature, initialState } from './approval.reducer';

describe('approvalReducer', () => {
  describe('GetAllApprover', () => {
    test('should set approversLoading', () => {
      const action = ApprovalActions.getAllApprovers();
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approversLoading: true,
      });
    });
    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.getAllApproversFailure({ error });
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        approvers: [],
        approversLoading: false,
        error,
      });
    });
    test('Should set approvers with sorted and mapped entries', () => {
      const unsortedFromBE: Approver[] = [
        {
          userId: 'soehnpsc',
          firstName: 'Pascal',
          lastName: 'Soehnlein',
          approvalLevel: 'L4' as unknown as ApprovalLevel,
        },

        {
          userId: 'herpiseg',
          firstName: 'Franz',
          lastName: 'Albert',
          approvalLevel: 'L1' as unknown as ApprovalLevel,
        },
        {
          userId: 'herpisef',
          firstName: 'Stefan',
          lastName: 'Herpich',
          approvalLevel: 'L1' as unknown as ApprovalLevel,
        },
        {
          userId: 'herpiseg',
          firstName: 'Stefan',
          lastName: 'Albert',
          approvalLevel: 'L1' as unknown as ApprovalLevel,
        },

        {
          userId: 'fischjny',
          firstName: 'Jenny',
          lastName: 'Fischer',
          approvalLevel: 'L3' as unknown as ApprovalLevel,
        },

        {
          userId: 'anyId',
          firstName: 'Jan',
          lastName: 'Schmitt',
          approvalLevel: 'L5' as unknown as ApprovalLevel,
        },
        {
          userId: 'schlesni',
          firstName: 'Stefanie',
          lastName: 'Schleer',
          approvalLevel: 'L2' as unknown as ApprovalLevel,
        },
      ];
      const action = ApprovalActions.getAllApproversSuccess({
        approvers: unsortedFromBE,
      });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approversLoading: false,
        approvers: APPROVAL_STATE_MOCK.approvers,
      });
    });
  });

  describe('getApprovalStatus', () => {
    test('should set approvalStatusLoading', () => {
      const action = ApprovalActions.getApprovalStatus({ sapId: '1' });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approvalStatusLoading: true,
      });
    });

    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.getApprovalStatusFailure({ error });
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
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
        error,
      });
    });

    test('should set approvalStatus Values', () => {
      const approvalStatus: ApprovalStatus = {
        sapId: '12345',
        currency: 'EUR',
        approvalLevel: ApprovalLevel.L2,
        approver3Required: false,
        autoApproval: false,
        deviation: 10,
        gpm: 15,
        netValue: 100_000,
      };
      const action = ApprovalActions.getApprovalStatusSuccess({
        approvalStatus,
      });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approvalStatusLoading: false,
        approvalStatus,
      });
    });
  });
});
