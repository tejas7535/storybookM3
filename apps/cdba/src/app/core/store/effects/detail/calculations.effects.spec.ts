import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { ProductDetailService } from '@cdba/detail/service/detail.service';
import {
  AUTH_STATE_MOCK,
  CALCULATIONS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  selectReferenceType,
} from '../../actions';
import { CalculationsResponse } from '../../reducers/detail/models';
import { getSelectedReferenceTypeIdentifier } from '../../selectors';
import { CalculationsEffects } from './calculations.effects';

describe('CalculationsEffects', () => {
  let spectator: SpectatorService<CalculationsEffects>;
  let action: any;
  let actions$: any;
  let effects: CalculationsEffects;
  let productDetailService: ProductDetailService;
  let store: MockStore;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: CalculationsEffects,
    imports: [],
    providers: [
      mockProvider(ProductDetailService),
      RoleFacade,
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CalculationsEffects);
    productDetailService = spectator.inject(ProductDetailService);
    store = spectator.inject(MockStore);
  });

  describe('loadCalculations$', () => {
    beforeEach(() => {
      action = loadCalculations();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const calculations = CALCULATIONS_MOCK;
        const excludedCalculations = EXCLUDED_CALCULATIONS_MOCK;

        const response = m.cold('-a|', {
          a: new CalculationsResponse(calculations, excludedCalculations),
        });
        productDetailService.getCalculations = jest.fn(() => response);

        const result = loadCalculationsSuccess({
          calculations,
          excludedCalculations,
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCalculations$).toBeObservable(expected);
        m.flush();
        expect(productDetailService.getCalculations).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationsFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        productDetailService.getCalculations = jest.fn(() => response);

        m.expect(effects.loadCalculations$).toBeObservable(expected);
        m.flush();
        expect(productDetailService.getCalculations).toHaveBeenCalled();
      })
    );
  });

  describe('check roles and rights', () => {
    const stateWithoutRoles: any = {
      'azure-auth': {
        ...AUTH_STATE_MOCK,
        accountInfo: {
          ...AUTH_STATE_MOCK.accountInfo,
          idTokenClaims: {
            roles: [],
          },
        },
      },
    };

    beforeEach(() => {
      store.setState(stateWithoutRoles);
      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'before loading calculations',
      marbles((m) => {
        action = loadCalculations();
        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationsFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadCalculations$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return loadCalculations Action',
      marbles((m) => {
        action = selectReferenceType({
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadCalculations(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });
});
