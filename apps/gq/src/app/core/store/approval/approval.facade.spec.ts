import { ApprovalLevel } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { APPROVAL_STATE_MOCK } from '../../../../../src/testing/mocks';
import { ApprovalActions } from './approval.actions';
import { ApprovalFacade } from './approval.facade';
import { approvalFeature } from './approval.reducer';
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
  describe('should return expected Observables$', () => {
    beforeEach(() => {
      mockStore.overrideSelector(
        approvalFeature.selectApprovers,
        APPROVAL_STATE_MOCK.approvers
      );
    });
    const levelOneApproverResult: Approver[] =
      APPROVAL_STATE_MOCK.approvers.sort(
        (a, b) =>
          a.approvalLevel - b.approvalLevel ||
          a.userId.localeCompare(b.userId) ||
          a.firstName.localeCompare(b.firstName) ||
          a.lastName.localeCompare(b.lastName)
      );

    const levelTwoApproverResult: Approver[] = [
      ...APPROVAL_STATE_MOCK.approvers
        .filter((item) => item.approvalLevel !== ApprovalLevel.L1)
        .sort(
          (a, b) =>
            a.approvalLevel - b.approvalLevel ||
            a.userId.localeCompare(b.userId) ||
            a.firstName.localeCompare(b.firstName) ||
            a.lastName.localeCompare(b.lastName)
        ),
    ];
    const levelThreeApproverResult: Approver[] = [
      ...APPROVAL_STATE_MOCK.approvers.filter(
        (item) =>
          item.approvalLevel !== ApprovalLevel.L1 &&
          item.approvalLevel !== ApprovalLevel.L2
      ),
    ];
    const levelFourApproverResult: Approver[] = [
      ...APPROVAL_STATE_MOCK.approvers.filter(
        (item) =>
          item.approvalLevel === ApprovalLevel.L4 ||
          item.approvalLevel === ApprovalLevel.L5
      ),
    ];
    const levelFiveApproverResult: Approver[] = [
      ...APPROVAL_STATE_MOCK.approvers.filter(
        (item) => item.approvalLevel === ApprovalLevel.L5
      ),
    ];

    test(
      'should provide LevelOneApprovers',
      marbles((m) => {
        m.expect(service.levelOneApprovers$).toBeObservable(
          m.cold('a', { a: levelOneApproverResult })
        );
        expect(true).toBeTruthy();
      })
    );
    test(
      'should provide LevelTwoApprovers',
      marbles((m) => {
        m.expect(service.levelTwoApprovers$).toBeObservable(
          m.cold('a', { a: levelTwoApproverResult })
        );
        expect(true).toBeTruthy();
      })
    );
    test(
      'should provide LevelThreeApprovers',
      marbles((m) => {
        m.expect(service.levelThreeApprovers$).toBeObservable(
          m.cold('a', { a: levelThreeApproverResult })
        );
        expect(true).toBeTruthy();
      })
    );
    test(
      'should provide LevelFourApprovers',
      marbles((m) => {
        m.expect(service.levelFourApprovers$).toBeObservable(
          m.cold('a', { a: levelFourApproverResult })
        );
        expect(true).toBeTruthy();
      })
    );
    test(
      'should provide LevelFiveApprovers',
      marbles((m) => {
        m.expect(service.levelFiveApprovers$).toBeObservable(
          m.cold('a', { a: levelFiveApproverResult })
        );
        expect(true).toBeTruthy();
      })
    );
  });

  test('should dispatch action', () => {
    mockStore.dispatch = jest.fn();
    service.getApprovers();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.getAllApprovers()
    );
  });
});
