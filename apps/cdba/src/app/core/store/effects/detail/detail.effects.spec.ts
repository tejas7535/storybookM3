import { TestBed } from '@angular/core/testing';

import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
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
  ERROR_BOM_NO_CALCULATION_FOUND,
  ERROR_CALCULATIONS_EMPTY_RESULT,
} from '../../../../shared/constants';
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
import { getRouterState } from '../../reducers';
import {
  BomIdentifier,
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { ReferenceType } from '../../reducers/shared/models';
import { Calculation } from '../../reducers/shared/models/calculation.model';
import {
  getBomItems,
  getCalculations,
  getReferenceType,
} from '../../selectors/details/detail.selector';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;
  let store: any;
  let refType: ReferenceType;
  let metadata: EffectsMetadata<DetailEffects>;

  const errorMessage = 'An error occured';

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
    metadata = getEffectsMetadata(effects);
  });

  describe('referenceTypeDetails$', () => {
    beforeEach(() => {
      action = {
        type: ROUTER_NAVIGATED,
      };
    });

    test('should not return an action', () => {
      expect(metadata.referenceTypeDetails$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test('should not dispatch anything when router url does not match a tab', () => {
      store.overrideSelector(getRouterState, {
        state: {
          url: '/detail/test?query=123',
        },
      });
      store.dispatch = jest.fn();

      actions$ = hot('a', { a: action });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should dispatch loadReferenceType when detail tab is hit', () => {
      const mockRouterState = {
        state: {
          url: '/detail/detail?material_number=123',
          queryParams: {
            material_number: '123',
          },
        },
      };

      store.overrideSelector(getRouterState, mockRouterState);

      store.dispatch = jest.fn();

      actions$ = hot('a', { a: action });

      const expected = cold('a', {
        a: mockRouterState,
      });

      expect(effects.referenceTypeDetails$).toBeObservable(expected);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadReferenceType({
          referenceTypeId: {
            materialNumber: '123',
            plant: undefined,
            rfq: undefined,
            pcmCalculationDate: undefined,
            pcmQuantity: undefined,
          },
        })
      );
    });

    test('should dispatch loadCalculations when calculations tab is hit', () => {
      const mockRouterState = {
        state: {
          url: '/detail/calculations?material_number=123',
          queryParams: {
            material_number: '123',
          },
        },
      };
      store.overrideSelector(getRouterState, mockRouterState);

      store.dispatch = jest.fn();

      actions$ = hot('a', { a: action });

      const expected = cold('a', {
        a: mockRouterState,
      });

      expect(effects.referenceTypeDetails$).toBeObservable(expected);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadCalculations({
          materialNumber: '123',
          includeBom: false,
        })
      );
    });

    test('should dispatch loadCalculations when bom tab is hit', () => {
      const mockRouterState = {
        state: {
          url: '/detail/bom?material_number=123',
          queryParams: {
            material_number: '123',
          },
        },
      };
      store.overrideSelector(getRouterState, mockRouterState);

      store.dispatch = jest.fn();

      actions$ = hot('a', { a: action });

      const expected = cold('a', {
        a: mockRouterState,
      });

      expect(effects.referenceTypeDetails$).toBeObservable(expected);

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        loadCalculations({
          materialNumber: '123',
          includeBom: true,
        })
      );
    });
  });

  describe('referenceType$', () => {
    beforeEach(() => {
      refType = new ReferenceType(
        '1234',
        '0005',
        123,
        123,
        'EUR',
        234,
        543,
        76,
        345,
        453,
        'mm',
        true,
        'short',
        'shorti',
        'type',
        'line',
        98,
        8945,
        'uum',
        'spec',
        543,
        'sup',
        435,
        'ccm',
        4123,
        'kg',
        't',
        658749,
        543,
        654,
        'anme',
        'nr',
        'rfq',
        345453,
        6757655,
        [],
        [],
        [],
        [],
        'group',
        'customer',
        'sales',
        'descr',
        432
      );
      const referenceTypeIdModel = {
        materialNumber: refType.materialNumber,
        plant: refType.plant,
        rfq: refType.rfq,
        pcmCalculationDate: refType.pcmCalculationDate,
        pcmQuantity: refType.pcmQuantity,
      };
      action = loadReferenceType({ referenceTypeId: referenceTypeIdModel });
      store.overrideSelector(getReferenceType, refType);
      store.overrideSelector(getCalculations, CALCULATIONS_TYPE_MOCK);
      store.overrideSelector(getBomItems, BOM_MOCK);
    });

    test('should return loadReferenceSuccess action', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      store.overrideSelector(getReferenceType, { materialNumber: 8888 });
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
        new ReferenceTypeIdModel('1234', '0005', 'rfq', 658749, 543)
      );
    });

    test('should return loadReferenceFailure action on REST error', () => {
      const result = loadReferenceTypeFailure({ errorMessage });
      store.overrideSelector(getReferenceType, { materialNumber: 8888 });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getDetails = jest.fn(() => response);

      expect(effects.referenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when data already loaded', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      item.referenceTypeDto.materialNumber = refType.materialNumber;
      item.referenceTypeDto.plant = refType.plant;
      item.referenceTypeDto.pcmCalculationDate = refType.pcmCalculationDate;
      item.referenceTypeDto.pcmQuantity = refType.pcmQuantity;
      item.referenceTypeDto.rfq = refType.rfq;

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('---');

      detailService.getDetails = jest.fn(() => response);

      expect(effects.referenceType$).toBeObservable(expected);
      expect(detailService.getDetails).not.toHaveBeenCalled();
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
      const result = loadBomFailure({ errorMessage });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.bom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });

    test('should do nothing when data already loaded', () => {
      store.overrideSelector(getBomItems, [
        {
          bomCostingDate: 'date',
          bomCostingNumber: 'number',
          bomCostingType: 'type',
          bomCostingVersion: 'version',
          bomEnteredManually: 'entered',
          bomReferenceObject: 'ref',
          bomValuationVariant: 'variant',
        },
      ]);

      actions$ = hot('-a', { a: action });

      const expected = cold('---');

      detailService.getBom = jest.fn();

      expect(effects.bom$).toBeObservable(expected);
      expect(detailService.getBom).not.toHaveBeenCalled();
    });
  });

  describe('calculations$', () => {
    beforeEach(() => {
      const includeBom = true;
      action = loadCalculations({ includeBom, materialNumber: '12345' });
    });

    test('should return loadCalculationsSuccess action and loadBomEventually', () => {
      store.dispatch = jest.fn();
      effects['loadBomEventually'] = jest.fn();
      const items = CALCULATIONS_TYPE_MOCK;

      const result = loadCalculationsSuccess({ items });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
      expect(detailService.calculations).toHaveBeenCalledWith('12345');
      expect(effects['loadBomEventually']).toHaveBeenCalled();
    });

    test('should dispatch failure action if items have length 0', () => {
      const items: Calculation[] = [];
      const result = loadCalculationsFailure({
        errorMessage: ERROR_CALCULATIONS_EMPTY_RESULT,
      });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: items,
      });
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
      expect(detailService.calculations).toHaveBeenCalledWith('12345');
    });

    test('should return loadCalculationsFailure action on REST error and loadBomEventually', () => {
      const result = loadCalculationsFailure({ errorMessage });
      effects['loadBomEventually'] = jest.fn();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
      expect(effects['loadBomEventually']).toHaveBeenCalled();
    });

    test('should do nothing when data is already loaded for calculcations', () => {
      const includeBom = false;
      action = loadCalculations({
        includeBom,
        materialNumber: CALCULATIONS_TYPE_MOCK[0].materialNumber,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('---');

      detailService.calculations = jest.fn();

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.calculations).not.toHaveBeenCalled();
    });
  });

  describe('loadBomEventually', () => {
    test('should do nothing when bom should not be loaded', () => {
      store.dispatch = jest.fn();

      effects['loadBomEventually'](false, []);

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    test('should dispatch loadBomFailure when calculations empty', () => {
      store.dispatch = jest.fn();

      effects['loadBomEventually'](true, []);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadBomFailure({
          errorMessage: ERROR_BOM_NO_CALCULATION_FOUND,
        })
      );
    });

    test('should dispatch loadBom when calculations are provided', () => {
      store.dispatch = jest.fn();

      effects['loadBomEventually'](true, CALCULATIONS_TYPE_MOCK);

      expect(store.dispatch).toHaveBeenCalledWith(
        loadBom({
          bomIdentifier: {
            bomCostingDate: CALCULATIONS_TYPE_MOCK[0].bomCostingDate,
            bomCostingNumber: CALCULATIONS_TYPE_MOCK[0].bomCostingNumber,
            bomCostingType: CALCULATIONS_TYPE_MOCK[0].bomCostingType,
            bomCostingVersion: CALCULATIONS_TYPE_MOCK[0].bomCostingVersion,
            bomEnteredManually: CALCULATIONS_TYPE_MOCK[0].bomEnteredManually,
            bomReferenceObject: CALCULATIONS_TYPE_MOCK[0].bomReferenceObject,
            bomValuationVariant: CALCULATIONS_TYPE_MOCK[0].bomValuationVariant,
          },
        })
      );
    });
  });
  // tslint:disable-next-line: max-file-line-count
});
