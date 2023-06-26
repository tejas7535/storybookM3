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
          thirdApproverRequired: false,
          autoApproval: false,
          totalNetValue: undefined,
          gpm: undefined,
          priceDeviation: undefined,
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
          thirdApproverRequired: false,
          autoApproval: false,
          totalNetValue: undefined,
          gpm: undefined,
          priceDeviation: undefined,
        },
        error,
      });
    });

    test('should set approvalStatus Values', () => {
      const approvalStatus: ApprovalStatus = {
        sapId: '12345',
        currency: 'EUR',
        approvalLevel: ApprovalLevel.L2,
        thirdApproverRequired: false,
        autoApproval: false,
        priceDeviation: 10,
        gpm: 15,
        totalNetValue: 100_000,
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

  describe('active directory users', () => {
    test('should set activeDirectoryUsersLoading', () => {
      const action = ApprovalActions.getActiveDirectoryUsers({
        searchExpression: 'test',
      });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        activeDirectoryUsersLoading: true,
      });
    });
    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.getActiveDirectoryUsersFailure({ error });
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        activeDirectoryUsers: [],
        activeDirectoryUsersLoading: false,
        error,
      });
    });
    test('Should set users', () => {
      const action = ApprovalActions.getActiveDirectoryUsersSuccess({
        activeDirectoryUsers: APPROVAL_STATE_MOCK.activeDirectoryUsers,
      });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        activeDirectoryUsersLoading: false,
        activeDirectoryUsers: APPROVAL_STATE_MOCK.activeDirectoryUsers,
      });
    });
    test('Should clear users', () => {
      const action = ApprovalActions.clearActiveDirectoryUsers();
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        activeDirectoryUsers: [],
      });
    });
  });

  describe('trigger approval workflow', () => {
    test('should set triggerApprovalWorkflowInProgress', () => {
      const action = ApprovalActions.triggerApprovalWorkflow({} as any);
      const state = approvalFeature.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        triggerApprovalWorkflowInProgress: true,
        error: undefined,
      });
    });

    test('should reset triggerApprovalWorkflowInProgress', () => {
      const action = ApprovalActions.triggerApprovalWorkflowSuccess();
      const state = approvalFeature.reducer(
        {
          ...initialState,
          triggerApprovalWorkflowInProgress: true,
          error: new Error('my error'),
        },
        action
      );

      expect(state).toEqual({
        ...initialState,
        triggerApprovalWorkflowInProgress: false,
        error: undefined,
      });
    });

    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.triggerApprovalWorkflowFailure({ error });
      const state = approvalFeature.reducer(
        { ...APPROVAL_STATE_MOCK, triggerApprovalWorkflowInProgress: true },
        action
      );

      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        triggerApprovalWorkflowInProgress: false,
        error,
      });
    });
  });

  describe('update approval workflow', () => {
    test('should set updateApprovalWorkflowInProgress', () => {
      const action = ApprovalActions.updateApprovalWorkflow({} as any);
      const state = approvalFeature.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        updateApprovalWorkflowInProgress: true,
        error: undefined,
      });
    });

    test('should reset updateApprovalWorkflowInProgress', () => {
      const action = ApprovalActions.updateApprovalWorkflowSuccess({
        approvalEvent: {} as any,
      });
      const state = approvalFeature.reducer(
        {
          ...initialState,
          updateApprovalWorkflowInProgress: true,
          error: new Error('my error'),
        },
        action
      );

      expect(state).toEqual({
        ...initialState,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
      });
    });

    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.updateApprovalWorkflowFailure({ error });
      const state = approvalFeature.reducer(
        { ...APPROVAL_STATE_MOCK, updateApprovalWorkflowInProgress: true },
        action
      );

      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        updateApprovalWorkflowInProgress: false,
        error,
      });
    });
  });
});
