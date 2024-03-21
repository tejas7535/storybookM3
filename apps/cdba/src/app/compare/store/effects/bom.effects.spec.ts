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

import { ProductDetailService } from '@cdba/detail/service/detail.service';
import { BomIdentifier } from '@cdba/shared/models';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  AUTH_STATE_MOCK,
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  COMPARE_STATE_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
} from '@cdba/testing/mocks';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationHistorySuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  selectCalculation,
} from '../actions';
import { getBomIdentifierForSelectedCalculation } from '../selectors';
import { BomEffects } from './bom.effects';

describe('BomEffects', () => {
  let spectator: SpectatorService<BomEffects>;
  let action: any;
  let actions$: any;
  let effects: BomEffects;
  let productDetailService: ProductDetailService;
  let betaFeatureService: BetaFeatureService;
  let store: any;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const bomIdentifier: BomIdentifier | BomIdentifier = BOM_IDENTIFIER_MOCK;

  const createService = createServiceFactory({
    service: BomEffects,
    imports: [],
    providers: [
      mockProvider(ProductDetailService),
      mockProvider(BetaFeatureService),
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
    effects = spectator.inject(BomEffects);
    productDetailService = spectator.inject(ProductDetailService);
    betaFeatureService = spectator.inject(BetaFeatureService);
    store = spectator.inject(MockStore);
  });

  describe('loadBillOfMaterial$', () => {
    const index = 0;

    beforeEach(() => {
      action = loadBom({ index, bomIdentifier });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = BOM_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        productDetailService.getBom = jest.fn(() => response);

        const result = loadBomSuccess({ index, items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        productDetailService.getBom = jest.fn(() => response);

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
      })
    );
  });

  describe('triggerBomLoad$', () => {
    const index = 1;
    const plant = '0061';
    const result = loadBom({ index, bomIdentifier });

    beforeEach(() =>
      store.overrideSelector(
        getBomIdentifierForSelectedCalculation,
        bomIdentifier
      )
    );

    test(
      'should return loadBom Action when a new calculation was selected',
      marbles((m) => {
        action = selectCalculation({
          index,
          nodeId: '5',
          calculation: CALCULATIONS_MOCK[0],
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerBomLoad$).toBeObservable(expected);
      })
    );

    test(
      'should return loadBom Action when calculation were loaded successfully',
      marbles((m) => {
        action = loadCalculationHistorySuccess({
          index,
          plant,
          items: CALCULATIONS_MOCK,
          excludedItems: EXCLUDED_CALCULATIONS_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerBomLoad$).toBeObservable(expected);
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
      'before loading bom',
      marbles((m) => {
        const actionPayloadMock = {
          index: 3,
          bomIdentifier: BOM_IDENTIFIER_MOCK,
        };
        action = loadBom(actionPayloadMock);

        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
          index: actionPayloadMock.index,
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadBillOfMaterial$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('loadCostComponentSplit$', () => {
    const index = 3;
    beforeEach(() => {
      const actionPayload = {
        index,
        bomIdentifier: BOM_IDENTIFIER_MOCK,
      };
      action = loadCostComponentSplit(actionPayload);
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = COST_COMPONENT_SPLIT_ITEMS_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        productDetailService.getCostComponentSplit = jest.fn(() => response);

        const result = loadCostComponentSplitSuccess({ items, index });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCostComponentSplit$).toBeObservable(expected);
        m.flush();
        expect(productDetailService.getCostComponentSplit).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCostComponentSplitFailure({
          index,
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        productDetailService.getCostComponentSplit = jest.fn(() => response);

        m.expect(effects.loadCostComponentSplit$).toBeObservable(expected);
        m.flush();
        expect(productDetailService.getCostComponentSplit).toHaveBeenCalled();
      })
    );
  });

  describe('triggerLoadOfCostComponentSplit$', () => {
    const result = loadCostComponentSplit({
      bomIdentifier: BOM_MOCK[0].bomIdentifier,
      index: 0,
    });
    test(
      'should return loadCostComponentSplit Action when bom loaded successfully',
      marbles((m) => {
        betaFeatureService.getBetaFeature = jest.fn(() => true);

        action = loadBomSuccess({
          items: BOM_MOCK,
          index: 0,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerLoadOfCostComponentSplit$).toBeObservable(
          expected
        );
      })
    );
  });
});
