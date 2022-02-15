import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { RoleFacade } from '@cdba/core/auth/role.facade';
import { DetailService } from '@cdba/detail/service/detail.service';
import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  AUTH_STATE_MOCK,
  BOM_IDENTIFIER_MOCK,
  BOM_MOCK,
  CALCULATIONS_MOCK,
  DRAWINGS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import {
  CalculationsResponse,
  ReferenceTypeResult,
} from '../../reducers/detail/models';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors/details/detail.selector';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let spectator: SpectatorService<DetailEffects>;
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;
  let store: MockStore;
  let router: Router;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: DetailEffects,
    imports: [RouterTestingModule],
    providers: [
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
    effects = spectator.inject(DetailEffects);
    detailService = spectator.inject(DetailService);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
  });

  describe('loadReferenceType$', () => {
    beforeEach(() => {
      action = loadReferenceType();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const item = new ReferenceTypeResult(REFERENCE_TYPE_MOCK);

        const response = m.cold('-a|', {
          a: item,
        });
        detailService.getDetails = jest.fn(() => response);

        const result = loadReferenceTypeSuccess({ item });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadReferenceType$).toBeObservable(expected);
        m.flush();

        expect(detailService.getDetails).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadReferenceTypeFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getDetails = jest.fn(() => response);

        m.expect(effects.loadReferenceType$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDetails).toHaveBeenCalled();
      })
    );
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
        detailService.getCalculations = jest.fn(() => response);

        const result = loadCalculationsSuccess({
          calculations,
          excludedCalculations,
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadCalculations$).toBeObservable(expected);
        m.flush();
        expect(detailService.getCalculations).toHaveBeenCalled();
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

        detailService.getCalculations = jest.fn(() => response);

        m.expect(effects.loadCalculations$).toBeObservable(expected);
        m.flush();
        expect(detailService.getCalculations).toHaveBeenCalled();
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

  describe('loadDrawings$', () => {
    beforeEach(() => {
      action = loadDrawings();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = DRAWINGS_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        detailService.getDrawings = jest.fn(() => response);

        const result = loadDrawingsSuccess({ items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadDrawings$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDrawings).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadDrawingsFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getDrawings = jest.fn(() => response);

        m.expect(effects.loadDrawings$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDrawings).toHaveBeenCalled();
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

        const items = BOM_MOCK;

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

  describe('triggerDataLoad$', () => {
    test(
      'should return loadRefType, loadCalculations and loadDrawings Action',
      marbles((m) => {
        action = selectReferenceType({
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-(bcd)', {
          b: loadReferenceType(),
          c: loadCalculations(),
          d: loadDrawings(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });

  describe('selectReferenceType$', () => {
    beforeEach(() => {
      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return select referenceTypeAction',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/detail/details',
              queryParams: {
                material_number: '456789',
                plant: '0060',
              },
            },
          },
        };

        actions$ = m.hot('-a', { a: action });

        const referenceTypeIdentifier = new ReferenceTypeIdentifier(
          '456789',
          '0060'
        );

        const result = selectReferenceType({ referenceTypeIdentifier });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.selectReferenceType$).toBeObservable(expected);
      })
    );

    test(
      'should navigate to not-found if URL is not valid',
      marbles((m) => {
        router.navigate = jest.fn();
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: {
              url: '/detail/details',
              queryParams: {
                material_number: '456789',
              },
            },
          },
        };

        actions$ = m.hot('-a', { a: action });
        const expected = m.cold('---');

        m.expect(effects.selectReferenceType$).toBeObservable(expected);
        m.flush();
        expect(router.navigate).toHaveBeenCalledWith(['not-found']);
      })
    );
  });

  describe('DetailsEffects.mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = { material_number: '23', rfq: '2341' };

      expect(
        DetailEffects['mapQueryParamsToIdentifier'](queryParams)
      ).toBeUndefined();
    });

    test('should return RefTypeIdentifier', () => {
      queryParams = {
        material_number: '23',
        plant: '0060',
      };

      expect(DetailEffects['mapQueryParamsToIdentifier'](queryParams)).toEqual({
        materialNumber: '23',
        plant: '0060',
      });
    });
  });

  describe('DetailsEffects.checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = undefined;

      result = DetailEffects['checkEqualityOfIdentifier'](fromRoute, current);

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = {
        ...REFERENCE_TYPE_IDENTIFIER_MOCK,
        plant: 'other plant',
      };

      result = DetailEffects['checkEqualityOfIdentifier'](fromRoute, current);

      expect(result).toBeFalsy();
    });
  });
});
