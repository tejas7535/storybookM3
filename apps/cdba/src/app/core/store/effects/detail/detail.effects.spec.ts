import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import {
  BOM_MOCK,
  CALCULATIONS_TYPE_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../../../testing/mocks';
import { DetailService } from '../../../../detail/service/detail.service';
import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import {
  BomIdentifier,
  ReferenceTypeIdentifier,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors/details/detail.selector';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;
  let store: any;
  let router: Router;

  const errorMessage = 'An error occured';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DetailEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DetailService,
          useValue: {
            getDetails: jest.fn(),
            calculations: jest.fn(),
            getBom: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(DetailEffects);
    detailService = TestBed.inject(DetailService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  describe('loadReferenceType$', () => {
    beforeEach(() => {
      action = loadReferenceType();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);

      const response = cold('-a|', {
        a: item,
      });
      detailService.getDetails = jest.fn(() => response);

      const result = loadReferenceTypeSuccess({ item });
      const expected = cold('--b', { b: result });

      expect(effects.loadReferenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadReferenceTypeFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getDetails = jest.fn(() => response);

      expect(effects.loadReferenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadCalculations$', () => {
    beforeEach(() => {
      action = loadCalculations();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = CALCULATIONS_TYPE_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.calculations = jest.fn(() => response);

      const result = loadCalculationsSuccess({ items });
      const expected = cold('--b', { b: result });

      expect(effects.loadCalculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadCalculationsFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.loadCalculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadBom$', () => {
    beforeEach(() => {
      action = loadBom();

      const bomIdentifier = new BomIdentifier(
        '20200604',
        'number',
        'type',
        'version',
        'yes',
        'ref',
        'var'
      );

      store.overrideSelector(
        getBomIdentifierForSelectedCalculation,
        bomIdentifier
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = BOM_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.getBom = jest.fn(() => response);

      const result = loadBomSuccess({ items });
      const expected = cold('--b', { b: result });

      expect(effects.loadBom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadBomFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.loadBom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerBomLoad$', () => {
    const result = loadBom();

    test('should return loadBom Action when a new calculation was selected', () => {
      action = selectCalculation({
        nodeId: '5',
        calculation: CALCULATIONS_TYPE_MOCK[0],
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });

    test('should return loadBom Action when calculation were loaded successfully', () => {
      action = loadCalculationsSuccess({
        items: CALCULATIONS_TYPE_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });
  });

  describe('triggerDataLoad$', () => {
    test('should return loadRefType and loadCalculations Action', () => {
      action = selectReferenceType({
        referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(bc)', {
        b: loadReferenceType(),
        c: loadCalculations(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
  });

  describe('selectReferenceType$', () => {
    test('should return select referenceTypeAction', () => {
      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );

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

      actions$ = hot('-a', { a: action });

      const referenceTypeIdentifier = new ReferenceTypeIdentifier(
        '456789',
        '0060'
      );

      const result = selectReferenceType({ referenceTypeIdentifier });
      const expected = cold('-b', { b: result });

      expect(effects.selectReferenceType$).toBeObservable(expected);
    });

    test('should navigate to not-found if URL is not valid', () => {
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

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.selectReferenceType$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['not-found']);
    });
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
      queryParams = { material_number: '23', plant: '0060', rfq: '2341' };

      expect(DetailEffects['mapQueryParamsToIdentifier'](queryParams)).toEqual({
        materialNumber: '23',
        plant: '0060',
        rfq: '2341',
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
      current = { ...REFERENCE_TYPE_IDENTIFIER_MOCK, pcmQuantity: 999 };

      result = DetailEffects['checkEqualityOfIdentifier'](fromRoute, current);

      expect(result).toBeFalsy();
    });
  });
});
