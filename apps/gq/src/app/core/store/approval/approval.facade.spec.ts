import { of } from 'rxjs';

import * as fromActiveCaseSelectors from '@gq/core/store/active-case/active-case.selectors';
import { ActiveDirectoryUser, UpdateFunction } from '@gq/shared/models';
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
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { getUserUniqueIdentifier } from '@schaeffler/azure-auth';

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
        provide: ApprovalService,
        useValue: {
          getActiveDirectoryUsers: jest.fn(() =>
            of([
              { userId: 1 } as unknown as ActiveDirectoryUser,
              { userId: 2 } as unknown as ActiveDirectoryUser,
            ])
          ),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);

    jest.resetAllMocks();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should provide loading statuses', () => {
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
      'should provide approvalCockpitEvents$',
      marbles((m) => {
        const events = [
          {
            sapId: '12355',
            userId: 'schlesni',
            user: { userId: 'schlesni' } as Approver,
            eventDate: '2023-01-01 10:00:00',
          } as ApprovalWorkflowEvent,
          {
            sapId: '12355',
            userId: 'herpisef',
            user: { userId: 'herpisef' } as Approver,
            eventDate: '2023-01-01 10:01:00',
          } as ApprovalWorkflowEvent,
        ];
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitEvents,
          events
        );
        m.expect(service.getApprovalWorkflowEvents$).toBeObservable(
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

    test(
      'should provide error$',
      marbles((m) => {
        const error = new Error('error');
        mockStore.overrideSelector(approvalFeature.selectError, error);
        m.expect(service.error$).toBeObservable(m.cold('a', { a: error }));
      })
    );

    test(
      'should provide isLatestApprovalEventVerified$',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.isLatestApprovalEventVerified,
          true
        );

        m.expect(service.isLatestApprovalEventVerified$).toBeObservable(
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
        'should return false when workflowEvents length less than 1',
        marbles((m) => {
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            []
          );

          m.expect(service.workflowInProgress$).toBeObservable(
            m.cold('a', { a: false })
          );
        })
      );

      // TODO: uncomment when workflowInProgress is calculated by QuotationStatus
      //
      // eslint-disable-next-line jest/no-commented-out-tests
      // test(
      //   'should return false when ACTIVE',
      //   marbles((m) => {
      //     mockStore.overrideSelector(
      //       fromActiveCaseSelectors.getQuotationStatus,
      //       QuotationStatus.ACTIVE
      //     );

      //     m.expect(service.workflowInProgress$).toBeObservable(
      //       m.cold('a', { a: false })
      //     );
      //   })
      // );

      // eslint-disable-next-line jest/no-commented-out-tests
      // test(
      //   'should return true when REJECTED',
      //   marbles((m) => {
      //     mockStore.overrideSelector(
      //       fromActiveCaseSelectors.getQuotationStatus,
      //       QuotationStatus.REJECTED
      //     );

      //     m.expect(service.workflowInProgress$).toBeObservable(
      //       m.cold('a', { a: true })
      //     );
      //   })
      // );

      // eslint-disable-next-line jest/no-commented-out-tests
      // test(
      //   'should return true when IN_APPROVAL',
      //   marbles((m) => {
      //     mockStore.overrideSelector(
      //       fromActiveCaseSelectors.getQuotationStatus,
      //       QuotationStatus.IN_APPROVAL
      //     );

      //     m.expect(service.workflowInProgress$).toBeObservable(
      //       m.cold('a', { a: true })
      //     );
      //   })
      // );
    });

    describe('should provide approvalStatusOfRequestedApprover$', () => {
      test(
        'should provide empty array when approvalInformation has no approvers set',
        marbles((m) => {
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            []
          );
          mockStore.overrideSelector(
            approvalFeature.getApprovalCockpitInformation,
            {
              sapId: '1',
            } as ApprovalWorkflowInformation
          );
          mockStore.overrideSelector(approvalFeature.selectApprovers, []);
          m.expect(service.approvalStatusOfRequestedApprover$).toBeObservable(
            m.cold('a', { a: [] })
          );
          expect(true).toBeTruthy();
        })
      );
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
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 0 })
          );

          m.expect(
            service.receivedApprovalsOfRequiredApprovals$
          ).toBeObservable(m.cold('a', { a: '0/2' }));
        })
      );

      test(
        'should return the two approvers with its statuses provide 2 as  numberOfRequiredApprovals and 1 for numberOfReceivedApprovals$',
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
              event: APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
          ];

          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 1 })
          );

          m.expect(
            service.receivedApprovalsOfRequiredApprovals$
          ).toBeObservable(m.cold('a', { a: '1/2' }));
        })
      );

      test(
        'should return the two approvers with its statuses (dismiss the rejected/rejected Event!!) provide 2 as  numberOfRequiredApprovals and 0 for numberOfReceivedApprovals$',
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
              event: {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
                event: ApprovalEventType.REJECTED,
                quotationStatus: QuotationStatus.IN_APPROVAL,
              },
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
          ];

          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            [
              {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
                event: ApprovalEventType.REJECTED,
                quotationStatus: QuotationStatus.IN_APPROVAL,
              },
              APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
              APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[2],
              {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
                event: ApprovalEventType.REJECTED,
                quotationStatus: QuotationStatus.REJECTED,
              },
            ]
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 0 })
          );

          m.expect(
            service.receivedApprovalsOfRequiredApprovals$
          ).toBeObservable(m.cold('a', { a: '0/2' }));
        })
      );

      test(
        'should return the three approvers with its statuses and provide 3 as  numberOfRequiredApprovals and 1 for numberOfReceivedApprovals$',
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
              event: APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
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
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 3 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 1 })
          );

          m.expect(
            service.receivedApprovalsOfRequiredApprovals$
          ).toBeObservable(m.cold('a', { a: '1/3' }));
        })
      );

      test(
        'should return the two approvers with its statuses (no approvals), approver2 started the workflow,provide 2 as  numberOfRequiredApprovers and 0 for numberOfApproversApproved$',
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
          // ZIRKLIS  has no Event in mock, so nothing is returned
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
          const approverTwoStartedEvent = {
            userId: 'ZIRKLIS',
            event: ApprovalEventType.STARTED,
            eventDate: '2023-01-01- 10:10:00',
          } as ApprovalWorkflowEvent;
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            [approverTwoStartedEvent]
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 0 })
          );
        })
      );

      test(
        '(pre-approved) should return the two approvers with its statuses provide 2 as  numberOfRequiredApprovals and 1 for numberOfReceivedApprovals$',
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
              event: {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
                event: ApprovalEventType.PRE_APPROVED,
              },
            } as unknown as ApprovalStatusOfRequestedApprover,
            {
              approver: expectedSecondApprover,
              event: undefined,
            } as unknown as ApprovalStatusOfRequestedApprover,
          ];

          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.IN_APPROVAL
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            [
              {
                ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[0],
                event: ApprovalEventType.PRE_APPROVED,
              },
              APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[1],
              APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents[2],
            ]
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

          m.expect(service.numberOfRequiredApprovals$).toBeObservable(
            m.cold('a', { a: 2 })
          );

          m.expect(service.numberOfReceivedApprovals$).toBeObservable(
            m.cold('a', { a: 1 })
          );

          m.expect(
            service.receivedApprovalsOfRequiredApprovals$
          ).toBeObservable(m.cold('a', { a: '1/2' }));
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
            approvalFeature.getEventsOfLatestWorkflow,
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
            userId: 'schlesni',
            event: ApprovalEventType.AUTO_APPROVAL,
            eventDate: new Date('2023-12-12 14:00:00'),
          } as unknown as ApprovalWorkflowEvent;
          const approver = { userId: 'schlesni' } as Approver;
          mockStore.overrideSelector(
            fromActiveCaseSelectors.getQuotationStatus,
            QuotationStatus.APPROVED
          );
          mockStore.overrideSelector(
            approvalFeature.getEventsOfLatestWorkflow,
            [autoApprovalEvent]
          );
          mockStore.overrideSelector(approvalFeature.selectApprovers, [
            approver,
          ]);

          m.expect(service.quotationAutoApprovedEvent$).toBeObservable(
            m.cold('a', { a: { ...autoApprovalEvent, user: approver } })
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
  });

  test('should dispatch action getActiveDirectoryUsers', () => {
    const searchExpression = 'test';
    mockStore.dispatch = jest.fn();
    service.getActiveDirectoryUsers(searchExpression);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.getActiveDirectoryUsers({ searchExpression })
    );
  });

  describe('getActiveDirectoryUserByUserId', () => {
    beforeEach(() => {
      Object.defineProperty(
        service['approvalService'],
        'getActiveDirectoryUsers',
        {
          value: jest.fn(() =>
            of([
              { userId: 1 } as unknown as ActiveDirectoryUser,
              { userId: 2 } as unknown as ActiveDirectoryUser,
            ])
          ),
        }
      );
    });
    test('should call the approvalService Method', () => {
      service.getActiveDirectoryUserByUserId('1');
      expect(
        service['approvalService'].getActiveDirectoryUsers
      ).toHaveBeenCalledWith('1');
    });
    test(
      'should call the approvalService method and map the result',
      marbles((m) => {
        const result = service.getActiveDirectoryUserByUserId('1');
        m.expect(result).toBeObservable(
          m.cold('(a|)', { a: { userId: 1 } as unknown as ActiveDirectoryUser })
        );
      })
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
        const action = ApprovalActions.triggerApprovalWorkflowSuccess({
          approvalInformation: {} as ApprovalCockpitData,
        });
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
          approvalInformation: {} as any,
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

  describe('check if approval buttons should be visible', () => {
    test(
      'should not show buttons if user is not an approver',
      marbles((m) => {
        mockStore.overrideSelector(getUserUniqueIdentifier, 'someUser');
        mockStore.overrideSelector(
          approvalFeature.getNextApprover,
          undefined as string
        );

        m.expect(service.shouldShowApprovalButtons$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should not show buttons if user is not next approver',
      marbles((m) => {
        mockStore.overrideSelector(getUserUniqueIdentifier, 'someUser');
        mockStore.overrideSelector(
          approvalFeature.getNextApprover,
          'anOtherUser' as string
        );

        m.expect(service.shouldShowApprovalButtons$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should  show buttons if user is next approver',
      marbles((m) => {
        mockStore.overrideSelector(getUserUniqueIdentifier, 'someUser');
        mockStore.overrideSelector(
          approvalFeature.getNextApprover,
          'SOMEUSER' as string
        );

        m.expect(service.shouldShowApprovalButtons$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('determine approvers on the same approval step as the current user', () => {
    test(
      'should return first approvers',
      marbles((m) => {
        const firstApprover: Approver = {
          userId: 'KELLERBI',
        } as Approver;
        const secondApprover: Approver = {
          userId: 'ZIRKLIS',
        } as Approver;

        mockStore.overrideSelector(
          getUserUniqueIdentifier,
          firstApprover.userId.toLowerCase()
        );
        mockStore.overrideSelector(approvalFeature.getEventsOfLatestWorkflow, [
          {
            userId: firstApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T09:00:30Z',
          } as ApprovalWorkflowEvent,
          {
            userId: secondApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T10:00:30Z',
          } as ApprovalWorkflowEvent,
        ]);
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitInformation,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          firstApprover,
          secondApprover,
        ]);
        mockStore.overrideSelector(approvalFeature.getFirstApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          firstApprover,
        ]);

        m.expect(service.approversOnUserApprovalStep$).toBeObservable(
          m.cold('a', { a: APPROVAL_STATE_MOCK.approvers })
        );
      })
    );

    test(
      'should return second approvers',
      marbles((m) => {
        const firstApprover: Approver = {
          userId: 'KELLERBI',
        } as Approver;
        const secondApprover: Approver = {
          userId: 'ZIRKLIS',
        } as Approver;

        mockStore.overrideSelector(
          getUserUniqueIdentifier,
          secondApprover.userId
        );
        mockStore.overrideSelector(approvalFeature.getEventsOfLatestWorkflow, [
          {
            userId: firstApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T09:00:30Z',
          } as ApprovalWorkflowEvent,
          {
            userId: secondApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T11:00:30Z',
          } as ApprovalWorkflowEvent,
        ]);
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitInformation,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          firstApprover,
          secondApprover,
        ]);
        mockStore.overrideSelector(approvalFeature.getSecondApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          secondApprover,
        ]);

        m.expect(service.approversOnUserApprovalStep$).toBeObservable(
          m.cold('a', { a: APPROVAL_STATE_MOCK.approvers })
        );
      })
    );

    test(
      'should return third approvers',
      marbles((m) => {
        const firstApprover: Approver = {
          userId: 'KELLERBI',
        } as Approver;
        const secondApprover: Approver = {
          userId: 'ZIRKLIS',
        } as Approver;
        const thirdApprover: Approver = {
          userId: 'TSTUSR',
        } as Approver;
        const mockState: ApprovalState = {
          ...APPROVAL_STATE_MOCK,
          approvalCockpit: {
            ...APPROVAL_STATE_MOCK.approvalCockpit,
            approvalGeneral: {
              ...APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral,
              thirdApproverRequired: true,
              thirdApprover: thirdApprover.userId,
            },
            approvalEvents: [
              {
                userId: firstApprover.userId,
                event: ApprovalEventType.APPROVED,
                eventDate: '2023-06-08T09:00:30Z',
              } as ApprovalWorkflowEvent,
              {
                userId: secondApprover.userId,
                event: ApprovalEventType.APPROVED,
                eventDate: '2023-06-08T11:00:30Z',
              } as ApprovalWorkflowEvent,
              {
                userId: thirdApprover.userId,
                event: ApprovalEventType.APPROVED,
                eventDate: '2023-06-08T12:00:30Z',
              } as ApprovalWorkflowEvent,
            ],
          },
        };

        mockStore.overrideSelector(
          getUserUniqueIdentifier,
          thirdApprover.userId
        );
        mockStore.overrideSelector(
          approvalFeature.getEventsOfLatestWorkflow,
          mockState.approvalCockpit.approvalEvents
        );
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitInformation,
          mockState.approvalCockpit.approvalGeneral
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          firstApprover,
          secondApprover,
          thirdApprover,
        ]);
        mockStore.overrideSelector(approvalFeature.getThirdApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          thirdApprover,
        ]);

        m.expect(service.approversOnUserApprovalStep$).toBeObservable(
          m.cold('a', { a: APPROVAL_STATE_MOCK.approvers })
        );
      })
    );

    test(
      'should return empty list',
      marbles((m) => {
        const firstApprover: Approver = {
          userId: 'KELLERBI',
        } as Approver;
        const secondApprover: Approver = {
          userId: 'ZIRKLIS',
        } as Approver;

        mockStore.overrideSelector(getUserUniqueIdentifier, 'noApprover');
        mockStore.overrideSelector(approvalFeature.getEventsOfLatestWorkflow, [
          {
            userId: firstApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T09:00:30Z',
          } as ApprovalWorkflowEvent,
          {
            userId: secondApprover.userId,
            event: ApprovalEventType.APPROVED,
            eventDate: '2023-06-08T11:00:30Z',
          } as ApprovalWorkflowEvent,
        ]);
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitInformation,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, [
          ...APPROVAL_STATE_MOCK.approvers,
          firstApprover,
          secondApprover,
        ]);

        m.expect(service.approversOnUserApprovalStep$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );
  });
  describe('provide quotationFinalReleaseEvent$', () => {
    test(
      'should provide undefined when quotationStatus is not Approved',
      marbles((m) => {
        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.IN_APPROVAL
        );
        mockStore.overrideSelector(
          approvalFeature.getEventsOfLatestWorkflow,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
        );

        m.expect(service.quotationFinalReleaseEvent$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
    test(
      'should provide undefined when no final released Event present',
      marbles((m) => {
        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.APPROVED
        );
        mockStore.overrideSelector(
          approvalFeature.getEventsOfLatestWorkflow,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
        );

        m.expect(service.quotationFinalReleaseEvent$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
    test(
      'should provide the finalReleasedEvent when present',
      marbles((m) => {
        const releasedEvent = {
          userId: 'schlesni',
          event: ApprovalEventType.RELEASED,
          eventDate: 'a date string',
        } as ApprovalWorkflowEvent;
        const approver = { userId: 'schlesni' } as Approver;
        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.APPROVED
        );
        mockStore.overrideSelector(approvalFeature.getEventsOfLatestWorkflow, [
          ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents,
          releasedEvent,
        ]);
        mockStore.overrideSelector(approvalFeature.selectApprovers, [approver]);

        m.expect(service.quotationFinalReleaseEvent$).toBeObservable(
          m.cold('a', { a: { ...releasedEvent, user: approver } })
        );
      })
    );
  });

  describe('provide quotationRejectedEvent$', () => {
    test(
      'should provide undefined when QuotationStatus is not rejected',
      marbles((m) => {
        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.IN_APPROVAL
        );
        mockStore.overrideSelector(
          approvalFeature.getEventsOfLatestWorkflow,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, []);

        m.expect(service.quotationRejectedEvent$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
    test(
      'should provide undefined when no rejected Event present',
      marbles((m) => {
        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.REJECTED
        );
        mockStore.overrideSelector(
          approvalFeature.getEventsOfLatestWorkflow,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, []);

        m.expect(service.quotationRejectedEvent$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
    test(
      'should provide the quotationRejectedEvent when present',
      marbles((m) => {
        const approver: Approver = {
          userId: 'schlesni',
          firstName: 'Stefanie',
          lastName: 'Schleer',
        } as Approver;
        const rejectedEvent = {
          event: ApprovalEventType.REJECTED,
          userId: 'schlesni',
          eventDate: 'a date string',
        } as ApprovalWorkflowEvent;

        mockStore.overrideSelector(
          fromActiveCaseSelectors.getQuotationStatus,
          QuotationStatus.REJECTED
        );
        mockStore.overrideSelector(approvalFeature.getEventsOfLatestWorkflow, [
          ...APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents,
          rejectedEvent,
        ]);
        mockStore.overrideSelector(approvalFeature.selectApprovers, [approver]);

        m.expect(service.quotationRejectedEvent$).toBeObservable(
          m.cold('a', {
            a: { ...rejectedEvent, eventDate: 'a date string', user: approver },
          })
        );
      })
    );
  });

  describe('provide quotationCancelledEvent', () => {
    test(
      'should provide undefined, when no such event',
      marbles((m) => {
        mockStore.overrideSelector(
          approvalFeature.getApprovalCockpitEvents,
          APPROVAL_STATE_MOCK.approvalCockpit.approvalEvents
        );
        mockStore.overrideSelector(approvalFeature.selectApprovers, []);

        m.expect(service.quotationCancelledEvent$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
    test(
      'should provide the cancelled event',
      marbles((m) => {
        const approver = {
          userId: 'schlesni',
          firstName: 'Stefanie',
          lastName: 'Schleer',
        } as Approver;
        const cancelEvent = {
          userId: 'schlesni',
          event: ApprovalEventType.CANCELLED,
          eventDate: 'a date string',
          user: approver,
        } as ApprovalWorkflowEvent;

        mockStore.overrideSelector(approvalFeature.getApprovalCockpitEvents, [
          cancelEvent,
        ]);
        mockStore.overrideSelector(approvalFeature.selectApprovers, [approver]);

        m.expect(service.quotationCancelledEvent$).toBeObservable(
          m.cold('a', {
            a: { ...cancelEvent, user: approver, eventDate: 'a date string' },
          })
        );
      })
    );
  });

  describe('stopApprovalCockpitDataPolling', () => {
    test('should stop polling if it is running', () => {
      mockStore.overrideSelector(
        approvalFeature.selectPollingApprovalCockpitDataInProgress,
        true
      );

      mockStore.dispatch = jest.fn();
      service.stopApprovalCockpitDataPolling();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        ApprovalActions.stopPollingApprovalCockpitData()
      );
    });

    test('should not dispatch stopPollingApprovalCockpitData if polling is not running', () => {
      mockStore.overrideSelector(
        approvalFeature.selectPollingApprovalCockpitDataInProgress,
        false
      );

      mockStore.dispatch = jest.fn();
      service.stopApprovalCockpitDataPolling();

      expect(mockStore.dispatch).not.toHaveBeenCalledWith(
        ApprovalActions.stopPollingApprovalCockpitData()
      );
    });
  });
});
