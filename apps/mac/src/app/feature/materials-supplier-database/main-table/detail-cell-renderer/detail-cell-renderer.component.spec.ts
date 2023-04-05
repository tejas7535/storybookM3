import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ICellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDataService } from '@mac/msd/services';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { getNavigation } from '@mac/msd/store/selectors';

import * as en from '../../../../../assets/i18n/en.json';
import { MaterialClass, NavigationLevel } from '../../constants';
import { DetailCellRendererComponent } from './detail-cell-renderer.component';
import { ChangeHistoryItem } from './models/change-history-item';
import { CHANGE_STATUS } from './models/change-status';
import { PropertyChange } from './models/property-change';
describe('DetailCellRendererComponent', () => {
  let component: DetailCellRendererComponent;
  let spectator: Spectator<DetailCellRendererComponent>;

  const materialHistorySubject = new Subject<any[]>();
  const matStdHistorySubject = new Subject<any[]>();
  const supplierHistorySubject = new Subject<any[]>();
  let navigationSpy: MemoizedSelector<any, any, DefaultProjectorFn<any>>;
  let store: MockStore;

  const initialState = {
    msd: { data: { ...initialDataState } },
  };

  const createComponent = createComponentFactory({
    component: DetailCellRendererComponent,
    imports: [PushModule, provideTranslocoTestingModule({ en })],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MsdDataService,
        useValue: {
          getHistoryForMaterialStandard: jest.fn(() => matStdHistorySubject),
          getHistoryForManufacturerSupplier: jest.fn(
            () => supplierHistorySubject
          ),
          getHistoryForMaterial: jest.fn(() => materialHistorySubject),
          mapStandardsToTableView: jest.fn((std) => std),
          mapSuppliersToTableView: jest.fn((suppliers) => suppliers),
        },
      },
    ],
  });

  const setNavigation = (
    materialClass: MaterialClass,
    navigationLevel: NavigationLevel
  ) => {
    navigationSpy.setResult({
      materialClass,
      navigationLevel,
    });
    store.refreshState();
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    const spy = spectator.inject(MockStore);
    store = spy;
    navigationSpy = spy.overrideSelector(getNavigation);
    setNavigation(MaterialClass.STEEL, NavigationLevel.MATERIAL);
  });

  describe('agInit', () => {
    it('should prepare change history', () => {
      const one = {
        modifiedBy: 'initial',
        lastModified: Date.now() - 9999 / 1000,
        changes: [] as any[],
      };
      const two = {
        modifiedBy: 'update',
        lastModified: Date.now() / 1000,
        changes: [] as any[],
      };
      const result: PropertyChange[] = [{ property: 'x' } as PropertyChange];
      const mockParams = { data: { id: 4 } } as ICellRendererParams;
      component['compare'] = jest.fn(() => result);
      component.agInit(mockParams);
      // subscription required to invoke tap()!
      component.done$.subscribe(() => {});
      materialHistorySubject.next([two, one]);

      expect(component['compare']).toBeCalledWith(one, two);
      expect(component.initial).toStrictEqual({
        modifiedBy: one.modifiedBy,
        timestamp: new Date(one.lastModified * 1000),
        changes: [] as any[],
      } as ChangeHistoryItem);
      expect(component.changes).toStrictEqual([
        {
          modifiedBy: two.modifiedBy,
          timestamp: new Date(two.lastModified * 1000),
          changes: result as any[],
        } as ChangeHistoryItem,
      ]);
    });
    it('should return empty change history for only one item', () => {
      const one = {
        modifiedBy: 'initial',
        lastModified: Date.now() - 9999 / 1000,
        changes: [] as any[],
      };
      const mockParams = { data: { id: 4 } } as ICellRendererParams;
      component.agInit(mockParams);
      // subscription required to invoke tap()!
      component.done$.subscribe(() => {});
      materialHistorySubject.next([one]);

      expect(component.initial).toStrictEqual({
        modifiedBy: one.modifiedBy,
        timestamp: new Date(one.lastModified * 1000),
        changes: [] as any[],
      } as ChangeHistoryItem);
      expect(component.changes).toStrictEqual([]);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('getObservable', () => {
    it('should call MaterialHistory as default', () => {
      setNavigation('a' as MaterialClass, 'b' as NavigationLevel);
      expect(component['getObservable'](1)).toBe(materialHistorySubject);
    });
    it('should call MaterialHistory', () => {
      setNavigation(MaterialClass.ALUMINUM, NavigationLevel.MATERIAL);
      expect(component['getObservable'](2)).toBe(materialHistorySubject);
    });
    it('should call MaterialStandarHistory', (done) => {
      setNavigation(MaterialClass.ALUMINUM, NavigationLevel.STANDARD);

      const expected = ['7'];
      component['getObservable'](3).subscribe((result) => {
        expect(result).toStrictEqual(expected);
        done();
      });
      matStdHistorySubject.next(expected);
    }, 1500);
    it('should call SupplierHistory', (done) => {
      setNavigation(MaterialClass.ALUMINUM, NavigationLevel.SUPPLIER);
      const expected = ['44'];
      component['getObservable'](4).subscribe((result) => {
        expect(result).toBe(expected);
        done();
      });
      supplierHistorySubject.next(expected);
    }, 1500);
  });

  describe('compare', () => {
    const ADD = CHANGE_STATUS.ADD;
    const UPDATE = CHANGE_STATUS.UPDATE;
    const REMOVE = CHANGE_STATUS.REMOVE;

    // const create: () => PropertyChange =
    const create = (
      reason: CHANGE_STATUS,
      property: string,
      current?: any,
      previous?: any
    ) =>
      ({
        property,
        current,
        previous,
        reason,
      } as PropertyChange);

    it.each([
      // new
      [{ a: 1 }, { a: 1, b: 3 }, [create(ADD, 'b', 3)]],
      // update
      [{ a: 1 }, { a: 3 }, [create(UPDATE, 'a', 3, 1)]],
      // removed
      [{ c: 1, b: 1 }, { b: 1 }, [create(REMOVE, 'c', undefined, 1)]],
      // add, remove & update
      [
        { c: 1, b: 1 },
        { a: 3, b: 4 },
        [
          create(REMOVE, 'c', undefined, 1),
          create(UPDATE, 'b', 4, 1),
          create(ADD, 'a', 3),
        ],
      ],
      // no changes
      [{ a: 1, b: '2', c: 3 }, { a: 1, b: '2', c: 3 }, []],
      // no change - ignorelist
      [
        { a: 1, lastModified: 'today' },
        { a: 1, lastModified: 'yesterday' },
        [],
      ],
      [{ a: 1, modifiedBy: 'me' }, { a: 1, modifiedBy: 'you' }, []],
      [{ a: 1, productCategory: 'x' }, { a: 1, productCategory: 'Y' }, []],
      // ignore undefined
      [{ a: 1, b: undefined }, { a: 1 }, []],
      [{ a: 1 }, { a: 1, b: undefined }, []],
    ])('should compare: %p ==? %p == %p', (previous, current, expected) => {
      expect(component['compare'](previous, current)).toEqual(expected);
    });
  });
});
