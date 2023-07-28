import {
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalWorkflowBaseInformation,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
  Quotation,
  QuotationStatus,
} from '@gq/shared/models';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks';
import { ApprovalActions } from './approval.actions';
import { approvalFeature, initialState } from './approval.reducer';
import { firstApproverLogic } from './constants/approvers';

describe('approvalReducer', () => {
  describe('clear', () => {
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

    test('should update approval information and reset triggerApprovalWorkflowInProgress on success', () => {
      const approvalInformation: ApprovalCockpitData = {
        ...APPROVAL_STATE_MOCK.approvalCockpit,
      };

      const action = ApprovalActions.triggerApprovalWorkflowSuccess({
        approvalInformation,
      });
      const existingEvent = {
        comment: 'a event already in store',
      } as ApprovalWorkflowEvent;
      const state = approvalFeature.reducer(
        {
          ...initialState,
          approvalCockpit: {
            approvalGeneral: initialState.approvalCockpit.approvalGeneral,
            approvalEvents: [existingEvent],
          },
          triggerApprovalWorkflowInProgress: true,
          error: new Error('my error'),
        },
        action
      );

      expect(state).toEqual({
        ...initialState,
        approvalCockpit: {
          ...approvalInformation,
          approvalEvents: [
            ...approvalInformation.approvalEvents,
            existingEvent,
          ],
        },
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

    test('should reset updateApprovalWorkflowInProgress and add the new event to the existing ones in reverse order', () => {
      const currentApprovalEvent: ApprovalWorkflowEvent = {
        sapId: 'sapTestId',
        gqId: 123,
        event: ApprovalEventType.STARTED,
        comment: 'test comment',
        userId: 'tesUser',
        quotationStatus: QuotationStatus.ACTIVE,
        verified: true,
        eventDate: '01-02-2023',
        user: undefined,
      };

      const approvalEvent: ApprovalWorkflowEvent = {
        sapId: 'sapTestId2',
        gqId: 123_456,
        event: ApprovalEventType.APPROVED,
        comment: 'test comment 2',
        userId: 'tesUser2',
        quotationStatus: QuotationStatus.APPROVED,
        verified: false,
        eventDate: '01-02-2023',
        user: undefined,
      };

      const action = ApprovalActions.updateApprovalWorkflowSuccess({
        approvalEvent,
      });

      const state = approvalFeature.reducer(
        {
          ...initialState,
          updateApprovalWorkflowInProgress: true,
          error: new Error('my error'),
          approvalCockpit: {
            ...initialState.approvalCockpit,
            approvalEvents: [currentApprovalEvent],
          },
        },
        action
      );

      expect(state).toEqual({
        ...initialState,
        updateApprovalWorkflowInProgress: false,
        error: undefined,
        approvalCockpit: {
          ...initialState.approvalCockpit,
          approvalEvents: [approvalEvent, currentApprovalEvent],
        },
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
            approvalGeneral: {
              approvalLevel: ApprovalLevel.L1,
              thirdApproverRequired: false,
            },
          } as ApprovalCockpitData)
        ).toEqual(ApprovalLevel.L1);
      });
      test('should return approvalLevel for secondApprover', () => {
        expect(
          approvalFeature.getApprovalLevelSecondApprover.projector({
            approvalGeneral: {
              approvalLevel: ApprovalLevel.L1,
              thirdApproverRequired: false,
            },
          } as ApprovalCockpitData)
        ).toEqual(ApprovalLevel.L2);
      });
      test('should return approvalLevel for thirdApprover', () => {
        expect(
          approvalFeature.getApprovalLevelThirdApprover.projector({
            approvalGeneral: {
              approvalLevel: ApprovalLevel.L4,
              thirdApproverRequired: true,
            },
          } as ApprovalCockpitData)
        ).toEqual(ApprovalLevel.L4);
      });
    });

    describe('should return the combination of all approvalLevels include to quotation', () => {
      test('should return string when 3rd Approver is not needed', () => {
        expect(
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector(
            { sapId: '124' } as Quotation,
            {
              approvalGeneral: {
                approvalLevel: ApprovalLevel.L4,
                thirdApproverRequired: false,
              },
            } as ApprovalCockpitData
          )
        ).toEqual(
          `${ApprovalLevel[ApprovalLevel.L4]} + ${
            ApprovalLevel[ApprovalLevel.L4]
          }`
        );
      });
      test('should return string when 3rd Approver is  needed', () => {
        expect(
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector(
            { sapId: '124' } as Quotation,
            {
              approvalGeneral: {
                approvalLevel: ApprovalLevel.L4,
                thirdApproverRequired: true,
              },
            } as ApprovalCockpitData
          )
        ).toEqual(
          `${ApprovalLevel[ApprovalLevel.L3]} + ${
            ApprovalLevel[ApprovalLevel.L4]
          } + ${ApprovalLevel[ApprovalLevel.L4]}`
        );
      });
      test('should return empty string when when quotation has no SAP id', () => {
        expect(
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector(
            {} as Quotation,
            {
              approvalGeneral: {
                approvalLevel: ApprovalLevel.L4,
                thirdApproverRequired: true,
              },
            } as ApprovalCockpitData
          )
        ).toEqual('');
      });
      test('should return empty string when when no ApprovalData for SAPId', () => {
        expect(
          approvalFeature.getRequiredApprovalLevelsForQuotation.projector(
            { sapId: '123' } as Quotation,
            {} as ApprovalCockpitData
          )
        ).toEqual('');
      });
    });

    describe('getFirstApprovers', () => {
      test('should return the approvers when 3ApproverRequired and approvalLevel is L1 (not possible)', () => {
        expect(
          approvalFeature.getFirstApprovers.projector(
            APPROVAL_STATE_MOCK.approvers,
            {
              approvalGeneral: {
                approvalLevel: ApprovalLevel.L1,
                thirdApproverRequired: true,
              },
            } as ApprovalCockpitData
          )
        ).toEqual([]);
      });
      test('should return the approvers when 3ApproverRequired not and approvalLevel is L1 (would be L1)', () => {
        expect(
          approvalFeature.getFirstApprovers.projector(
            APPROVAL_STATE_MOCK.approvers,
            {
              approvalGeneral: {
                thirdApproverRequired: false,
                approvalLevel: ApprovalLevel.L1,
              },
            } as ApprovalCockpitData
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
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L5,
              },
            } as ApprovalCockpitData
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
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L1,
              },
            } as ApprovalCockpitData
          )
        ).toEqual([]);
      });
      test('should return the approvers when 3ApproverRequired =false and approvalLevel is L1 (would be L2)', () => {
        expect(
          approvalFeature.getSecondApprovers.projector(
            APPROVAL_STATE_MOCK.approvers,
            {
              approvalGeneral: {
                thirdApproverRequired: false,
                approvalLevel: ApprovalLevel.L1,
              },
            } as ApprovalCockpitData
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
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L5,
              },
            } as ApprovalCockpitData
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
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L1,
              },
            } as ApprovalCockpitData
          )
        ).toEqual([]);
      });
      test('should return the approvers when 3ApproverRequired = false and approvalLevel is L1 (would be undefined --> no 3rd Approver on Level 1)', () => {
        expect(
          approvalFeature.getThirdApprovers.projector(
            APPROVAL_STATE_MOCK.approvers,
            {
              approvalGeneral: {
                thirdApproverRequired: false,
                approvalLevel: ApprovalLevel.L1,
              },
            } as ApprovalCockpitData
          )
        ).toEqual([]);
      });
      test('should return the approvers for first when 3ApproverRequired true and approvalLevel is L5 (would be Level5)', () => {
        expect(
          approvalFeature.getThirdApprovers.projector(
            APPROVAL_STATE_MOCK.approvers,
            {
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L5,
              },
            } as ApprovalCockpitData
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
              approvalGeneral: {
                thirdApproverRequired: true,
                approvalLevel: ApprovalLevel.L4,
              },
            } as ApprovalCockpitData
          )
        ).toEqual(
          APPROVAL_STATE_MOCK.approvers.filter(
            (item: Approver) => item.approvalLevel >= ApprovalLevel.L4
          )
        );
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
            approvalFeature.getEventsOfLatestWorkflow.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: [],
            })
          ).toEqual([]);
        });
        test('should return empty array when events undefined', () => {
          expect(
            approvalFeature.getEventsOfLatestWorkflow.projector({
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
            approvalFeature.getEventsOfLatestWorkflow.projector({
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
            approvalFeature.getEventsOfLatestWorkflow.projector({
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalEvents: events,
            })
          ).toEqual(expected);
        });
        test('should return all the events (no cancel event)', () => {
          expect(
            approvalFeature.getEventsOfLatestWorkflow.projector(
              APPROVAL_STATE_MOCK.approvalCockpit
            )
          ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents);
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
      test('should return the information from approvalCockpit', () => {
        expect(
          approvalFeature.getApprovalCockpitInformation.projector(
            APPROVAL_STATE_MOCK.approvalCockpit
          )
        ).toEqual(APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral);
      });
      // Selector maps the user, but these users do not exists in approvers list
      test('should return the events from approvalCockpit', () => {
        const firstEvent =
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0];
        const secondEvent =
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1];
        const thirdEvent =
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[2];

        const expected: ApprovalWorkflowEvent[] = [
          {
            ...firstEvent,
            user: {
              userId: firstEvent.userId,
              firstName: firstEvent.userId,
            } as Approver,
          },
          {
            ...secondEvent,
            user: {
              userId: secondEvent.userId,
              firstName: secondEvent.userId,
            } as Approver,
          },
          {
            ...thirdEvent,
            user: {
              userId: thirdEvent.userId,
              firstName: thirdEvent.userId,
            } as Approver,
          },
        ];
        expect(
          approvalFeature.getApprovalCockpitEvents.projector(
            APPROVAL_STATE_MOCK.approvalCockpit,
            APPROVAL_STATE_MOCK.approvers
          )
        ).toEqual(expected);
      });
    });
  });
});
