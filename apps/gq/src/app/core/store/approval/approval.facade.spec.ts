import * as fromActiveCaseSelectors from '@gq/core/store/active-case/active-case.selectors';
import { UpdateFunction } from '@gq/shared/models';
import {
  ApprovalCockpitData,
  ApprovalEventType,
  ApprovalLevel,
  ApprovalStatusOfRequestedApprover,
  ApprovalWorkflowEvent,
  ApprovalWorkflowInformation,
  Approver,
} from '@gq/shared/models/approval';
import { QuotationStatus } from '@gq/shared/models/quotation';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { APPROVAL_STATE_MOCK } from '../../../../testing/mocks';
import { ApprovalActions } from './approval.actions';
import { ApprovalFacade } from './approval.facade';
import { approvalFeature, ApprovalState } from './approval.reducer';
describe('ApprovalFacade', () => {
  let service: ApprovalFacade;
  let spectator: SpectatorService<ApprovalFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: ApprovalFacade,
    providers: [
      provideMockStore({}),
      provideMockActions(() => actions$),
      {
        provide: TransformationService,
        useValue: {
          transformDate: jest.fn(() => 'any Date'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should provide loading statuses', () => {
    test(
      'should provide approvalStatusLoading',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectApprovalStatusLoading,
          false
        );
        m.expect(service.approvalStatusLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should provide allApproversLoading',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectApproversLoading,
          false
        );
        m.expect(service.allApproversLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should provide activeDirectoryUsersLoading',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectActiveDirectoryUsersLoading,
          false
        );
        m.expect(service.activeDirectoryUsersLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should provide triggerApprovalWorkflowInProgress',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectTriggerApprovalWorkflowInProgress,
          true
        );
        m.expect(service.triggerApprovalWorkflowInProgress$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    test(
      'should provide saveApprovalWorkflowInformationInProgress',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectSaveApprovalWorkflowInformationInProgress,
          true
        );
        m.expect(
          service.saveApprovalWorkflowInformationInProgress$
        ).toBeObservable(m.cold('a', { a: true }));
      })
    );

    test(
      'should provide updateApprovalWorkflowInProgress',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectUpdateApprovalWorkflowInProgress,
          true
        );
        m.expect(service.updateApprovalWorkflowInProgress$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
    test(
      'should provide approvalCockpitLoading',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.selectApprovalCockpitLoading,
          false
        );
        m.expect(service.approvalCockpitLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

  describe('Should provide the list for approvers', () => {
    test(
      'should provide firstApprovers',
      marbles((m) => {
        const approverList: Approver[] = [{} as Approver];
        mockStore.overrideSelector(
          approvalFeature.getFirstApprovers,
          approverList
        );
        m.expect(service.firstApprovers$).toBeObservable(
          m.cold('a', { a: approverList })
        );
      })
    );
    test(
      'should provide secondApprovers',
      marbles((m) => {
        const approverList: Approver[] = [{} as Approver];
        mockStore.overrideSelector(
          approvalFeature.getSecondApprovers,
          approverList
        );
        m.expect(service.secondApprovers$).toBeObservable(
          m.cold('a', { a: approverList })
        );
      })
    );
    test(
      'should provide thirdApprovers',
      marbles((m) => {
        const approverList: Approver[] = [{} as Approver];
        mockStore.overrideSelector(
          approvalFeature.getThirdApprovers,
          approverList
        );
        m.expect(service.thirdApprovers$).toBeObservable(
          m.cold('a', { a: approverList })
        );
      })
    );
  });

  describe('Should provide approval Levels', () => {
    test(
      'should provide Observable for approvalLevel firstApprover',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getApprovalLevelFirstApprover,
          ApprovalLevel.L1
        );
        m.expect(service.approvalLevelFirstApprover$).toBeObservable(
          m.cold('a', { a: ApprovalLevel.L1 })
        );
      })
    );
    test(
      'should provide Observable for approvalLevel secondApprover',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getApprovalLevelSecondApprover,
          ApprovalLevel.L1
        );
        m.expect(service.approvalLevelSecondApprover$).toBeObservable(
          m.cold('a', { a: ApprovalLevel.L1 })
        );
      })
    );
    test(
      'should provide Observable for approvalLevel thirdApprover',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getApprovalLevelThirdApprover,
          ApprovalLevel.L1
        );
        m.expect(service.approvalLevelThirdApprover$).toBeObservable(
          m.cold('a', { a: ApprovalLevel.L1 })
        );
      })
    );
  });

  describe('should provide the approvalLevel string', () => {
    test(
      'should provide Observable for approvalLevelIncludedToQuotation',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getRequiredApprovalLevelsForQuotation,
          'a string'
        );
        m.expect(service.requiredApprovalLevelsForQuotation$).toBeObservable(
          m.cold('a', { a: 'a string' })
        );
      })
    );
  });

  test(
    'should provide active directory users',
    marbles((m) => {
      mockStore.overrideSelector(
        approvalFeature.selectActiveDirectoryUsers,
        APPROVAL_STATE_MOCK.activeDirectoryUsers
      );
      m.expect(service.activeDirectoryUsers$).toBeObservable(
        m.cold('a', { a: APPROVAL_STATE_MOCK.activeDirectoryUsers })
      );
    })
  );

  test('should dispatch action getAllApprovers', () => {
    mockStore.dispatch = jest.fn();
    service.getApprovers();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.getAllApprovers()
    );
  });

  test(
    'should provide QuotationStatus',
    marbles((m) => {
      mockStore.overrideSelector(
        fromActiveCaseSelectors.getQuotationStatus,
        QuotationStatus.APPROVED
      );
      m.expect(service.quotationStatus$).toBeObservable(
        m.cold('a', { a: QuotationStatus.APPROVED })
      );
    })
  );
  describe('Should provide approvalCockpit Data', () => {
    test(
      'should provide approvalCockpit',
      marbles((m) => {
        const cockpit = {
          approvalGeneral: { sapId: '12345' },
          approvalEvents: [],
        } as ApprovalCockpitData;
        mockStore.overrideSelector(
          approvalFeature.selectApprovalCockpit,
          cockpit
        );
        m.expect(service.approvalCockpit$).toBeObservable(
          m.cold('a', { a: cockpit })
        );
      })
    );

    test(
      'should provide approvalCockpit.information',
      marbles((m) => {
        const information = { sapId: '12345' } as ApprovalWorkflowInformation;
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitInformation,
          information
        );
        m.expect(service.approvalCockpitInformation$).toBeObservable(
          m.cold('a', { a: information })
        );
      })
    );

    test(
      'should provide approvalCockpit.events',
      marbles((m) => {
        const events = [{ sapId: '12345' } as ApprovalWorkflowEvent];
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitEvents,
          events
        );
        m.expect(service.approvalCockpitEvents$).toBeObservable(
          m.cold('a', { a: events })
        );
      })
    );

    test(
      'should provide hasAnyApprovalEvents$',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getHasAnyApprovalEvent,
          true
        );
        m.expect(service.hasAnyApprovalEvent$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );

    describe('should provide quotationFullyApproved$', () => {
      test(
        'should return false for quotationFullyApproved$ when ACTIVE',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.ACTIVE
          );

          m.expect(service.quotationFullyApproved$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );
      test(
        'should return true for quotationFullyApproved$ when APPROVED',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.APPROVED
          );

          m.expect(service.quotationFullyApproved$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
    });

    describe('should provide workflowInProgress$', () => {
      test(
        'should return false when ACTIVE',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.ACTIVE
          );

          m.expect(service.workflowInProgress$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );
      test(
        'should return true when REJECTED',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.REJECTED
          );

          m.expect(service.workflowInProgress$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );

      test(
        'should return true when IN_APPROVAL',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );

          m.expect(service.workflowInProgress$).toBeObservable(
            m.cold('a', { a: true })
          );
        })
      );
    });

    describe('should provide approvalStatusOfRequestedApprover$', () => {
      test(
        'should return the two approvers with its statuses(no approvals ) provide 2 as  numberOfRequiredApprovers and 0 for numberOfApproversApproved$',
        marbles((m) => {
          const expectedFirstApprover: Approver = {
            userId: 'KELLERBI',
            firstName: 'firstName KELLERBI',
            lastName: 'lastName KELLERBI',
          } as Approver;
          const expectedSecondApprover: Approver = {
            userId: 'ZIRKLIS',
            firstName: 'firstName ZIRKLIS',
            lastName: 'lastName ZIRKLIS',
          } as Approver;
          // expected Result: KELLERBI has an Event present in mock
          // ZIRKLIS has no Event in mock, so nothing is returned
          const expectedResult: ApprovalStatusOfRequestedApprover[] = [
            {
              approver: expectedFirstApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
          ];

          mockStore.overrideSelector(
            approvalFeature.getEventsAfterLastWorkflowStarted,
            []
          );
          mockStore.overrideSelector(
            approvalFeature.getApprovalCockpitInformation,
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
          );
          mockStore.overrideSelector(approvalFeature.selectApprovers, [
            expectedFirstApprover,
            expectedSecondApprover,
          ]);

          m.expect(service.approvalStatusOfRequestedApprover$).toBeObservable(
            m.cold('a', { a: expectedResult })
          );

          m.expect(service.numberOfRequiredApprovers$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfApproversApproved$).toBeObservable(
            m.cold('a', { a: 0 })
          );
        })
      );

      test(
        'should return the two approvers with its statuses provide 2 as  numberOfRequiredApprovers and 1 for numberOfApproversApproved$',
        marbles((m) => {
          const expectedFirstApprover: Approver = {
            userId: 'KELLERBI',
            firstName: 'firstName KELLERBI',
            lastName: 'lastName KELLERBI',
          } as Approver;
          const expectedSecondApprover: Approver = {
            userId: 'ZIRKLIS',
            firstName: 'firstName ZIRKLIS',
            lastName: 'lastName ZIRKLIS',
          } as Approver;
          // expected Result: KELLERBI has an Event present in mock
          // ZIRKLIS has no Event in mock, so nothing is returned
          const expectedResult: ApprovalStatusOfRequestedApprover[] = [
            {
              approver: expectedFirstApprover,
              event: APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
          ];

          mockStore.overrideSelector(
            approvalFeature.getEventsAfterLastWorkflowStarted,
            APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
          );
          mockStore.overrideSelector(
            approvalFeature.getApprovalCockpitInformation,
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
          );
          mockStore.overrideSelector(approvalFeature.selectApprovers, [
            expectedFirstApprover,
            expectedSecondApprover,
          ]);

          m.expect(service.approvalStatusOfRequestedApprover$).toBeObservable(
            m.cold('a', { a: expectedResult })
          );

          m.expect(service.numberOfRequiredApprovers$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfApproversApproved$).toBeObservable(
            m.cold('a', { a: 1 })
          );
        })
      );

      test(
        'should return the three approvers with its statuses and provide 3 as  numberOfRequiredApprovers and 1 for numberOfApproversApproved$',
        marbles((m) => {
          const secondApproverEvent: ApprovalWorkflowEvent = {
            userId: 'ZIRKLIS',
            event: ApprovalEventType.REJECTED,
          } as ApprovalWorkflowEvent;
          const mockState: ApprovalState = {
            ...APPROVAL_STATE_MOCK,
            approvalCockpit: {
              ...APPROVAL_STATE_MOCK.approvalCockpit,
              approvalGeneral: {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
                thirdApproverRequired: true,
                thirdApprover: 'schlesni',
              },
              approvalEvents: [
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents,
                secondApproverEvent,
              ],
            },
          };
          const expectedFirstApprover: Approver = {
            userId: 'KELLERBI',
            firstName: 'firstName KELLERBI',
            lastName: 'lastName KELLERBI',
          } as Approver;
          const expectedSecondApprover: Approver = {
            userId: 'ZIRKLIS',
            firstName: 'firstName ZIRKLIS',
            lastName: 'lastName ZIRKLIS',
          } as Approver;

          // expected Result: KELLERBI has an Event (APPROVED) present in mock
          // ZIRKLIS has Event in mock, (REJECTED)
          // schlesni has no Event in mock, so nothing is returned
          const expectedResult: ApprovalStatusOfRequestedApprover[] = [
            {
              approver: expectedFirstApprover,
              event: APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: secondApproverEvent,
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: { userId: 'schlesni', firstName: 'schlesni' },
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
            // third Approver not listed as Approver
          ];

          mockStore.overrideSelector(
            approvalFeature.getEventsAfterLastWorkflowStarted,
            mockState.approvalCockpit.approvalEvents
          );
          mockStore.overrideSelector(
            approvalFeature.getApprovalCockpitInformation,
            mockState.approvalCockpit.approvalGeneral
          );
          mockStore.overrideSelector(approvalFeature.selectApprovers, [
            expectedFirstApprover,
            expectedSecondApprover,
          ]);

          m.expect(service.approvalStatusOfRequestedApprover$).toBeObservable(
            m.cold('a', { a: expectedResult })
          );

          m.expect(service.numberOfRequiredApprovers$).toBeObservable(
            m.cold('a', { a: 3 })
          );

          m.expect(service.numberOfApproversApproved$).toBeObservable(
            m.cold('a', { a: 1 })
          );
        })
      );
    });

    describe('should provide quotationAutoApprovedEvent$', () => {
      test(
        'should return undefined, Quotation not approved',
        marbles((m) => {
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsAfterLastWorkflowStarted,
            APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
          );

          m.expect(service.quotationAutoApprovedEvent$).toBeObservable(
            m.cold('a', { a: undefined })
          );
        })
      );

      test(
        'should return the AutoApprovalEvent',
        marbles((m) => {
          const autoApprovalEvent: ApprovalWorkflowEvent = {
            event: ApprovalEventType.AUTO_APPROVAL,
            eventDate: new Date('2023-12-12 14:00:00'),
          } as unknown as ApprovalWorkflowEvent;
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.APPROVED
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsAfterLastWorkflowStarted,
            [autoApprovalEvent]
          );

          m.expect(service.quotationAutoApprovedEvent$).toBeObservable(
            m.cold('a', { a: { ...autoApprovalEvent, eventDate: 'any Date' } })
          );
        })
      );
    });
  });

  describe('Methods', () => {
    test('should dispatch action getAllApprovers', () => {
      mockStore.dispatch = jest.fn();
      service.getApprovers();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.getAllApprovers()
      );
    });

    test('should dispatch action getApprovalStatus', () => {
      mockStore.dispatch = jest.fn();
      service.getApprovalStatus(expect.any(String));
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.getApprovalStatus({ sapId: expect.any(String) })
      );
    });

    test('should dispatch action clearApprovalStatus', () => {
      mockStore.dispatch = jest.fn();

      service.getApprovalStatus(undefined as string);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.clearApprovalStatus()
      );
    });

    test('should dispatch action getApprovalCockpitData', () => {
      mockStore.dispatch = jest.fn();
      service.getApprovalCockpitData(expect.any(String));
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.getApprovalCockpitData({ sapId: expect.any(String) })
      );
    });

    test('should dispatch action clearApprovalCockpitData', () => {
      mockStore.dispatch = jest.fn();

      service.getApprovalCockpitData(undefined as string);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.clearApprovalCockpitData()
      );
    });

    test('should call methods', () => {
      service.getApprovers = jest.fn();
      service.getApprovalStatus = jest.fn();
      service.getApprovalCockpitData = jest.fn();

      service.getAllApprovalData(expect.any(String));

      expect(service.getApprovers).toHaveBeenCalled();
      expect(service.getApprovalStatus).toHaveBeenCalled();
      expect(service.getApprovalCockpitData).toHaveBeenCalled();
    });

    test('should call methods for approvalOverview', () => {
      service.getApprovalStatus = jest.fn();
      service.getApprovalCockpitData = jest.fn();
      service.getApprovalCockpitData = jest.fn();

      service.getAllApprovalData(expect.any(String));

      expect(service.getApprovalStatus).toHaveBeenCalled();
      expect(service.getApprovalCockpitData).toHaveBeenCalled();
      expect(service.getApprovalCockpitData).toHaveBeenCalled();
    });
  });

  test('should dispatch action getActiveDirectoryUsers', () => {
    const searchExpression = 'test';
    mockStore.dispatch = jest.fn();
    service.getActiveDirectoryUsers(searchExpression);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.getActiveDirectoryUsers({ searchExpression })
    );
  });

  test('should dispatch action clearActiveDirectoryUsers', () => {
    mockStore.dispatch = jest.fn();
    service.clearActiveDirectoryUsers();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.clearActiveDirectoryUsers()
    );
  });

  describe('trigger approval workflow', () => {
    test('should dispatch action triggerApprovalWorkflow', () => {
      const approvalWorkflowData = {
        firstApprover: 'APPR1',
        secondApprover: 'APPR2',
        thirdApprover: 'APPR3',
        infoUser: 'CC00',
        comment: 'test comment',
        projectInformation: 'project info',
      };

      mockStore.dispatch = jest.fn();
      service.triggerApprovalWorkflow(approvalWorkflowData);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.triggerApprovalWorkflow({ approvalWorkflowData })
      );
    });

    test(
      'should succeed',
      marbles((m) => {
        const action = ApprovalActions.triggerApprovalWorkflowSuccess();
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(service.triggerApprovalWorkflowSucceeded$).toBeObservable(
          expected as any
        );
      })
    );
  });

  describe('save approval workflow information', () => {
    test('should dispatch action saveApprovalWOrkflowInformation', () => {
      const approvalWorkflowInformation = {
        firstApprover: 'APPR1',
        secondApprover: 'APPR2',
        thirdApprover: 'APPR3',
        infoUser: 'CC00',
        comment: 'test comment',
        projectInformation: 'project info',
      };

      mockStore.dispatch = jest.fn();
      service.saveApprovalWorkflowInformation(approvalWorkflowInformation);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.saveApprovalWorkflowInformation({
          approvalWorkflowInformation,
        })
      );
    });

    test(
      'should succeed',
      marbles((m) => {
        const action = ApprovalActions.saveApprovalWorkflowInformationSuccess(
          {} as any
        );
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(
          service.saveApprovalWorkflowInformationSucceeded$
        ).toBeObservable(expected as any);
      })
    );
  });

  describe('update approval workflow', () => {
    test('should dispatch action updateApprovalWorkflow', () => {
      const updateApprovalWorkflowData = {
        comment: 'test comment',
        updateFunction: UpdateFunction.REJECT_QUOTATION,
      };

      mockStore.dispatch = jest.fn();
      service.updateApprovalWorkflow(updateApprovalWorkflowData);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.updateApprovalWorkflow({ updateApprovalWorkflowData })
      );
    });

    test(
      'should succeed',
      marbles((m) => {
        const action = ApprovalActions.updateApprovalWorkflowSuccess({
          approvalEvent: {} as any,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(service.updateApprovalWorkflowSucceeded$).toBeObservable(
          expected as any
        );
      })
    );
  });
});
