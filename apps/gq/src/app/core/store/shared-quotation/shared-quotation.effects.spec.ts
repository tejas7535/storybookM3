import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { of, throwError } from 'rxjs';

import { SharedQuotationActions } from '@gq/core/store/shared-quotation/shared-quotation.actions';
import { SharedQuotationService } from '@gq/shared/services/rest/shared-quotation/shared-quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jest';

import { SHARED_QUOTATION_MOCK } from '../../../../testing/mocks/models/shared-quotation.mock';
import { SharedQuotationEffects } from './shared-quotation.effects';

describe('SharedQuotationEffects', () => {
  let spectator: SpectatorService<SharedQuotationEffects>;
  let action: any;
  let actions$: any;
  let effects: SharedQuotationEffects;
  let sharedQuotationService: SharedQuotationService;
  let snackBar: MatSnackBar;

  const errorMessage = 'An error occurred';

  const createService = createServiceFactory({
    service: SharedQuotationEffects,
    imports: [MatSnackBarModule, HttpClientTestingModule],
    providers: [provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SharedQuotationEffects);
    sharedQuotationService = spectator.inject(SharedQuotationService);
    snackBar = spectator.inject(MatSnackBar);
  });

  describe('getSharedQuotation$', () => {
    test(
      'should return getSharedQuotationSuccess when REST call is successful',
      marbles((m) => {
        action = SharedQuotationActions.getSharedQuotation({ gqId: 123 });
        sharedQuotationService.getSharedQuotation = jest.fn(() => response);

        const sharedQuotation = SHARED_QUOTATION_MOCK;
        const result = SharedQuotationActions.getSharedQuotationSuccess({
          sharedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: sharedQuotation });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.getSharedQuotation$).toBeObservable(expected);
        m.flush();
        expect(sharedQuotationService.getSharedQuotation).toHaveBeenCalledTimes(
          1
        );
      })
    );

    test('should return getSharedQuotationFailure on REST error', () => {
      action = SharedQuotationActions.getSharedQuotation({ gqId: 123 });
      sharedQuotationService.getSharedQuotation = jest.fn(() => response);
      const result = SharedQuotationActions.getSharedQuotationFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(() => new Error(errorMessage));

      effects.getSharedQuotation$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(sharedQuotationService.getSharedQuotation).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('saveSharedQuotation$', () => {
    test(
      'should return saveSharedQuotationSuccess when REST call is successful',
      marbles((m) => {
        action = SharedQuotationActions.saveSharedQuotation({ gqId: 123 });
        sharedQuotationService.saveSharedQuotation = jest.fn(() => response);
        snackBar.open = jest.fn();

        const sharedQuotation = SHARED_QUOTATION_MOCK;
        const result = SharedQuotationActions.saveSharedQuotationSuccess({
          sharedQuotation,
        });

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|', { a: sharedQuotation });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.saveSharedQuotation$).toBeObservable(expected);
        m.flush();
        expect(
          sharedQuotationService.saveSharedQuotation
        ).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test('should return saveSharedQuotationFailure on REST error', () => {
      action = SharedQuotationActions.saveSharedQuotation({ gqId: 123 });
      sharedQuotationService.saveSharedQuotation = jest.fn(() => response);
      const result = SharedQuotationActions.saveSharedQuotationFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(() => new Error(errorMessage));

      effects.saveSharedQuotation$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(sharedQuotationService.saveSharedQuotation).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('deleteSharedQuotation$', () => {
    test(
      'should return deleteSharedQuotationSuccess when REST call successful',
      marbles((m) => {
        action = SharedQuotationActions.deleteSharedQuotation({ id: '123' });
        sharedQuotationService.deleteSharedQuotation = jest.fn(() => response);
        snackBar.open = jest.fn();

        const result = SharedQuotationActions.deleteSharedQuotationSuccess();

        actions$ = m.hot('-a', { a: action });
        const response = m.cold('-a|');
        const expected = m.cold('--b', { b: result });

        m.expect(effects.deleteSharedQuotation$).toBeObservable(expected);
        m.flush();
        expect(
          sharedQuotationService.deleteSharedQuotation
        ).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledTimes(1);
      })
    );

    test('should return deleteSharedQuotationFailure on REST error', () => {
      action = SharedQuotationActions.deleteSharedQuotation({ id: '123' });
      sharedQuotationService.deleteSharedQuotation = jest.fn(() => response);
      const result = SharedQuotationActions.deleteSharedQuotationFailure({
        errorMessage,
      });

      actions$ = of(action);
      const response = throwError(() => new Error(errorMessage));

      effects.deleteSharedQuotation$.subscribe((res) => {
        expect(res).toEqual(result);
      });
      expect(
        sharedQuotationService.deleteSharedQuotation
      ).toHaveBeenCalledTimes(1);
    });
  });
});
