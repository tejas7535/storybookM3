import { ApprovalLevel, Approver } from '@gq/shared/models/quotation';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApprovalActions } from './approval.actions';
import { ApprovalFacade } from './approval.facade';
import { approvalFeature } from './approval.reducer';
import * as fromApprovalSelectors from './approval.selectors';
describe('ApprovalFacade', () => {
  let service: ApprovalFacade;
  let spectator: SpectatorService<ApprovalFacade>;
  let mockStore: MockStore;

  const createService = createServiceFactory({
    service: ApprovalFacade,
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    mockStore = spectator.inject(MockStore);
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
  });

  describe('Should provide the list for approvers', () => {
    test(
      'should provide firstApprovers',
      marbles((m) => {
        const approverList: Approver[] = [{} as Approver];
        mockStore.overrideSelector(
          fromApprovalSelectors.getFirstApprovers,
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
          fromApprovalSelectors.getSecondApprovers,
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
          fromApprovalSelectors.getThirdApprovers,
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
          fromApprovalSelectors.getApprovalLevelFirstApprover,
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
          fromApprovalSelectors.getApprovalLevelSecondApprover,
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
          fromApprovalSelectors.getApprovalLevelThirdApprover,
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
          fromApprovalSelectors.getRequiredApprovalLevelsForQuotation,
          'a string'
        );
        m.expect(service.requiredApprovalLevelsForQuotation$).toBeObservable(
          m.cold('a', { a: 'a string' })
        );
      })
    );
  });

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

  test('should call mehtods', () => {
    service.getApprovers = jest.fn();
    service.getApprovalStatus = jest.fn();

    service.getApprovalWorkflowData(expect.any(String));

    expect(service.getApprovers).toHaveBeenCalled();
    expect(service.getApprovalStatus).toHaveBeenCalled();
  });
});
