import { Approver } from '@gq/shared/models/quotation/approver.model';
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

  test(
    'should provide AllApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(approvalFeature.selectApprovers, approvers);
      m.expect(service.allApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );

  test(
    'should provide LevelOneApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(
        fromApprovalSelectors.getAllLevelOneApprovers,
        approvers
      );
      m.expect(service.levelOneApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );
  test(
    'should provide LevelTwoApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(
        fromApprovalSelectors.getAllLevelTwoApprovers,
        approvers
      );
      m.expect(service.levelTwoApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );
  test(
    'should provide LevelThreeApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(
        fromApprovalSelectors.getAllLevelThreeApprovers,
        approvers
      );
      m.expect(service.levelThreeApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );
  test(
    'should provide LevelFourApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(
        fromApprovalSelectors.getAllLevelFourApprovers,
        approvers
      );
      m.expect(service.levelFourApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );
  test(
    'should provide LevelFiveApprovers',
    marbles((m) => {
      const approvers = [{ userId: 'anyUserId' } as Approver];
      mockStore.overrideSelector(
        fromApprovalSelectors.getAllLevelFiveApprovers,
        approvers
      );
      m.expect(service.levelFiveApprovers$).toBeObservable(
        m.cold('a', { a: approvers })
      );
      expect(true).toBeTruthy();
    })
  );

  test('should dispatch action', () => {
    mockStore.dispatch = jest.fn();
    service.getAllApprovers();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ApprovalActions.getAllApprovers()
    );
  });
});
