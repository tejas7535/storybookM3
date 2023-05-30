import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApprovalLevel, ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApprovalActions } from './approval.actions';
import { ApprovalEffects } from './approval.effects';
import { approvalFeature, initialState } from './approval.reducer';

describe('ApprovalEffects', () => {
  let action: any;
  let actions$: any;
  let effects: ApprovalEffects;
  let spectator: SpectatorService<ApprovalEffects>;
  let store: MockStore;

  let approvalService: ApprovalService;

  const createService = createServiceFactory({
    service: ApprovalEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { approval: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ApprovalEffects);
    store = spectator.inject(MockStore);

    approvalService = spectator.inject(ApprovalService);
  });

  describe('getAllApprovers', () => {
    test(
      'Should dispatch data already loaded action',
      marbles((m) => {
        store.overrideSelector(approvalFeature.selectApprovers, [
          { userId: 'schlesni' } as Approver,
          { userId: 'soehnpsc' } as Approver,
        ]);
        action = ApprovalActions.getAllApprovers();
        approvalService.getAllApprovers = jest.fn();
        const result = ApprovalActions.allApproversAlreadyLoaded();
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.getAllApprovers$).toBeObservable(expected);
        m.flush();

        expect(approvalService.getAllApprovers).not.toHaveBeenCalled();
      })
    );
    test(
      'should dispatch successAction',
      marbles((m) => {
        store.overrideSelector(approvalFeature.selectApprovers, []);
        action = ApprovalActions.getAllApprovers();
        const approvers: Approver[] = [
          { userId: 'schlesni' } as Approver,
          { userId: 'soehnpsc' } as Approver,
        ];
        const result = ApprovalActions.getAllApproversSuccess({
          approvers,
        });
        const response = m.cold('-a', {
          a: approvers,
        });
        approvalService.getAllApprovers = jest.fn(() => response);
        const expected = m.cold('-b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.getAllApprovers$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should dispatch errorAction',
      marbles((m) => {
        store.overrideSelector(approvalFeature.selectApprovers, []);
        action = ApprovalActions.getAllApprovers();
        const error = new Error('did not work');
        const result = ApprovalActions.getAllApproversFailure({ error });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        approvalService.getAllApprovers = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getAllApprovers$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('getApprovalStatusOfSapQuotation', () => {
    test(
      'Should dispatch data already loaded action',
      marbles((m) => {
        action = ApprovalActions.getApprovalStatus({ sapId: '12345' });
        store.overrideSelector(approvalFeature.selectApprovalStatus, {
          sapId: '12345',
        } as ApprovalStatus);

        approvalService.getApprovalStatus = jest.fn();
        const result = ApprovalActions.approvalStatusAlreadyLoaded();
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.getApprovalStatusOfSapQuotation$).toBeObservable(
          expected
        );
        m.flush();

        expect(approvalService.getApprovalStatus).not.toHaveBeenCalled();
      })
    );
    test(
      'should dispatch Success Action',
      marbles((m) => {
        store.overrideSelector(
          approvalFeature.selectApprovalStatus,
          initialState.approvalStatus
        );
        action = ApprovalActions.getApprovalStatus({ sapId: '12345' });
        const approvalStatus: ApprovalStatus = {
          sapId: '12345',
          approvalLevel: ApprovalLevel.L1,
          approver3Required: false,
          autoApproval: false,
          currency: 'EUR',
          deviation: 12.2,
          gpm: 13.5,
          netValue: 120_014,
        };
        const result = ApprovalActions.getApprovalStatusSuccess({
          approvalStatus,
        });
        const response = m.cold('-a', {
          a: approvalStatus,
        });
        approvalService.getApprovalStatus = jest.fn(() => response);
        const expected = m.cold('-b', { b: result });
        actions$ = m.hot('a', { a: action });
        m.expect(effects.getApprovalStatusOfSapQuotation$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    test(
      'should dispatch Success Action when approvalStatus ist undefined',
      marbles((m) => {
        store.overrideSelector(
          approvalFeature.selectApprovalStatus,
          undefined as ApprovalStatus
        );
        action = ApprovalActions.getApprovalStatus({ sapId: '12345' });
        const approvalStatus: ApprovalStatus = {
          sapId: '12345',
          approvalLevel: ApprovalLevel.L1,
          approver3Required: false,
          autoApproval: false,
          currency: 'EUR',
          deviation: 12.2,
          gpm: 13.5,
          netValue: 120_014,
        };
        const result = ApprovalActions.getApprovalStatusSuccess({
          approvalStatus,
        });
        const response = m.cold('-a', {
          a: approvalStatus,
        });
        approvalService.getApprovalStatus = jest.fn(() => response);
        const expected = m.cold('-b', { b: result });
        actions$ = m.hot('a', { a: action });
        m.expect(effects.getApprovalStatusOfSapQuotation$).toBeObservable(
          expected
        );
        m.flush();
      })
    );

    test(
      'should dispatch Success Action when different ApprovalStatus in store',
      marbles((m) => {
        store.overrideSelector(approvalFeature.selectApprovalStatus, {
          sapId: '65432',
        } as ApprovalStatus);
        action = ApprovalActions.getApprovalStatus({ sapId: '12345' });
        const approvalStatus: ApprovalStatus = {
          sapId: '12345',
          approvalLevel: ApprovalLevel.L1,
          approver3Required: false,
          autoApproval: false,
          currency: 'EUR',
          deviation: 12.2,
          gpm: 13.5,
          netValue: 120_014,
        };
        const result = ApprovalActions.getApprovalStatusSuccess({
          approvalStatus,
        });
        const response = m.cold('-a', {
          a: approvalStatus,
        });
        approvalService.getApprovalStatus = jest.fn(() => response);
        const expected = m.cold('-b', { b: result });
        actions$ = m.hot('a', { a: action });
        m.expect(effects.getApprovalStatusOfSapQuotation$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
    test(
      'should dispatch Failure Action',
      marbles((m) => {
        store.overrideSelector(
          approvalFeature.selectApprovalStatus,
          initialState.approvalStatus
        );
        action = ApprovalActions.getApprovalStatus({ sapId: '12345' });
        const error = new Error('did not work');
        const result = ApprovalActions.getApprovalStatusFailure({ error });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        approvalService.getApprovalStatus = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getApprovalStatusOfSapQuotation$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });
});
