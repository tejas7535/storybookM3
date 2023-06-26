import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { ProcessCaseRoutePath } from '@gq/process-case-view/process-case-route-path.enum';
import {
  ActiveDirectoryUser,
  ApprovalEvent,
  UpdateFunction,
} from '@gq/shared/models';
import { ApprovalLevel, ApprovalStatus } from '@gq/shared/models/quotation';
import { Approver } from '@gq/shared/models/quotation/approver.model';
import { ApprovalService } from '@gq/shared/services/rest/approval/approval.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { activeCaseFeature, getSapId } from '../active-case';
import * as activeCaseUtils from '../active-case/active-case.utils';
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
          thirdApproverRequired: false,
          autoApproval: false,
          currency: 'EUR',
          priceDeviation: 12.2,
          gpm: 13.5,
          totalNetValue: 120_014,
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
          thirdApproverRequired: false,
          autoApproval: false,
          currency: 'EUR',
          priceDeviation: 12.2,
          gpm: 13.5,
          totalNetValue: 120_014,
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
          thirdApproverRequired: false,
          autoApproval: false,
          currency: 'EUR',
          priceDeviation: 12.2,
          gpm: 13.5,
          totalNetValue: 120_014,
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

  describe('getActiveDirectoryUsers', () => {
    test(
      'should dispatch successAction',
      marbles((m) => {
        action = ApprovalActions.getActiveDirectoryUsers({
          searchExpression: 'test',
        });
        const activeDirectoryUsers: ActiveDirectoryUser[] = [
          { userId: 'schlesni' } as ActiveDirectoryUser,
          { userId: 'soehnpsc' } as ActiveDirectoryUser,
        ];
        const result = ApprovalActions.getActiveDirectoryUsersSuccess({
          activeDirectoryUsers,
        });
        const response = m.cold('-a', {
          a: activeDirectoryUsers,
        });
        approvalService.getActiveDirectoryUsers = jest.fn(() => response);
        const expected = m.cold('-b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.getActiveDirectoryUsers$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'should dispatch errorAction',
      marbles((m) => {
        action = ApprovalActions.getActiveDirectoryUsers({
          searchExpression: 'test',
        });
        const error = new Error('did not work');
        const result = ApprovalActions.getActiveDirectoryUsersFailure({
          error,
        });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        approvalService.getActiveDirectoryUsers = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getActiveDirectoryUsers$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('triggerApprovalWorkflow', () => {
    test(
      'should dispatch successAction',
      marbles((m) => {
        const sapId = '123456';
        const quotationIdentifier = {
          gqId: 999,
          customerNumber: '20577',
          salesOrg: '7895',
        };
        const queryParams = `quotation_number=${quotationIdentifier.gqId}&customer_number=${quotationIdentifier.customerNumber}&sales_org=${quotationIdentifier.salesOrg}`;
        const approvalWorkflowData = {
          firstApprover: 'APPR1',
          secondApprover: 'APPR2',
          thirdApprover: 'APPR3',
          infoUser: 'CC00',
          comment: 'test comment',
          projectInformation: 'project info',
        };
        const protocol = 'https';
        const hostname = 'guided-quoting-test.dev.dp.schaeffler';
        const gqLinkBase64Encoded =
          'aHR0cHM6Ly90ZXN0LmRlP3ExPXRlc3QxJnEyPXRlc3Qy';

        store.overrideSelector(getSapId, sapId);
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          quotationIdentifier
        );

        delete window.location;
        window.location = { protocol, hostname } as any;

        const mapQuotationIdentifierToQueryParamsStringSpy = jest.spyOn(
          activeCaseUtils,
          'mapQuotationIdentifierToQueryParamsString'
        );
        mapQuotationIdentifierToQueryParamsStringSpy.mockReturnValue(
          queryParams
        );

        const btoaSpy = jest.spyOn(window, 'btoa');
        btoaSpy.mockReturnValue(gqLinkBase64Encoded);

        const triggerApprovalWorkflowSpy = jest.spyOn(
          approvalService,
          'triggerApprovalWorkflow'
        );

        action = ApprovalActions.triggerApprovalWorkflow({
          approvalWorkflowData,
        });

        const result = ApprovalActions.triggerApprovalWorkflowSuccess();
        const response = m.cold('-a');
        triggerApprovalWorkflowSpy.mockReturnValue(response);
        const expected = m.cold('-b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.triggerApprovalWorkflow$).toBeObservable(expected);
        m.flush();

        expect(
          mapQuotationIdentifierToQueryParamsStringSpy
        ).toHaveBeenCalledWith(quotationIdentifier);

        expect(btoaSpy).toBeCalledWith(
          `${protocol}//${hostname}/${AppRoutePath.ProcessCaseViewPath}/${ProcessCaseRoutePath.OverviewPath}?${queryParams}`
        );

        expect(triggerApprovalWorkflowSpy).toHaveBeenCalledWith(sapId, {
          ...approvalWorkflowData,
          gqId: quotationIdentifier.gqId,
          gqLinkBase64Encoded,
        });
      })
    );

    test(
      'should dispatch errorAction',
      marbles((m) => {
        store.overrideSelector(getSapId, '123897');
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          {} as any
        );

        delete window.location;
        window.location = { protocol: 'https', hostname: 'test.de' } as any;

        jest
          .spyOn(activeCaseUtils, 'mapQuotationIdentifierToQueryParamsString')
          .mockReturnValue('queryString');

        action = ApprovalActions.triggerApprovalWorkflow({
          approvalWorkflowData: {} as any,
        });
        const error = new Error('did not work');
        const result = ApprovalActions.triggerApprovalWorkflowFailure({
          error,
        });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        approvalService.triggerApprovalWorkflow = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.triggerApprovalWorkflow$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('updateApprovalWorkflow', () => {
    test(
      'should dispatch successAction',
      marbles((m) => {
        const sapId = '123456';

        const quotationIdentifier = {
          gqId: 999,
        } as any;

        const updateApprovalWorkflowData = {
          comment: 'test',
          updateFunction: UpdateFunction.APPROVE_QUOTATION,
        };

        const approvalEvent = {
          comment: updateApprovalWorkflowData.comment,
          gqId: quotationIdentifier.gqId,
        } as ApprovalEvent;

        store.overrideSelector(getSapId, sapId);
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          quotationIdentifier
        );

        const updateApprovalWorkflowSpy = jest.spyOn(
          approvalService,
          'updateApprovalWorkflow'
        );

        action = ApprovalActions.updateApprovalWorkflow({
          updateApprovalWorkflowData,
        });

        const result = ApprovalActions.updateApprovalWorkflowSuccess({
          approvalEvent,
        });
        const response = m.cold('-a', {
          a: approvalEvent,
        });
        updateApprovalWorkflowSpy.mockReturnValue(response);
        const expected = m.cold('-b', { b: result });

        actions$ = m.hot('a', { a: action });

        m.expect(effects.updateApprovalWorkflow$).toBeObservable(expected);
        m.flush();

        expect(updateApprovalWorkflowSpy).toHaveBeenCalledWith(sapId, {
          ...updateApprovalWorkflowData,
          gqId: quotationIdentifier.gqId,
        });
      })
    );

    test(
      'should dispatch errorAction',
      marbles((m) => {
        store.overrideSelector(getSapId, '123897');
        store.overrideSelector(
          activeCaseFeature.selectQuotationIdentifier,
          {} as any
        );

        action = ApprovalActions.updateApprovalWorkflow({
          updateApprovalWorkflowData: {} as any,
        });
        const error = new Error('did not work');
        const result = ApprovalActions.updateApprovalWorkflowFailure({
          error,
        });
        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });
        approvalService.updateApprovalWorkflow = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.updateApprovalWorkflow$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
