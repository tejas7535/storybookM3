import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { Rfq4Service } from '@gq/shared/services/rest/rfq4/rfq-4.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { Rfq4ProcessEffects } from './rfq-4-process.effects';

describe('Rfq4Effects', () => {
  let spectator: SpectatorService<Rfq4ProcessEffects>;
  let action: any;
  let actions$: any;
  let effects: Rfq4ProcessEffects;
  let rfq4Service: Rfq4Service;
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
  describe('findCalculators$', () => {
    test(
      'should call findCalculators and return success action',
      marbles((m) => {
        action = Rfq4ProcessActions.findCalculators(expect.anything());
        const expectedAction = Rfq4ProcessActions.findCalculatorsSuccess({
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
});
