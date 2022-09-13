import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of, Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Column, ColumnApi, ColumnState, GridApi } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { QuickFilter } from '../../models';
import { addCustomQuickfilter, updateCustomQuickfilter } from '../../store';
import { initialState as qfInitialState } from '../../store/reducers/quickfilter/quickfilter.reducer';
import { StaticQuickFilters } from './config/quickfilter-definitions';
import { QuickFilterComponent } from './quick-filter.component';

describe('QuickFilterComponent', () => {
  let component: QuickFilterComponent;
  let spectator: Spectator<QuickFilterComponent>;
  let store: MockStore;

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
    imports: [
      CommonModule,
      MatIconModule,
      MatButtonToggleModule,
      MatTooltipModule,
      PushModule,
      MatButtonModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
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
    it('should init localStoreage and subscribe to agGrid event', () => {
      const gridApi = {} as GridApi;
      const columnApi = {} as ColumnApi;
      const sub = new Subject<{
        gridApi: GridApi;
        columnApi: ColumnApi;
      }>();
      component['quickfilterStateService'].init = jest.fn();
      component['agGridStateService'].agGridApi = sub;
      component['onAgGridReady'] = jest.fn();

      component.ngOnInit();
      sub.next({ gridApi, columnApi });
      expect(component['quickfilterStateService'].init).toBeCalled();
      expect(component['onAgGridReady']).toBeCalledWith(gridApi, columnApi);
    });
  });

  describe('onAgGridReady', () => {
    const quickfilter: QuickFilter = {
      title: 'test',
      filter: {},
      columns: ['a', 'b'],
      custom: false,
    };
    const gridApi = {} as undefined as GridApi;
    const columnApi = {} as undefined as ColumnApi;
    columnApi.getColumnState = jest.fn(() => [
      { colId: 'a', hide: false },
      { colId: 'b', hide: false },
    ]);

    it('subscriptions should NOT react without changes', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of(quickfilter.filter);

      component['onAgGridReady'](gridApi, columnApi);

      expect(component['onChange']).not.toBeCalled();
    });
    it('subscriptions should NOT react without active quickfilter', () => {
      component['onChange'] = jest.fn();
      component.active = undefined;
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of({});

      component['onAgGridReady'](gridApi, columnApi);

      expect(component['onChange']).not.toBeCalled();
    });
    it('subscriptions should react to updates of agGrid columns', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      columnApi.getColumnState = jest.fn(() => [
        { colId: 'a', hide: true },
        { colId: 'b', hide: false },
      ]);

      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of(quickfilter.filter);

      component['onAgGridReady'](gridApi, columnApi);

      expect(component['onChange']).toBeCalled();
    });

    it('subscriptions should react to updates of agGrid filters', () => {
      component.active = quickfilter;
      component['onChange'] = jest.fn();
      component['dataFacade'].agGridColumns$ = of('');
      component['dataFacade'].agGridFilter$ = of({ col: 'newvalue' });

      component['onAgGridReady'](gridApi, columnApi);

      expect(component['onChange']).toBeCalled();
    });
  });

  describe('onChange', () => {
    it('should reset with changes to predifined filters', () => {
      const quickfilter: QuickFilter = {
        title: 'test',
        filter: {},
        columns: ['a', 'b'],
        custom: false,
      };
      component.active = quickfilter;
      component['onChange']();

      expect(component.active).toBe(component.staticFilters[0]);
    });

    it('should save changes to custom filters', () => {
      const quickfilterOld: QuickFilter = {
        title: 'old',
        filter: {},
        columns: ['a', 'b'],
        custom: true,
      };
      const quickfilterNew: QuickFilter = {
        title: 'new',
        filter: {},
        columns: ['a', 'b'],
        custom: true,
      };
      component.active = quickfilterOld;
      component['agGridToFilter'] = jest.fn(() => quickfilterNew);
      component['qfFacade'].dispatch = jest.fn();

      component['onChange']();

      expect(component.active).toBe(quickfilterNew);
      expect(component['qfFacade'].dispatch).toBeCalled();
    });
  });

  describe('onQuickfilterSelect', () => {
    const quickfilter: QuickFilter = {
      columns: ['col1', 'col4'],
      custom: false,
      filter: { '1': 2 },
      title: 'title',
    };
    it('should call applyQuickfilter', () => {
      const event = {
        value: quickfilter,
      } as MatButtonToggleChange;
      component['applyQuickFilter'] = jest.fn();

      component.onQuickfilterSelect(event);
      expect(component['applyQuickFilter']).toBeCalledWith(quickfilter);
    });

    describe('applicQuickFilter', () => {
      it('should set column state', () => {
        const createCol = (name: string, visible: boolean) =>
          new Column({ hide: !visible }, {}, name, true);
        const columns: Column[] = [
          createCol('col1', false),
          createCol('col2', true),
          createCol('col3', false),
          createCol('col4', true),
        ];
        const expState: ColumnState[] = [
          { colId: 'col2', hide: true },
          { colId: 'col3', hide: true },
          { colId: 'col1', hide: false },
          { colId: 'col4', hide: false },
        ];

        component['agGridApi'] = {} as GridApi;
        component['agGridColumnApi'] = {} as ColumnApi;
        component['agGridApi'].setFilterModel = jest.fn();
        component['agGridColumnApi'].applyColumnState = jest.fn();
        component['agGridColumnApi'].getColumns = jest.fn(() => columns);

        component['applyQuickFilter'](quickfilter);
        expect(component['agGridColumnApi'].getColumns).toBeCalled();
        expect(component['agGridApi'].setFilterModel).toBeCalledWith(
          quickfilter.filter
        );
        expect(component['agGridColumnApi'].applyColumnState).toBeCalledWith({
          state: expState,
          applyOrder: true,
        });
      });
    });
  });

  it('reset should reset active element', () => {
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

      component['agGridColumnApi'] = {} as ColumnApi;
      component['agGridColumnApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });

    it('should only return visible columns - empty list', () => {
      const response = [
        { colId: '1', hide: true },
        { colId: '2', hide: true },
      ];
      const expected: string[] = [];

      component['agGridColumnApi'] = {} as ColumnApi;
      component['agGridColumnApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });

    it('should only return visible columns - all items', () => {
      const response = [
        { colId: '1', hide: false },
        { colId: '2', hide: false },
      ];
      const expected: string[] = ['1', '2'];

      component['agGridColumnApi'] = {} as ColumnApi;
      component['agGridColumnApi'].getColumnState = jest.fn(() => response);

      expect(component['getCurrentColumns']()).toStrictEqual(expected);
    });
  });

  describe('openDialog', () => {
    it('should open dialog with selected item in edit mode', () => {
      const filter = { title: 'title' } as QuickFilter;
      const ref = {} as MatDialogRef<any>;
      const sub = new Subject();
      component.dialog.open = jest.fn(() => ref);
      ref.afterClosed = jest.fn(() => sub);
      component['onDialogClose'] = jest.fn();
      const result = { data: { title: filter.title, edit: true } };

      component.openDialog(filter);
      sub.next(result);

      expect(component['activeEdit']).toBe(filter);
      expect(component.dialog.open).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(result)
      );
      expect(ref.afterClosed).toBeCalled();
      expect(component['onDialogClose']).toBeCalledWith(result);
    });

    it('should open dialog in normal mode', () => {
      const ref = {} as MatDialogRef<any>;
      const sub = new Subject();
      component.dialog.open = jest.fn(() => ref);
      ref.afterClosed = jest.fn(() => sub);
      component['onDialogClose'] = jest.fn();
      const result = { data: { edit: false } };

      component.openDialog();
      sub.next(result);

      expect(component['activeEdit']).toBe(undefined);
      expect(component.dialog.open).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(result)
      );
      expect(ref.afterClosed).toBeCalled();
      expect(component['onDialogClose']).toBeCalledWith(result);
    });
  });

  describe('onDialogClose', () => {
    it('should update quickfilter after edit', () => {
      const oldFilter: QuickFilter = {
        title: 'oldTitle',
        columns: ['1'],
        filter: { a: 2 },
        custom: false,
      };
      const newFilter: QuickFilter = { ...oldFilter, title: 'newTitle' };

      const obj = {
        title: newFilter.title,
        fromCurrent: 'true',
        edit: true,
      };
      component['activeEdit'] = oldFilter;
      component['applyQuickFilter'] = jest.fn();

      component['onDialogClose'](obj);
      expect(store.dispatch).toHaveBeenCalledWith(
        updateCustomQuickfilter({
          oldFilter,
          newFilter,
        })
      );
      expect(component['applyQuickFilter']).not.toHaveBeenCalled();
      expect(component['activeEdit']).toBeFalsy();
    });
    it('should add quickfilter from current after close - no edit', () => {
      const obj = {
        title: 'title',
        fromCurrent: 'true',
        edit: false,
      };
      const quickFilter = {} as QuickFilter;
      component['applyQuickFilter'] = jest.fn();
      component['agGridToFilter'] = jest.fn(() => quickFilter);
      component['copyDefaultFilter'] = jest.fn(() => quickFilter);

      component['onDialogClose'](obj);
      expect(component['agGridToFilter']).toBeCalled();
      expect(component['copyDefaultFilter']).not.toBeCalled();
      expect(store.dispatch).toBeCalledWith(
        addCustomQuickfilter({ filter: quickFilter })
      );
      expect(component['applyQuickFilter']).toBeCalledWith(quickFilter);
    });
    it('should add quickfilter from default after close - no edit', () => {
      const obj = {
        title: 'title',
        fromCurrent: 'false',
        edit: false,
      };
      const quickFilter = {} as QuickFilter;
      component['applyQuickFilter'] = jest.fn();
      component['agGridToFilter'] = jest.fn(() => quickFilter);
      component['copyDefaultFilter'] = jest.fn(() => quickFilter);

      component['onDialogClose'](obj);
      expect(component['agGridToFilter']).not.toBeCalled();
      expect(component['copyDefaultFilter']).toBeCalled();
      expect(store.dispatch).toBeCalledWith(
        addCustomQuickfilter({ filter: quickFilter })
      );
      expect(component['applyQuickFilter']).toBeCalledWith(quickFilter);
    });
    it('should ignore response with empty result object', () => {
      component['applyQuickFilter'] = jest.fn();
      component['onDialogClose']();
      expect(component['applyQuickFilter']).not.toBeCalled();
    });
  });

  it('agGirdToFilter should return a filter from current agGrid config', () => {
    const title = 'abc';
    const columns = ['1', '2', '3'];
    const filter = { a: 23 };
    component['getCurrentColumns'] = jest.fn(() => columns);
    component['agGridApi'] = {} as GridApi;
    component['agGridApi'].getFilterModel = jest.fn(() => filter);

    const result = component['agGridToFilter'](title);
    expect(result.title).toBe(title);
    expect(result.custom).toBeTruthy();
    expect(result.filter).toBe(filter);
    expect(result.columns).toBe(columns);
    expect(component['getCurrentColumns']).toBeCalled();
    expect(component['agGridApi'].getFilterModel).toBeCalled();
  });

  it('copyDefaultFilter should copy first predefined filter', () => {
    const title = 'abc';
    const origin = StaticQuickFilters[0];
    const result = component['copyDefaultFilter'](title);
    expect(result.title).toBe(title);
    expect(result.custom).toBeTruthy();
    expect(result.columns).toBe(origin.columns);
    expect(result.filter).toBe(origin.filter);
  });

  it('add should open dialog', () => {
    component['openDialog'] = jest.fn();

    component.add();
    expect(component['openDialog']).toBeCalledWith();
  });

  it('edit should open dialog', () => {
    component['openDialog'] = jest.fn();
    const filter = {} as QuickFilter;

    component.edit(filter);
    expect(component['openDialog']).toBeCalledWith(filter);
  });

  describe('remove', () => {
    it('remove should dipatch event', () => {
      component['reset'] = jest.fn();
      component['qfFacade'].dispatch = jest.fn();
      const filter = {} as QuickFilter;
      component.active = undefined;

      component.remove(filter);
      expect(component['qfFacade'].dispatch).toBeCalled();
      expect(component['reset']).not.toBeCalled();
    });
    it('remove should dipatch event and reset', () => {
      component['reset'] = jest.fn();
      component['qfFacade'].dispatch = jest.fn();
      const filter = {} as QuickFilter;
      component.active = filter;

      component.remove(filter);
      expect(component['qfFacade'].dispatch).toBeCalled();
      expect(component['reset']).toBeCalled();
    });
  });
});
