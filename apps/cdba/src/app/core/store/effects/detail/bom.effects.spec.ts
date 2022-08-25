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
import { DetailService } from '@cdba/detail/service/detail.service';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import {
  AUTH_STATE_MOCK,
  BOM_IDENTIFIER_MOCK,
  BOM_ODATA_MOCK,
  CALCULATIONS_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  ODATA_BOM_IDENTIFIER_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculationsSuccess,
  loadCostComponentSplit,
  loadCostComponentSplitFailure,
  loadCostComponentSplitSuccess,
  selectCalculation,
} from '../../actions';
import {
  getBomIdentifierForSelectedBomItem,
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors';
import { BomEffects } from './bom.effects';

describe('Bom Effects', () => {
  let spectator: SpectatorService<BomEffects>;
  let action: any;
  let actions$: any;
  let effects: BomEffects;
  let detailService: DetailService;
  let betaFeatureService: BetaFeatureService;
  let store: MockStore;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: BomEffects,

    providers: [
      mockProvider(BetaFeatureService),
      mockProvider(DetailService),
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
    effects = spectator.inject(BomEffects);
    detailService = spectator.inject(DetailService);
    betaFeatureService = spectator.inject(BetaFeatureService);
    store = spectator.inject(MockStore);
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
      'before loading bom',
      marbles((m) => {
        action = loadBom({ bomIdentifier: BOM_IDENTIFIER_MOCK });
        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          statusCode: undefined,
          errorMessage: 'User has no valid cost roles.',
        });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.loadBom$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('loadBom$', () => {
    beforeEach(() => {
      const bomIdentifier = BOM_IDENTIFIER_MOCK;
      action = loadBom({ bomIdentifier });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = BOM_ODATA_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        detailService.getBom = jest.fn(() => response);

        const result = loadBomSuccess({ items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadBom$).toBeObservable(expected);
        m.flush();
        expect(detailService.getBom).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadBomFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getBom = jest.fn(() => response);

        m.expect(effects.loadBom$).toBeObservable(expected);
        m.flush();
        expect(detailService.getBom).toHaveBeenCalled();
      })
    );
  });

  describe('triggerBomLoad$', () => {
    const bomIdentifier = BOM_IDENTIFIER_MOCK;
    const result = loadBom({ bomIdentifier });

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
        action = loadCalculationsSuccess({
          calculations: CALCULATIONS_MOCK,
          excludedCalculations: EXCLUDED_CALCULATIONS_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });

        m.expect(effects.triggerBomLoad$).toBeObservable(expected);
      })
    );
  });

  describe('loadCostComponentSplit$', () => {
    beforeEach(() => {
      const bomIdentifier = ODATA_BOM_IDENTIFIER_MOCK;
      action = loadCostComponentSplit({ bomIdentifier });
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = COST_COMPONENT_SPLIT_ITEMS_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        detailService.getCostComponentSplit = jest.fn(() => response);

        const result = loadCostComponentSplitSuccess({ items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCostComponentSplit$).toBeObservable(expected);
        m.flush();
        expect(detailService.getCostComponentSplit).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadCostComponentSplitFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getCostComponentSplit = jest.fn(() => response);

        m.expect(effects.loadCostComponentSplit$).toBeObservable(expected);
        m.flush();
        expect(detailService.getCostComponentSplit).toHaveBeenCalled();
      })
    );
  });

  describe('triggerLoadOfCostComponentSplit$', () => {
    const bomIdentifier = ODATA_BOM_IDENTIFIER_MOCK;
    const result = loadCostComponentSplit({ bomIdentifier });
    test(
      'should return loadCostComponentSplit Action when bom loaded successfully',
      marbles((m) => {
        betaFeatureService.getBetaFeature = jest.fn(() => true);
        store.overrideSelector(
          getBomIdentifierForSelectedBomItem,
          ODATA_BOM_IDENTIFIER_MOCK
        );

        action = loadBomSuccess({
          items: BOM_ODATA_MOCK,
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
