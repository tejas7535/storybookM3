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

import { CalculationsResponse } from '@cdba/core/store/reducers/detail/models';
import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  AUTH_STATE_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  loadCalculationHistory,
  loadCalculationHistoryFailure,
  loadCalculationHistorySuccess,
  loadCalculations,
} from '../../actions';
import { loadComparisonFeatureData } from '../../actions/root/compare-root.actions';
import { getSelectedReferenceTypeIdentifiers } from '../../selectors';
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
    providers: [
      mockProvider(ProductDetailService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
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

  describe('loadCalculations', () => {
    test(
      'should map to loadCalculationHistory Actions',
      marbles((m) => {
        action = loadCalculations();

        const referenceTypeIdentifiers = [
          new ReferenceTypeIdentifier('456789', '0060'),
          new ReferenceTypeIdentifier('4123789', '0076'),
        ];
        store.overrideSelector(
          getSelectedReferenceTypeIdentifiers,
          referenceTypeIdentifiers
        );

        const expectedAction1 = loadCalculationHistory({
          index: 0,
          materialNumber: '456789',
          plant: '0060',
        });
        const expectedAction2 = loadCalculationHistory({
          index: 1,
          materialNumber: '4123789',
          plant: '0076',
        });
        const expected = m.cold('-(bc)', {
          b: expectedAction1,
          c: expectedAction2,
        });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.loadCalculations$).toBeObservable(expected);
      })
    );
  });

  describe('loadCalculationHistory$', () => {
    const index = 0;
    const materialNumber = '12434';
    const plant = '0061';

    beforeEach(() => {
      action = loadCalculationHistory({ index, materialNumber, plant });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = CALCULATIONS_MOCK;
        const excludedItems = EXCLUDED_CALCULATIONS_MOCK;

        const response = m.cold('-a|', {
          a: new CalculationsResponse(items, excludedItems),
        });
        productDetailService.getCalculations = jest.fn(() => response);

        const result = loadCalculationHistorySuccess({
          index,
          plant,
          items,
          excludedItems,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationHistoryFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        productDetailService.getCalculations = jest.fn(() => response);

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return loadCalculations action',
      marbles((m) => {
        action = loadComparisonFeatureData({
          items: [
            {
              referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
              selectedCalculationId: '1',
            },
          ],
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadCalculations(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
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
    });

    test(
      'before loading calculations',
      marbles((m) => {
        const actionPayloadMock = {
          index: 3,
          materialNumber: 'abc',
          plant: 'def',
        };
        action = loadCalculationHistory(actionPayloadMock);

        actions$ = m.hot('-a', { a: action });

        const result = loadCalculationHistoryFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
          index: actionPayloadMock.index,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadCalculationHistory$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
