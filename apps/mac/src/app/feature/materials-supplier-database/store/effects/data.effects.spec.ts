import { throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { fetchMaterials, fetchMaterialsSuccess } from '../actions';
import { getFilters } from '../selectors';
import { DataFilter } from './../../models/data/data-filter.model';
import { DataResult } from './../../models/data/data-result.model';
import { MsdDataService } from './../../services/msd-data/msd-data.service';
import {
  fetchCategoryOptions,
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchMaterialsFailure,
} from './../actions/data.actions';
import { DataEffects } from './data.effects';

describe('Data Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DataEffects;
  let spectator: SpectatorService<DataEffects>;
  let msdDataService: MsdDataService;
  let store: MockStore;

  const createService = createServiceFactory({
    service: DataEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: MsdDataService,
        useValue: {
          getMaterials: () => {},
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DataEffects);
    store = spectator.inject(MockStore);
    msdDataService = spectator.inject(MsdDataService);
  });

  describe('fetchMaterials$', () => {
    it(
      'should fetch materials and return success action on success',
      marbles((m) => {
        const materialClass = { id: 0, name: 'gibts net' };
        const productCategory = [{ id: 0, name: 'gibts net' }];

        store.overrideSelector(getFilters, { materialClass, productCategory });

        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        const resultMock: DataResult[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as DataResult,
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterials = jest.fn(() => response);

        const result = fetchMaterialsSuccess({ result: resultMock });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          materialClass.id,
          productCategory.map((category: DataFilter) => category?.id)
        );
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        const materialClass = { id: 0, name: 'gibts net' };
        const productCategory = [{ id: 0, name: 'gibts net' }];

        store.overrideSelector(getFilters, { materialClass, productCategory });

        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getMaterials = jest
          .fn()
          .mockReturnValue(throwError('error'));

        const result = fetchMaterialsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          materialClass.id,
          productCategory.map((category: DataFilter) => category?.id)
        );
      })
    );
  });

  describe('fetchClassAndCategoryOptions$', () => {
    it(
      'should dispatch the nested fetch actions',
      marbles((m) => {
        action = fetchClassAndCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        const resultA = fetchClassOptions();
        const resultB = fetchCategoryOptions();

        const expected = m.cold('-(ab)', { a: resultA, b: resultB });

        m.expect(effects.fetchClassAndCategoryOptions$).toBeObservable(
          expected
        );
        m.flush();
      })
    );
  });

  describe('fetchClassOptions$', () => {
    it(
      'should fetch material classes and return success action on success',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock: DataFilter[] = [{ id: 0, name: 'gibts net' }];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterialClasses = jest.fn(() => response);

        const result = fetchClassOptionsSuccess({
          materialClassOptions: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchClassOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterialClasses).toHaveBeenCalled();
      })
    );

    it(
      'should fetch material classes and return failure action on failure',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getMaterialClasses = jest
          .fn()
          .mockReturnValue(throwError('error'));

        const result = fetchClassOptionsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchClassOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterialClasses).toHaveBeenCalled();
      })
    );
  });

  describe('fetchCategoryOptions$', () => {
    it(
      'should fetch categories and return success action on success',
      marbles((m) => {
        action = fetchCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock: DataFilter[] = [{ id: 0, name: 'gibts net' }];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getProductCategories = jest.fn(() => response);

        const result = fetchCategoryOptionsSuccess({
          productCategoryOptions: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalled();
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        action = fetchCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getProductCategories = jest
          .fn()
          .mockReturnValue(throwError('error'));

        const result = fetchCategoryOptionsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalled();
      })
    );
  });
});
