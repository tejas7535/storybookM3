import { ApprovalLevel, ApprovalStatus } from '@gq/shared/models/quotation';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks';
import { ApprovalActions } from './approval.actions';
import { approvalFeature, initialState } from './approval.reducer';

describe('approvalReducer', () => {
  describe('clear ApprovalStatus', () => {
    test('should clear values for approvalStatus', () => {
      const action = ApprovalActions.clearApprovalStatus();
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
      });
    });
  });

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
    test('Should set approvers', () => {
      const action = ApprovalActions.getAllApproversSuccess({
        approvers: APPROVAL_STATE_MOCK.approvers,
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
        approvalStatus: {
          ...approvalStatus,
          approvalLevel: ApprovalLevel.L2,
        },
      });
    });
  });

  describe('cast approval Level', () => {
    test('should cast the enum', () => {
      const result = +ApprovalLevel['L1'];
      expect(result).toBe(ApprovalLevel.L1);
    });
  });
});
