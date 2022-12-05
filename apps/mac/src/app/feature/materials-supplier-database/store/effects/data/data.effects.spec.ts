import { of, throwError } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { MaterialClass, NavigationLevel } from '@mac/msd/constants';
import { MaterialV2 } from '@mac/msd/models';
import { MsdDataService } from '@mac/msd/services';
import {
  fetchClassOptions,
  fetchClassOptionsFailure,
  fetchClassOptionsSuccess,
  fetchMaterials,
  fetchMaterialsFailure,
  fetchMaterialsSuccess,
} from '@mac/msd/store/actions/data';
import { DataFacade } from '@mac/msd/store/facades/data';
import { getNavigation } from '@mac/msd/store/selectors';

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
    msdDataFacade.navigation$ = of({
      materialClass: MaterialClass.STEEL,
      navigationLevel: NavigationLevel.MATERIAL,
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
          MaterialClass.STEEL
        );
      })
    );

    it(
      'should fetch materials and return failure action on failure',
      marbles((m) => {
        const materialClass = MaterialClass.STEEL;

        store.overrideSelector(getNavigation, {
          materialClass,
          navigationLevel: NavigationLevel.MATERIAL,
        });

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
          MaterialClass.STEEL
        );
      })
    );
  });

  describe('fetchClassOptions$', () => {
    it(
      'should fetch material classes and return success action on success',
      marbles((m) => {
        action = fetchClassOptions();
        actions$ = m.hot('-a', { a: action });

        const resultMock = [MaterialClass.STEEL];
        const response = m.cold('-a|', { a: resultMock });
        msdDataService.getMaterialClasses = jest.fn(() => response);

        const result = fetchClassOptionsSuccess({
          materialClasses: resultMock,
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
});
