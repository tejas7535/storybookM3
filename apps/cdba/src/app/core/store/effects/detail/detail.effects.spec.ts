import { TestBed } from '@angular/core/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { configureTestSuite } from 'ng-bullet';

import {
  CALCULATIONS_TYPE_MOCK,
  REFRENCE_TYPE_MOCK,
} from '../../../../../testing/mocks';
import { DetailService } from '../../../../detail/service/detail.service';
import {
  getCalculations,
  getCalculationsFailure,
  getCalculationsSuccess,
  getReferenceTypeItem,
  getReferenceTypeItemFailure,
  getReferenceTypeItemSuccess,
} from '../../actions';
import {
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../reducers/detail/models';
import { CalculationsResultModel } from '../../reducers/detail/models/calculations-result-model';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;

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
  });

  describe('referenceTypeItem$', () => {
    beforeEach(() => {
      const referenceTypeIdModel = { materialNumber: '12345', plant: 'IWS' };
      action = getReferenceTypeItem({ referenceTypeId: referenceTypeIdModel });
    });

    test('should return getReferenceItemSuccess action', () => {
      const item = new ReferenceTypeResultModel(REFRENCE_TYPE_MOCK);
      const result = getReferenceTypeItemSuccess({ item });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      detailService.detail = jest.fn(() => response);

      expect(effects.referenceTypeItem$).toBeObservable(expected);
      expect(detailService.detail).toHaveBeenCalledTimes(1);
      expect(detailService.detail).toHaveBeenCalledWith(
        new ReferenceTypeIdModel('12345', 'IWS')
      );
    });

    test('should return getReferenceItemFailure action on REST error', () => {
      const error = new Error('damn');
      const result = getReferenceTypeItemFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.detail = jest.fn(() => response);

      expect(effects.referenceTypeItem$).toBeObservable(expected);
      expect(detailService.detail).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculations$', () => {
    beforeEach(() => {
      action = getCalculations({ materialNumber: '12345' });
    });

    test('should return getCalculationsSuccess action', () => {
      const item = new CalculationsResultModel(CALCULATIONS_TYPE_MOCK);
      const result = getCalculationsSuccess({ item });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', {
        a: item,
      });
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.detail).toHaveBeenCalledTimes(1);
      expect(detailService.detail).toHaveBeenCalledWith(
        new ReferenceTypeIdModel('12345', 'IWS')
      );
    });

    test('should return getCalculationsFailure action on REST error', () => {
      const error = new Error('damn');
      const result = getCalculationsFailure();

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', undefined, error);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.calculations$).toBeObservable(expected);
      expect(detailService.detail).toHaveBeenCalledTimes(1);
    });
  });
});
