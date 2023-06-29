import {
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalStatus,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks';
import { ApprovalActions } from './approval.actions';
import { approvalFeature, initialState } from './approval.reducer';
import { firstApproverLogic } from './constants/approvers';

describe('approvalReducer', () => {
  describe('clear', () => {
    test('should clear values for approvalStatus', () => {
      const action = ApprovalActions.clearApprovalStatus();
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        approvalStatusLoading: false,
        approvalStatus: { ...initialState.approvalStatus },
      });
    });

    test('should clear values for approvalCockpit', () => {
      const action = ApprovalActions.clearApprovalCockpitData();
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        approvalCockpitLoading: false,
        approvalCockpit: { ...initialState.approvalCockpit },
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
    test('should set property when AllApprovers already loaded', () => {
      const action = ApprovalActions.allApproversAlreadyLoaded();
      const state = approvalFeature.reducer(
        { ...initialState, approversLoading: true },
        action
      );
      expect(state).toEqual({
        ...initialState,
        approversLoading: false,
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
    test('should set loading to false, when already loaded', () => {
      const action = ApprovalActions.approvalStatusAlreadyLoaded();
      const state = approvalFeature.reducer(
        { ...initialState, approvalStatusLoading: true },
        action
      );
      expect(state).toEqual({
        ...initialState,
        approvalStatusLoading: false,
      });
    });
  });

  describe('getApprovalCockpitData', () => {
    test('should set approvalCockpitLoading', () => {
      const action = ApprovalActions.getApprovalCockpitData({ sapId: '1' });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approvalCockpitLoading: true,
      });
    });

    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.getApprovalCockpitDataFailure({ error });
      const state = approvalFeature.reducer(APPROVAL_STATE_MOCK, action);
      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        approvalCockpitLoading: false,
        approvalCockpit: {
          ...initialState.approvalCockpit,
        },
        error,
      });
    });

    test('should set approvalCockpit Values', () => {
      const approvalCockpit: ApprovalCockpitData = {
        approvalGeneral: {
          sapId: '12345',
          currency: 'EUR',
          thirdApproverRequired: false,
          autoApproval: false,
          priceDeviation: 10,
          gpm: 15,
          totalNetValue: 100_000,
        } as ApprovalWorkflowInformation,
        approvalEvents: [],
      };
      const action = ApprovalActions.getApprovalCockpitDataSuccess({
        approvalCockpit,
      });
      const state = approvalFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        approvalCockpitLoading: false,
        approvalCockpit: {
          ...approvalCockpit,
        },
      });
    });

    test('should set loading to false, when already loaded', () => {
      const action = ApprovalActions.approvalCockpitDataAlreadyLoaded();
      const state = approvalFeature.reducer(
        { ...initialState, approvalCockpitLoading: true },
        action
      );
      expect(state).toEqual({
        ...initialState,
        approvalCockpitLoading: false,
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

  describe('save approval workflow information', () => {
    test('should set saveApprovalWorkflowInformationInProgress', () => {
      const action = ApprovalActions.saveApprovalWorkflowInformation({} as any);
      const state = approvalFeature.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        saveApprovalWorkflowInformationInProgress: true,
        error: undefined,
      });
    });

    test('should update the data on success', () => {
      const approvalWorkflowBaseInformation: ApprovalWorkflowBaseInformation = {
        gqId: 998_755,
        firstApprover: 'APPR1',
        secondApprover: 'APPR2',
        thirdApprover: 'APPR3',
        infoUser: 'CC00',
        comment: 'test comment',
        projectInformation: 'project info',
      };

      const action = ApprovalActions.saveApprovalWorkflowInformationSuccess({
        approvalGeneral: {
          ...initialState.approvalCockpit.approvalGeneral,
          ...approvalWorkflowBaseInformation,
        },
      });
      const state = approvalFeature.reducer(
        {
          ...APPROVAL_STATE_MOCK,
          saveApprovalWorkflowInformationInProgress: true,
          error: new Error('my error'),
        },
        action
      );

      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        saveApprovalWorkflowInformationInProgress: false,
        error: undefined,
        approvalCockpit: {
          ...APPROVAL_STATE_MOCK.approvalCockpit,
          approvalGeneral: {
            ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
            ...approvalWorkflowBaseInformation,
          },
        },
      });
    });

    test('should set the error', () => {
      const error = new Error('my error');
      const action = ApprovalActions.saveApprovalWorkflowInformationFailure({
        error,
      });
      const state = approvalFeature.reducer(
        {
          ...APPROVAL_STATE_MOCK,
          saveApprovalWorkflowInformationInProgress: true,
        },
        action
      );

      expect(state).toEqual({
        ...APPROVAL_STATE_MOCK,
        saveApprovalWorkflowInformationInProgress: false,
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
  describe('ExtraSelector', () => {
    test('should return Approvers of requested Level 3', () => {
      expect(
        approvalFeature
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
        approvalFeature
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
        approvalFeature
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
          approvalFeature.getApprovalLevelFirstApprover.projector({
            approvalLevel: ApprovalLevel.L1,
            thirdApproverRequired: false,
          } as ApprovalStatus)
        ).toEqual(ApprovalLevel.L1);
      });
      test('should return approvalLevel for secondApprover', () => {
        expect(
          approvalFeature.getApprovalLevelSecondApprover.projector({
            approvalLevel: ApprovalLevel.L1,
            thirdApproverRequired: false,
          } as ApprovalStatus)
        ).toEqual(ApprovalLevel.L2);
      });
      test('should return approvalLevel for thirdApprover', () => {
        expect(
          approvalFeature.getApprovalLevelThirdApprover.projector({
            approvalLevel: ApprovalLevel.L4,
            thirdApproverRequired: true,
          } as ApprovalStatus)
        ).toEqual(ApprovalLevel.L4);
      });
    });

    describe('should return the combination of all approvalLevels include to quotation', () => {
      test('should return string when 3rd Approver is not needed', () => {
        expect(
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector({
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
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector({
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
          approvalFeature.getFirstApprovers.projector(
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
          approvalFeature.getFirstApprovers.projector(
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
          approvalFeature.getFirstApprovers.projector(
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
          approvalFeature.getSecondApprovers.projector(
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
          approvalFeature.getSecondApprovers.projector(
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
          approvalFeature.getSecondApprovers.projector(
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
          approvalFeature.getThirdApprovers.projector(
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
          approvalFeature.getThirdApprovers.projector(
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
          approvalFeature.getThirdApprovers.projector(
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
          approvalFeature.getThirdApprovers.projector(
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
      test('should return the information from approvalCockpit', () => {
        expect(
          approvalFeature.getApprovalCockpitInformation.projector(
            APPROVAL_STATE_MOCK.approvalCockpit
          )
        ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral);
      });
      test('should return the events from approvalCockpit', () => {
        expect(
          approvalFeature.getApprovalCockpitEvents.projector(
            APPROVAL_STATE_MOCK.approvalCockpit
          )
        ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents);
      });
      describe('hasAnyWorkflowEvents', () => {
        test('should check if there are any events, return true', () => {
          expect(
            approvalFeature.getHasAnyApprovalEvent.projector(
              APPROVAL_STATE_MOCK.approvalCockpit
            )
          ).toBeTruthy();
        });
        test('should check if there are any events, return false', () => {
          expect(
            approvalFeature.getHasAnyApprovalEvent.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: [],
            })
          ).toBeFalsy();
        });
      });

      describe('getEventsAfterLastWorkflowStarted', () => {
        test('should return empty array when no events', () => {
          expect(
            approvalFeature.getEventsAfterLastWorkflowStarted.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: [],
            })
          ).toEqual([]);
        });
        test('should return empty array when events undefined', () => {
          expect(
            approvalFeature.getEventsAfterLastWorkflowStarted.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: undefined,
            })
          ).toEqual([]);
        });

        test('should return empty array when there is no start event after cancel event', () => {
          const events: ApprovalWorkflowEvent[] = [
            ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents,
            {
              event: ApprovalEventType.CANCELLED,
              eventDate: '2023-06-08T10:00:30Z',
            } as unknown as ApprovalWorkflowEvent,
          ];
          expect(
            approvalFeature.getEventsAfterLastWorkflowStarted.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: events,
            })
          ).toEqual([]);
        });
        test('should return events of active workflow, WF started after cancel, return all from started event on', () => {
          const expected = [
            {
              event: ApprovalEventType.STARTED,
              eventDate: '2023-06-08T11:00:30Z',
            } as unknown as ApprovalWorkflowEvent,
            {
              event: ApprovalEventType.APPROVED,
              eventDate: '2023-06-08T11:00:30Z',
            } as unknown as ApprovalWorkflowEvent,
          ];
          const events: ApprovalWorkflowEvent[] = [
            ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents,
            {
              event: ApprovalEventType.CANCELLED,
              eventDate: '2023-06-08T10:00:30Z',
            } as unknown as ApprovalWorkflowEvent,
            ...expected,
          ];
          expect(
            approvalFeature.getEventsAfterLastWorkflowStarted.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: events,
            })
          ).toEqual(expected);
        });
        test('should return all the events (no cancel event)', () => {
          expect(
            approvalFeature.getEventsAfterLastWorkflowStarted.projector(
              APPROVAL_STATE_MOCK.approvalCockpit
            )
          ).toEqual(
            APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents.sort((a, b) =>
              b.eventDate.localeCompare(a.eventDate)
            )
          );
        });
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

    describe('ApprovalCockpit Sub Data', () => {
      test('should information property', () => {
        expect(
          approvalFeature.getApprovalCockpitInformation.projector(
            APPROVAL_STATE_MOCK.approvalCockpit
          )
        ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral);
      });
      test('should events property', () => {
        expect(
          approvalFeature.getApprovalCockpitEvents.projector(
            APPROVAL_STATE_MOCK.approvalCockpit
          )
        ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents);
      });
    });
  });
});
