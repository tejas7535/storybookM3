import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import {
  BOM_MOCK,
  CALCULATIONS_TYPE_MOCK,
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
} from '../../actions';
import {
  BomIdentifier,
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;
  let store: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DetailEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DetailService,
          useValue: {
            detail: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    actions$ = TestBed.inject(Actions);
    effects = TestBed.inject(DetailEffects);
    detailService = TestBed.inject(DetailService);
    store = TestBed.inject(Store);
  });

  describe('referenceType$', () => {
    beforeEach(() => {
      const referenceTypeIdModel = { materialNumber: '12345', plant: 'IWS' };
      action = loadReferenceType({ referenceTypeId: referenceTypeIdModel });
    });

    test('should return loadReferenceSuccess action', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      const result = loadReferenceTypeSuccess({ item });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      detailService.getDetails = jest.fn(() => response);

      expect(effects.referenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
      expect(detailService.getDetails).toHaveBeenCalledWith(
        new ReferenceTypeIdModel('12345', 'IWS')
      );
    });

    test('should return loadReferenceFailure action on REST error', () => {
      const error = new Error('damn');
      const result = loadReferenceTypeFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.getDetails = jest.fn(() => response);

      expect(effects.referenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('bom$', () => {
    let bomIdentifier: BomIdentifier;

    beforeEach(() => {
      bomIdentifier = new BomIdentifier(
        'date',
        'number',
        'type',
        'version',
        'entered',
        'ref',
        'variant'
      );
      action = loadBom({ bomIdentifier });
    });

    test('should return loadBomSuccess action', () => {
      const items = BOM_MOCK;
      const result = loadBomSuccess({ items });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.bom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
      expect(detailService.getBom).toHaveBeenCalledWith(bomIdentifier);
    });

    test('should return loadBomFailure action on REST error', () => {
      const error = new Error('damn');
      const result = loadBomFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.bom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculations$', () => {
    beforeEach(() => {
      action = loadCalculations({ materialNumber: '12345' });
    });

    test('should return loadCalculationsSuccess action and dispatch loadBom action', () => {
      store.dispatch = jest.fn();
      const items = CALCULATIONS_TYPE_MOCK;

      const bomIdentifier = new BomIdentifier(
        items[0].bomCostingDate,
        items[0].bomCostingNumber,
        items[0].bomCostingType,
        items[0].bomCostingVersion,
        items[0].bomEnteredManually,
        items[0].bomReferenceObject,
        items[0].bomValuationVariant
      );
      const result = loadCalculationsSuccess({ items });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
      expect(detailService.getDetails).toHaveBeenCalledWith(
        new ReferenceTypeIdModel('12345', 'IWS')
      );

      expect(store.dispatch).toHaveBeenCalledWith(loadBom({ bomIdentifier }));
    });

    test('should not dispatch loadBom action if no items are received', () => {
      store.dispatch = jest.fn();
      const items: Calculation[] = [];
      const result = loadCalculationsSuccess({ items });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
      expect(detailService.getDetails).toHaveBeenCalledWith(
        new ReferenceTypeIdModel('12345', 'IWS')
      );
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should return loadCalculationsFailure action on REST error', () => {
      const error = new Error('damn');
      const result = loadCalculationsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });
  });
});
