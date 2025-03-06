import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { Column, ColumnState, GridApi } from 'ag-grid-community';
import { MockPipe } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTION,
  HISTORY,
  MaterialClass,
  NavigationLevel,
} from '@mac/msd/constants';
import { QuickFilter, QuickFilterType } from '@mac/msd/models';
import { DataFacade } from '@mac/msd/store/facades/data';
import { initialState as qfInitialState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdAgGridConfigService } from '../../services/msd-ag-grid-state/msd-ag-grid-config.service';
import { QuickFilterFacade } from '../../store/facades/quickfilter';
import { STEEL_STATIC_QUICKFILTERS } from './config/steel';
import { QuickFilterComponent } from './quick-filter.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('QuickFilterComponent', () => {
  let component: QuickFilterComponent;
  let spectator: Spectator<QuickFilterComponent>;

  const initialState = {
    msd: {
      quickfilter: qfInitialState,
      data: {
        agGridColumns: '',
        filter: '',
      },
    },
  };

  const createComponent = createComponentFactory({
    component: QuickFilterComponent,
    imports: [MockPipe(PushPipe), provideTranslocoTestingModule({ en })],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      {
        provide: DataFacade,
        useValue: {
          hasEditorRole$: of(false),
          navigation$: of({
            materialClass: MaterialClass.STEEL,
            navigationLevel: NavigationLevel.MATERIAL,
          }),
          sapResult$: new Subject(),
          dispatch: jest.fn(),
        },
      },
      {
        provide: MsdAgGridConfigService,
        useValue: {
          getStaticQuickFilters: jest.fn(() => [] as any[]),
        },
      },
      mockProvider(QuickFilterFacade, {
        publishQuickFilterSucceeded$: of(),
        updatePublicQuickFilterSucceeded$: of(),
        updatePublicQuickFilter: jest.fn(),
        quickFilterActivated$: of(),
      }),
      mockProvider(ApplicationInsightsService, {
        logEvent: jest.fn(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestory', () => {
    it('should complete the observable', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should init the quickfilters when a navigation takes place', () => {
      const mockStaticQuickFilter = {} as QuickFilter;
      const mockSubject = new Subject<{
        materialClass: MaterialClass;
        navigationLevel: NavigationLevel;
      }>();
      component['dataFacade'].navigation$ = mockSubject;
      component['msdAgGridConfigService'].getStaticQuickFilters = jest.fn(
        () => [mockStaticQuickFilter]
      );
      component['qfFacade'].fetchPublishedQuickFilters = jest.fn();
      component['qfFacade'].fetchSubscribedQuickFilters = jest.fn();
      component.managementTabSelected.emit = jest.fn();

      component.ngOnInit();
      mockSubject.next({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      });

      expect(component.active).toEqual(mockStaticQuickFilter);
      expect(
        component['msdAgGridConfigService'].getStaticQuickFilters
      ).toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(
        component['qfFacade'].fetchPublishedQuickFilters
      ).toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(
        component['qfFacade'].fetchSubscribedQuickFilters
      ).toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(component.isManagementTabSelected).toBe(false);
      expect(component.managementTabSelected.emit).toHaveBeenCalledWith(false);
    });

    it('should not init if navigation goes to product category rules', () => {
      const mockStaticQuickFilter = {} as QuickFilter;
      const mockSubject = new Subject<{
        materialClass: MaterialClass;
        navigationLevel: NavigationLevel;
      }>();
      component['dataFacade'].navigation$ = mockSubject;
      component['msdAgGridConfigService'].getStaticQuickFilters = jest.fn(
        () => [mockStaticQuickFilter]
      );
      component['qfFacade'].fetchPublishedQuickFilters = jest.fn();
      component['qfFacade'].fetchSubscribedQuickFilters = jest.fn();
      component.managementTabSelected.emit = jest.fn();

      component.ngOnInit();
      mockSubject.next({
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.PRODUCT_CATEGORY_RULES,
      });

      expect(
        component['msdAgGridConfigService'].getStaticQuickFilters
      ).not.toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(
        component['qfFacade'].fetchPublishedQuickFilters
      ).not.toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(
        component['qfFacade'].fetchSubscribedQuickFilters
      ).not.toHaveBeenCalledWith(MaterialClass.STEEL, NavigationLevel.MATERIAL);
      expect(component.isManagementTabSelected).toBe(false);
      expect(component.managementTabSelected.emit).not.toHaveBeenCalledWith(
        false
      );
    });

    it('should init localStoreage and subscribe to agGrid event', () => {
      const gridApi = {} as GridApi;
      const sub = new BehaviorSubject<{
        gridApi: GridApi;
      }>(undefined);
      component['msdAgGridReadyService'].agGridApi$ = sub;
      component['onAgGridReady'] = jest.fn();

      component.ngOnInit();
      sub.next({ gridApi });
      expect(component['onAgGridReady']).toHaveBeenCalledWith(gridApi);
    });

    it('should set active filter on publishQuickFilterSucceeded', () => {
      const publishedQuickFilter = {
        id: 1,
        title: 'test',
        description: 'filter for test',
      } as QuickFilter;
      component.active = {} as QuickFilter;
      component['qfFacade'].publishQuickFilterSucceeded$ = of({
        publishedQuickFilter,
      } as any);

      component.ngOnInit();

      expect(component.active).toBe(publishedQuickFilter);
    });

    it('should set active filter on updatePublicQuickFilterSucceeded', () => {
      const updatedQuickFilter = {
        id: 1,
        title: 'test',
        description: 'filter for test',
      } as QuickFilter;
      component.active = {} as QuickFilter;
      component['qfFacade'].updatePublicQuickFilterSucceeded$ = of({
        updatedQuickFilter,
      } as any);

      component.ngOnInit();

      expect(component.active).toBe(updatedQuickFilter);
    });

    it('should apply activated filter', () => {
      const quickFilter = {
        id: 1,
        title: 'test',
        description: 'filter for test',
      } as QuickFilter;
      component['applyQuickFilter'] = jest.fn();
      component.managementTabSelected.emit = jest.fn();
      component['qfFacade'].quickFilterActivated$ = of({
        quickFilter,
      } as any);

      component.ngOnInit();

      expect(component['applyQuickFilter']).toHaveBeenCalledWith(quickFilter);
      expect(component.isManagementTabSelected).toBe(false);
      expect(component.managementTabSelected.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('onAgGridReady', () => {
    const quickfilter: QuickFilter = {
      title: 'test',
      filter: {},
      columns: ['a', 'b'],
    };
    const gridApi = {} as undefined as GridApi;
    gridApi.getColumnState = jest.fn(() => [
      { colId: 'a', hide: false },
      { colId: 'b', hide: false },
    ]);

    it('subscriptions should NOT react without changes', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of(quickfilter.filter);

      component['onAgGridReady'](gridApi);

      expect(component['onChange']).not.toHaveBeenCalled();
    });

    it('subscriptions should NOT react with changes only in ignored columns', () => {
      component.active = {
        columns: [ACTION],
      } as QuickFilter;
      component['getCurrentColumns'] = jest.fn(() => [HISTORY]);
      component['onChange'] = jest.fn();
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = new Observable();

      component['onAgGridReady'](gridApi);

      expect(component['onChange']).not.toHaveBeenCalled();
    });
    it('subscriptions should NOT react without active quickfilter', () => {
      component['onChange'] = jest.fn();
      component.active = undefined;
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of({});

      component['onAgGridReady'](gridApi);

      expect(component['onChange']).not.toHaveBeenCalled();
    });
    it('subscriptions should react to updates of agGrid columns', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      gridApi.getColumnState = jest.fn(() => [
        { colId: 'a', hide: true },
        { colId: 'b', hide: false },
      ]);

      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of(quickfilter.filter);

      component['onAgGridReady'](gridApi);

      expect(component['onChange']).toHaveBeenCalled();
    });

    it('subscriptions should react to updates of agGrid filters', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of({ col: 'newvalue' });

      component['onAgGridReady'](gridApi);

      expect(component['onChange']).toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    it('should reset with changes to predifined filters', () => {
      const quickfilter: QuickFilter = {
        title: 'test',
        filter: {},
        columns: ['a', 'b'],
      };
      component['isOwnFilter'] = jest.fn(() => of(false));
      component.staticFilters = [{ title: 'default' } as QuickFilter];
      component.active = quickfilter;
      component['onChange']();

      expect(component.active).toBe(component.staticFilters[0]);
    });

    it('should save changes to local custom filters', () => {
      const quickfilterOld: QuickFilter = {
        title: 'old',
        filter: {},
        columns: ['a', 'b'],
      };
      const quickfilterNew: QuickFilter = {
        title: 'new',
        filter: {},
        columns: ['a', 'b'],
      };
      component.active = quickfilterOld;
      component['agGridToFilter'] = jest.fn(() => quickfilterNew);
      component['qfFacade'].updateLocalQuickFilter = jest.fn();
      component['isOwnFilter'] = jest.fn(() => of(true));

      component['onChange']();

      expect(component.active).toStrictEqual(quickfilterNew);
      expect(component['qfFacade'].updateLocalQuickFilter).toHaveBeenCalledWith(
        quickfilterOld,
        quickfilterNew
      );
    });

    it('should check for changes on published filter', (done) => {
      const quickfilterOld: QuickFilter = {
        id: 1,
        title: 'old',
        filter: {},
        columns: ['a', 'b'],
      };
      const quickfilterNew: QuickFilter = {
        id: 1,
        title: 'new',
        filter: {},
        columns: ['a', 'b'],
      };
      component.active = quickfilterOld;
      component.activePublishedFilterChanged$ = of(false);
      component['agGridToFilter'] = jest.fn(() => quickfilterNew);
      component['qfFacade'].updateLocalQuickFilter = jest.fn();
      component['isOwnFilter'] = jest.fn(() => of(true));
      component['hasActivePublishedFilterChanged'] = jest.fn(() => of(true));

      component['onChange']();

      expect(component.active).toStrictEqual(quickfilterNew);
      expect(
        component['qfFacade'].updateLocalQuickFilter
      ).not.toHaveBeenCalled();
      expect(
        component['hasActivePublishedFilterChanged']
      ).toHaveBeenCalledTimes(1);
      component.activePublishedFilterChanged$.subscribe(
        (activePublishedFilterChanged: boolean) => {
          expect(activePublishedFilterChanged).toBe(true);
          done();
        }
      );
    });
  });

  describe('onQuickfilterSelect', () => {
    const quickfilter: QuickFilter = {
      columns: ['col1', 'col4'],
      filter: { '1': 2 },
      title: 'title',
    };
    it('should call applyQuickfilter', () => {
      const event = {
        value: quickfilter,
      } as MatButtonToggleChange;
      component['applyQuickFilter'] = jest.fn();

      component.onQuickfilterSelect(event);
      expect(component['applyQuickFilter']).toHaveBeenCalledWith(quickfilter);
    });

    describe('applicQuickFilter', () => {
      it('should set column state', () => {
        const createCol = (
          name: string,
          visible: boolean,
          lockVisible = false
        ) =>
          ({
            colId: name,
            hide: !visible,
            lockVisible,
            getColId: jest.fn(() => name),
            getColDef: jest.fn(() => ({ colId: name, lockVisible })),
          }) as unknown as Column;
        const columns: Column[] = [
          createCol('col1', false),
          createCol('col2', true),
          createCol('col3', false),
          createCol('col4', true),
          createCol('locked', true, true),
          createCol('hid&Locked', false, true),
        ];
        const expState: ColumnState[] = [
          { colId: 'col2', hide: true },
          { colId: 'col3', hide: true },
          { colId: 'locked', hide: false },
          { colId: 'hid&Locked', hide: false },
          { colId: 'col1', hide: false },
          { colId: 'col4', hide: false },
        ];

        component['agGridApi'] = {} as GridApi;
        component['agGridApi'].setFilterModel = jest.fn();
        component['agGridApi'].applyColumnState = jest.fn();
        component['agGridApi'].getColumns = jest.fn(() => columns);

        component['applyQuickFilter'](quickfilter);
        expect(component['agGridApi'].getColumns).toHaveBeenCalled();
        expect(component['agGridApi'].setFilterModel).toHaveBeenCalledWith(
          quickfilter.filter
        );
        expect(component['agGridApi'].applyColumnState).toHaveBeenCalledWith({
          state: expState,
          applyOrder: true,
        });
      });
    });
  });

  it('reset should reset active element', () => {
    component.staticFilters = [{ title: 'default' } as QuickFilter];
    component.active = {} as QuickFilter;
    component['reset']();
    expect(component.active).toBe(component.staticFilters[0]);
  });

  describe('getVisibleColumns', () => {
    it('should only return visible columns', () => {
      const response = [
        { colId: '1', hide: false },
        { colId: '2', hide: true },
        { colId: '3', hide: false },
        { colId: '4', hide: true },
      ];
      const expected = ['1', '3'];

      component['agGridApi'] = {} as GridApi;
      component['agGridApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });

    it('should only return visible columns - empty list', () => {
      const response = [
        { colId: '1', hide: true },
        { colId: '2', hide: true },
      ];
      const expected: string[] = [];

      component['agGridApi'] = {} as GridApi;
      component['agGridApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });

    it('should only return visible columns - all items', () => {
      const response = [
        { colId: '1', hide: false },
        { colId: '2', hide: false },
      ];
      const expected: string[] = ['1', '2'];

      component['agGridApi'] = {} as GridApi;
      component['agGridApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });
  });

  describe('openDialog', () => {
    it('should open dialog with selected item in edit mode', () => {
      const filter = { title: 'title' } as QuickFilter;
      const ref = {} as MatDialogRef<any>;
      const sub = new Subject();
      component['dialog'].open = jest.fn(() => ref);
      ref.afterClosed = jest.fn(() => sub);
      component['onDialogClose'] = jest.fn();
      const result = {
        data: { title: filter.title, edit: true, delete: false },
      };

      component.openDialog(filter);
      sub.next(result);

      expect(component['activeEdit']).toBe(filter);
      expect(component['dialog'].open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: {
            quickFilter: filter,
            edit: true,
            delete: false,
          },
        })
      );
      expect(ref.afterClosed).toHaveBeenCalled();
      expect(component['onDialogClose']).toHaveBeenCalledWith(result);
    });

    it('should open dialog in normal mode', () => {
      const ref = {} as MatDialogRef<any>;
      const sub = new Subject();
      component['dialog'].open = jest.fn(() => ref);
      ref.afterClosed = jest.fn(() => sub);
      component['onDialogClose'] = jest.fn();
      const result = { data: { edit: false, delete: false } };

      component.openDialog();
      sub.next(result);

      expect(component['activeEdit']).toBe(undefined);
      expect(component['dialog'].open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining(result)
      );
      expect(ref.afterClosed).toHaveBeenCalled();
      expect(component['onDialogClose']).toHaveBeenCalledWith(result);
    });
  });

  describe('onDialogClose', () => {
    it('should remove a quickfilter after confirmation', () => {
      const result = {
        title: '',
        description: '',
        quickFilterType: QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
        edit: false,
        delete: true,
      };
      component['reset'] = jest.fn();
      component['qfFacade'].deleteQuickFilter = jest.fn();
      const filter = {} as QuickFilter;
      component.active = undefined;
      component['activeEdit'] = filter;

      component['onDialogClose'](result);
      expect(component['qfFacade'].deleteQuickFilter).toHaveBeenCalledWith(
        filter
      );
      expect(component['reset']).not.toHaveBeenCalled();
    });
    it('remove should dispatch event and reset', () => {
      const result = {
        title: '',
        description: '',
        quickFilterType: QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
        edit: false,
        delete: true,
      };
      component['reset'] = jest.fn();
      component['qfFacade'].deleteQuickFilter = jest.fn();
      const filter = {} as QuickFilter;
      component.active = filter;
      component['activeEdit'] = filter;

      component['onDialogClose'](result);
      expect(component['qfFacade'].deleteQuickFilter).toHaveBeenCalledWith(
        filter
      );
      expect(component['reset']).toHaveBeenCalled();
    });

    it('should update quickfilter after edit', () => {
      const oldFilter: QuickFilter = {
        title: 'oldTitle',
        description: 'test',
        columns: ['1'],
        filter: { a: 2 },
      };
      const newFilter: QuickFilter = { ...oldFilter, title: 'newTitle' };

      const obj = {
        title: newFilter.title,
        description: oldFilter.description,
        quickFilterType: QuickFilterType.PUBLIC,
        edit: true,
        delete: false,
      };
      component['activeEdit'] = oldFilter;
      component['applyQuickFilter'] = jest.fn();
      component['qfFacade'].updateQuickFilter = jest.fn();

      component['onDialogClose'](obj);
      expect(component['qfFacade'].updateQuickFilter).toHaveBeenCalledWith(
        oldFilter,
        newFilter,
        component.hasEditorRole$
      );
      expect(component['applyQuickFilter']).not.toHaveBeenCalled();
      expect(component['activeEdit']).toBeFalsy();
    });
    it('should add quickfilter from current after close - no edit', () => {
      const obj = {
        title: 'title',
        description: '',
        quickFilterType: QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
        edit: false,
        delete: false,
      };
      const quickFilter = {} as QuickFilter;
      component['applyQuickFilter'] = jest.fn();
      component['agGridToFilter'] = jest.fn(() => quickFilter);
      component['copyDefaultFilter'] = jest.fn(() => quickFilter);
      component['qfFacade'].createQuickFilter = jest.fn();

      component['onDialogClose'](obj);
      expect(component['agGridToFilter']).toHaveBeenCalled();
      expect(component['copyDefaultFilter']).not.toHaveBeenCalled();
      expect(component['qfFacade'].createQuickFilter).toHaveBeenCalledWith(
        quickFilter
      );
      expect(component['applyQuickFilter']).toHaveBeenCalledWith(quickFilter);
    });
    it('should add quickfilter from default after close - no edit', () => {
      const obj = {
        title: 'title',
        description: '',
        quickFilterType: QuickFilterType.LOCAL_FROM_STANDARD,
        edit: false,
        delete: false,
      };
      const quickFilter = {} as QuickFilter;
      component['applyQuickFilter'] = jest.fn();
      component['qfFacade'].createQuickFilter = jest.fn();
      component['agGridToFilter'] = jest.fn(() => quickFilter);
      component['copyDefaultFilter'] = jest.fn(() => quickFilter);

      component['onDialogClose'](obj);
      expect(component['agGridToFilter']).not.toHaveBeenCalled();
      expect(component['copyDefaultFilter']).toHaveBeenCalled();
      expect(component['qfFacade'].createQuickFilter).toHaveBeenCalledWith(
        quickFilter
      );
      expect(component['applyQuickFilter']).toHaveBeenCalledWith(quickFilter);
    });
    it('should ignore response with empty result object', () => {
      component['applyQuickFilter'] = jest.fn();
      component['onDialogClose']();
      expect(component['applyQuickFilter']).not.toHaveBeenCalled();
    });
  });

  describe('publishPublicChanges', () => {
    it('should post data and metric', () => {
      component.publishPublicChanges();
      expect(component['qfFacade'].updatePublicQuickFilter).toHaveBeenCalled();
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalled();
    });
  });

  it('agGirdToFilter should return a filter from current agGrid config', () => {
    const title = 'abc';
    const description = '';
    const columns = ['1', '2', '3'];
    const filter = { a: 23 };
    component['getCurrentColumns'] = jest.fn(() => columns);
    component['agGridApi'] = {} as GridApi;
    component['agGridApi'].getFilterModel = jest.fn(() => filter);

    const result = component['agGridToFilter'](title, description);
    expect(result.title).toBe(title);
    expect(result.filter).toBe(filter);
    expect(result.columns).toBe(columns);
    expect(component['getCurrentColumns']).toHaveBeenCalled();
    expect(component['agGridApi'].getFilterModel).toHaveBeenCalled();
  });

  it('copyDefaultFilter should copy first predefined filter', () => {
    component.staticFilters = [STEEL_STATIC_QUICKFILTERS[0]];
    const title = 'abc';
    const origin = STEEL_STATIC_QUICKFILTERS[0];
    const result = component['copyDefaultFilter'](title);
    expect(result.title).toBe(title);
    expect(result.columns).toBe(origin.columns);
    expect(result.filter).toBe(origin.filter);
  });

  it('add should open dialog', () => {
    component['openDialog'] = jest.fn();

    component.add();
    expect(component['openDialog']).toHaveBeenCalledWith();
  });

  it('edit should open dialog', () => {
    component['openDialog'] = jest.fn();
    const filter = {} as QuickFilter;

    component.edit(filter);
    expect(component['openDialog']).toHaveBeenCalledWith(filter);
  });

  describe('remove', () => {
    it('remove should open a dialog', () => {
      component['openDialog'] = jest.fn();
      const filter = {} as QuickFilter;

      component.remove(filter);
      expect(component['openDialog']).toHaveBeenCalledWith(filter, true);
    });
  });

  describe('isOwnFilter', () => {
    it('should return true for published filters', (done) => {
      component.ownFilters$ = of([
        { id: 1, title: 'test' },
        { id: 2 },
      ] as QuickFilter[]);

      component['isOwnFilter']({ id: 1 } as QuickFilter).subscribe(
        (isOwn: boolean) => {
          expect(isOwn).toBe(true);
          done();
        }
      );
    });

    it('should return false for published filters', (done) => {
      component.ownFilters$ = of([
        { id: 1, title: 'test' },
        { id: 2 },
      ] as QuickFilter[]);

      component['isOwnFilter']({
        id: 3,
        title: 'test',
      } as QuickFilter).subscribe((isOwn: boolean) => {
        expect(isOwn).toBe(false);
        done();
      });
    });

    it('should return true for local filters', (done) => {
      const filters = [{ title: 'test' }, { title: 'test 2' }] as QuickFilter[];
      component.ownFilters$ = of(filters);

      component['isOwnFilter'](filters[0]).subscribe((isOwn: boolean) => {
        expect(isOwn).toBe(true);
        done();
      });
    });

    it('should return false for local filters', (done) => {
      const filters = [{ title: 'test' }, { title: 'test 2' }] as QuickFilter[];
      component.ownFilters$ = of(filters);

      component['isOwnFilter']({ title: 'test 2' } as QuickFilter).subscribe(
        (isOwn: boolean) => {
          expect(isOwn).toBe(false);
          done();
        }
      );
    });
  });

  describe('hasActivePublishedFilterChanged', () => {
    it('should return false if the active filter is not public', (done) => {
      component.qfFacade.publishedQuickFilters$ = of([
        { id: 1, title: 'test' },
        { id: 2 },
      ] as QuickFilter[]);
      component.active = {
        title: 'test',
      } as QuickFilter;

      component['hasActivePublishedFilterChanged']().subscribe(
        (hasActivePublishedFilterChanged: boolean) => {
          expect(hasActivePublishedFilterChanged).toBe(false);
          done();
        }
      );
    });

    it('should return true if columns have been changed', (done) => {
      component.qfFacade.publishedQuickFilters$ = of([
        { id: 1, title: 'test', columns: ['a', 'b'] },
        { id: 2 },
      ] as QuickFilter[]);
      component.active = {
        id: 1,
        title: 'test',
        columns: ['a', 'b', 'c'],
      } as QuickFilter;

      component['hasActivePublishedFilterChanged']().subscribe(
        (hasActivePublishedFilterChanged: boolean) => {
          expect(hasActivePublishedFilterChanged).toBe(true);
          done();
        }
      );
    });

    it('should return true if filter has been changed', (done) => {
      component.qfFacade.publishedQuickFilters$ = of([
        {
          id: 1,
          title: 'test',
          filter: {
            co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
          },
        },
        { id: 2 },
      ] as QuickFilter[]);
      component.active = {
        id: 1,
        title: 'test',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 2 },
        },
      } as unknown as QuickFilter;

      component['hasActivePublishedFilterChanged']().subscribe(
        (hasActivePublishedFilterChanged: boolean) => {
          expect(hasActivePublishedFilterChanged).toBe(true);
          done();
        }
      );
    });

    it('should return false if nothing has been changed', (done) => {
      component.qfFacade.publishedQuickFilters$ = of([
        {
          id: 1,
          title: 'test',
          columns: ['a', 'b', 'c'],
          filter: {
            co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
          },
        },
        { id: 2 },
      ] as QuickFilter[]);
      component.active = {
        id: 1,
        title: 'test',
        columns: ['a', 'b', 'c'],
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
      } as unknown as QuickFilter;

      component['hasActivePublishedFilterChanged']().subscribe(
        (hasActivePublishedFilterChanged: boolean) => {
          expect(hasActivePublishedFilterChanged).toBe(false);
          done();
        }
      );
    });
  });
});
