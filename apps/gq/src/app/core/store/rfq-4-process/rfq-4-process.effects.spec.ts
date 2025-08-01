import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';
import { Rfq4Service } from '@gq/shared/services/rest/rfq4/rfq-4.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import * as mailConsts from './consts/maintainer-mail.consts';
import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { Rfq4ProcessEffects } from './rfq-4-process.effects';
import { rfq4ProcessFeature } from './rfq-4-process.reducer';

describe('Rfq4Effects', () => {
  let spectator: SpectatorService<Rfq4ProcessEffects>;
  let action: any;
  let actions$: any;
  let effects: Rfq4ProcessEffects;
  let rfq4Service: Rfq4Service;
  let msGraphMapperService: MicrosoftGraphMapperService;
  let snackBar: MatSnackBar;
  let store: any;
  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: Rfq4ProcessEffects,
    imports: [MatSnackBarModule, RouterModule.forRoot([])],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      provideHttpClientTesting(),
      provideHttpClient(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(Rfq4ProcessEffects);

    rfq4Service = spectator.inject(Rfq4Service);
    msGraphMapperService = spectator.inject(MicrosoftGraphMapperService);
    store = spectator.inject(MockStore);
    snackBar = spectator.inject(MatSnackBar);
  });
  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(rfq4Service).toBeTruthy();
    expect(snackBar).toBeTruthy();
    expect(store).toBeTruthy();
    expect(errorMessage).toBeTruthy();
  });

  describe('getSapMaintainers$', () => {
    test(
      'should call getSapMaintainers and return success action',
      marbles((m) => {
        action = Rfq4ProcessActions.getSapMaintainerUserIds();
        const expectedAction =
          Rfq4ProcessActions.getSapMaintainerUserIdsSuccess({
            maintainerUserIds: ['123', '456'],
          });
        rfq4Service.getSapMaintainers = jest
          .fn()
          .mockReturnValue(
            of({ supportContacts: [{ userId: '123' }, { userId: '456' }] })
          );

        actions$ = of(action);

        m.expect(effects.getSapMaintainers$).toBeObservable(
          m.cold('(a|)', {
            a: expectedAction,
          })
        );
      })
    );

    test(
      'should call getSapMaintainers and return error action',
      marbles((m) => {
        action = Rfq4ProcessActions.getSapMaintainerUserIds();
        rfq4Service.getSapMaintainers = jest.fn(() => response);
        const result = Rfq4ProcessActions.getSapMaintainerUserIdsError({
          error: errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.getSapMaintainers$).toBeObservable(expected);
        m.flush();
      })
    );
  });
  describe('getFullNamesOfMaintainers$', () => {
    test(
      'should call getFullNamesOfMaintainers and return success action',
      marbles((m) => {
        action = Rfq4ProcessActions.getSapMaintainerUserIdsSuccess({
          maintainerUserIds: ['123', '456'],
        });
        const expectedAction =
          Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsSuccess(
            {
              maintainers: [
                {
                  firstName: 'John',
                  lastName: 'Doe',
                  mail: 'd@mail.com',
                  userId: '123',
                },
                {
                  firstName: 'Jane',
                  lastName: 'Doe',
                  mail: 'sd@mail.com',
                  userId: '456',
                },
              ],
            }
          );
        msGraphMapperService.getActiveDirectoryUserByMultipleUserIds = jest
          .fn()
          .mockReturnValue(
            of([
              {
                firstName: 'John',
                lastName: 'Doe',
                mail: 'd@mail.com',
                userId: '123',
              },
              {
                firstName: 'Jane',
                lastName: 'Doe',
                mail: 'sd@mail.com',
                userId: '456',
              },
            ])
          );

        actions$ = of(action);

        m.expect(effects.getFullNamesOfMaintainers$).toBeObservable(
          m.cold('(a|)', {
            a: expectedAction,
          })
        );
      })
    );

    test(
      'should call getFullNamesOfMaintainers and return error action',
      marbles((m) => {
        action = Rfq4ProcessActions.getSapMaintainerUserIdsSuccess({
          maintainerUserIds: ['123', '456'],
        });
        msGraphMapperService.getActiveDirectoryUserByMultipleUserIds = jest.fn(
          () => response
        );
        const result =
          Rfq4ProcessActions.getActiveDirectoryUserOfSapMaintainerUserIdsError({
            error: errorMessage,
          });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.getFullNamesOfMaintainers$).toBeObservable(expected);
        m.flush();
      })
    );
  });
  describe('findCalculators$', () => {
    test(
      'should call findCalculators and return success action',
      marbles((m) => {
        action = Rfq4ProcessActions.findCalculators({ gqPositionId: '1245' });
        const expectedAction = Rfq4ProcessActions.findCalculatorsSuccess({
          gqPositionId: '1245',
          foundCalculators: ['testPath1', 'testPath2', 'testPath3'],
        });
        const response = ['testPath1', 'testPath2', 'testPath3'];
        rfq4Service.findCalculators = jest.fn().mockReturnValue(of(response));

        actions$ = of(action);

        m.expect(effects.findCalculators$).toBeObservable(
          m.cold('(a|)', {
            a: expectedAction,
          })
        );
      })
    );

    test(
      'should call findCalculators and return error action',
      marbles((m) => {
        action = Rfq4ProcessActions.findCalculators({ gqPositionId: '1245' });
        rfq4Service.findCalculators = jest.fn(() => response);
        const result = Rfq4ProcessActions.findCalculatorsError({
          gqPositionId: '1245',
          error: errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.findCalculators$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('sendRecalculateSqvRequest$', () => {
    test(
      'should call sendRecalculateSqvRequest and return success action',
      marbles((m) => {
        action = Rfq4ProcessActions.sendRecalculateSqvRequest({
          gqPositionId: '123456',
          message: 'test message',
        });
        const expectedAction =
          Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
            gqPositionId: '123456',
            rfq4Status: Rfq4Status.IN_PROGRESS,
          });
        rfq4Service.recalculateSqv = jest
          .fn()
          .mockReturnValue(of(Rfq4Status.IN_PROGRESS));

        actions$ = of(action);

        m.expect(effects.sendRecalculateSqvRequest$).toBeObservable(
          m.cold('(a|)', {
            a: expectedAction,
          })
        );
      })
    );

    test(
      'should call sendRecalculateSqvRequest and return error action',
      marbles((m) => {
        action = Rfq4ProcessActions.sendRecalculateSqvRequest({
          gqPositionId: '123456',
          message: 'test message',
        });
        rfq4Service.recalculateSqv = jest.fn(() => response);
        const result = Rfq4ProcessActions.sendRecalculateSqvRequestError({
          error: errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.sendRecalculateSqvRequest$).toBeObservable(expected);
        m.flush();
      })
    );
  });
  describe('sendRequestToMaintainCalculators$', () => {
    test(
      'should selectSapMaintainers and set location.href to mailTo',
      marbles((m) => {
        store.overrideSelector(rfq4ProcessFeature.getValidMaintainers, [
          {
            firstName: 'first',
            lastName: 'last',
            mail: 'mail1@mail.com',
          } as ActiveDirectoryUser,
          {
            firstName: 'first2',
            lastName: 'last2',
            mail: 'mail2@mail.com',
          } as ActiveDirectoryUser,
        ]);
        const subjectSpy = jest
          .spyOn(mailConsts, 'getMailSubjectString')
          .mockReturnValue('subject');
        const bodySpy = jest
          .spyOn(mailConsts, 'getMailBodyString')
          .mockReturnValue('body');

        Object.defineProperty(window, 'open', { value: jest.fn() });
        action = Rfq4ProcessActions.sendEmailRequestToMaintainCalculators({
          quotationDetail: {} as QuotationDetail,
        });
        actions$ = m.hot('-a', {
          a: action,
        });

        effects.sendRequestToMaintainCalculators$.subscribe(() => {
          expect(subjectSpy).toHaveBeenCalledWith(action.quotationDetail);
          expect(bodySpy).toHaveBeenCalledWith(
            'first last and first2 last2',
            action.quotationDetail
          );
          expect(window.open).toHaveBeenCalledWith(
            'mailto:mail1@mail.com,mail2@mail.com?subject=subject&body=body',
            '_blank'
          );
        });
      })
    );

    test(
      'should send mail to fallback',
      marbles((m) => {
        store.overrideSelector(rfq4ProcessFeature.getValidMaintainers, []);
        const subjectSpy = jest
          .spyOn(mailConsts, 'getMailSubjectString')
          .mockReturnValue('subject');
        const bodySpy = jest
          .spyOn(mailConsts, 'getMailBodyString')
          .mockReturnValue('body');

        Object.defineProperty(window, 'open', { value: jest.fn() });
        action = Rfq4ProcessActions.sendEmailRequestToMaintainCalculators({
          quotationDetail: {} as QuotationDetail,
        });
        actions$ = m.hot('-a', {
          a: action,
        });

        effects.sendRequestToMaintainCalculators$.subscribe(() => {
          expect(subjectSpy).toHaveBeenCalledWith(action.quotationDetail);
          expect(bodySpy).toHaveBeenCalledWith(
            mailConsts.mailFallback,
            action.quotationDetail
          );
          expect(window.open).toHaveBeenCalledWith(
            `mailto:${mailConsts.mailFallback}?subject=subject&body=body`,
            '_blank'
          );
        });
      })
    );
  });
  describe('sendCancelProcessRequest$', () => {
    test(
      'should call cancel process and return success action',
      marbles((m) => {
        const gqPositionId = '123456';
        const reasonForCancellation = 'CUSTOMER';
        const comment = 'Test comment';
        action = Rfq4ProcessActions.sendCancelProcess({
          gqPositionId,
          reasonForCancellation,
          comment,
        });
        const expectedAction = Rfq4ProcessActions.sendCancelProcessSuccess({
          gqPositionId,
          rfq4Status: Rfq4Status.CANCELLED,
        });
        rfq4Service.cancelProcess = jest
          .fn()
          .mockReturnValue(of(Rfq4Status.CANCELLED));

        actions$ = of(action);

        m.expect(effects.sendCancelProcessRequest$).toBeObservable(
          m.cold('(a|)', {
            a: expectedAction,
          })
        );
      })
    );

    test(
      'should call cancel process and return error action',
      marbles((m) => {
        const gqPositionId = '123456';
        const reasonForCancellation = 'CUSTOMER';
        const comment = 'Test comment';
        action = Rfq4ProcessActions.sendCancelProcess({
          gqPositionId,
          reasonForCancellation,
          comment,
        });
        rfq4Service.cancelProcess = jest.fn(() => response);
        const result = Rfq4ProcessActions.sendCancelProcessError({
          error: errorMessage,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-#|', undefined, errorMessage);
        const expected = m.cold('--b', { b: result });

        m.expect(effects.sendCancelProcessRequest$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
