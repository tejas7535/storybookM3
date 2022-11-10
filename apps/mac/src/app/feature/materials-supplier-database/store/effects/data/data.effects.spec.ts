import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/msd/constants';
import { MaterialV2 } from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import {
  fetchCategoryOptions,
  fetchCategoryOptionsFailure,
  fetchCategoryOptionsSuccess,
  fetchClassAndCategoryOptions,
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
} from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades';
import { getFilters } from '@mac/msd/store/selectors';

import { DataEffects } from './data.effects';

describe('Data Effects', () => {
  let action: any;
  let actions$: any;
  let effects: DataEffects;
  let spectator: SpectatorService<DataEffects>;
  let msdDataService: MsdDataService;
  let store: MockStore;
  let msdDataFacade: DataFacade;

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
      {
        provide: DataFacade,
        useValue: {
          materialClass$: of(MaterialClass.STEEL),
          filters$: of({
            materialClass: { id: 'st', title: 'Steel' },
          }),
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
    msdDataFacade = spectator.inject(DataFacade);
    msdDataFacade.filters$ = of({
      materialClass: { id: 'st', title: 'Steel' },
      productCategory: undefined,
    });
  });

  describe('fetchMaterials$', () => {
    it(
      'should fetch materials and return success action on success',
      marbles((m) => {
        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        const resultMock: MaterialV2[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as MaterialV2,
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterials = jest.fn(() => response);

        const result = fetchMaterialsSuccess({
          materialClass: MaterialClass.STEEL,
          result: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          MaterialClass.STEEL,
          undefined
        );
      })
    );

    it(
      'should fetch materials with category and return success action on success',
      marbles((m) => {
        msdDataFacade.filters$ = of({
          materialClass: { id: 'st', title: 'Steel' },
          productCategory: [
            { id: 'cat', title: 'category' },
            { id: undefined, title: undefined },
          ],
        });
        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        const resultMock: MaterialV2[] = [
          {
            manufacturerSupplierName: 'some supplier',
          } as MaterialV2,
        ];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterials = jest.fn(() => response);

        const result = fetchMaterialsSuccess({
          materialClass: MaterialClass.STEEL,
          result: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          MaterialClass.STEEL,
          ['cat', undefined]
        );
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        const materialClass = { id: 'id', title: 'gibts net' };
        const productCategory = [{ id: 'id', title: 'gibts net' }];

        store.overrideSelector(getFilters, { materialClass, productCategory });

        action = fetchMaterials();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getMaterials = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('error')));

        const result = fetchMaterialsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchMaterials$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getMaterials).toHaveBeenCalledWith(
          MaterialClass.STEEL,
          undefined
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

        const resultMock: StringOption[] = [{ id: 'id', title: 'gibts net' }];
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
          .mockReturnValue(throwError(() => new Error('error')));

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

        const resultMock: StringOption[] = [{ id: 'id', title: 'gibts net' }];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getProductCategories = jest.fn(() => response);

        const result = fetchCategoryOptionsSuccess({
          productCategoryOptions: resultMock,
        });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch categories and return failure action on failure',
      marbles((m) => {
        action = fetchCategoryOptions();
        actions$ = m.hot('-a', { a: action });

        msdDataService.getProductCategories = jest
          .fn()
          .mockReturnValue(throwError(() => new Error('error')));

        const result = fetchCategoryOptionsFailure();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.fetchCategoryOptions$).toBeObservable(expected);
        m.flush();

        expect(msdDataService.getProductCategories).toHaveBeenCalledWith(
          MaterialClass.STEEL
        );
      })
    );
  });
});
