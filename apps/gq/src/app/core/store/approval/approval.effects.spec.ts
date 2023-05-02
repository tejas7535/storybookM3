import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Approver } from '@gq/shared/models/quotation/approver.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ApprovalActions } from './approval.actions';
import { ApprovalEffects } from './approval.effects';
import { initialState } from './approval.reducer';
import { ApprovalService } from './approval-test.service';

describe('ApprovalEffects', () => {
  let action: any;
  let actions$: any;
  let effects: ApprovalEffects;
  let spectator: SpectatorService<ApprovalEffects>;

  // TODO: change import to correct Path
  let approvalService: ApprovalService;

  const createService = createServiceFactory({
    service: ApprovalEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { approvers: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ApprovalEffects);
    approvalService = spectator.inject(ApprovalService);
  });

  describe('getAllApprovers', () => {
    test(
      'should dispatch successAction',
      marbles((m) => {
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
});
