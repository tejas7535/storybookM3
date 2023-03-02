import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, of, Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  Column,
  ColumnApi,
  ExcelRow,
  IFilterComp,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  RowClassParams,
  RowNode,
} from 'ag-grid-community';
import { ColDef, ColumnState, GridApi } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  LAST_MODIFIED,
  MaterialClass,
  NavigationLevel,
  RELEASE_DATE,
  RELEASED_STATUS,
  SAP_SUPPLIER_IDS,
  Status,
} from '@mac/msd/constants';
import { QuickFilterComponent } from '@mac/msd/main-table/quick-filter/quick-filter.component';
import { STEEL_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/steel';
import { DataResult, MaterialFormValue } from '@mac/msd/models';
import {
  MsdAgGridConfigService,
  MsdAgGridStateService,
  MsdDialogService,
} from '@mac/msd/services';
import {
  fetchResult,
  setAgGridColumns,
  setAgGridFilter,
  setNavigation,
} from '@mac/msd/store/actions/data';
import {
  materialDialogCanceled,
  minimizeDialog,
  openDialog,
} from '@mac/msd/store/actions/dialog';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import { initialState as initialQuickfilterState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import * as en from '../../../../assets/i18n/en.json';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { MsdNavigationModule } from './msd-navigation/msd-navigation.module';
import { STEEL_STATIC_QUICKFILTERS } from './quick-filter/config/steel';
import { getStatus } from './util';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  getStatus: jest.fn(),
}));

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let spectator: Spectator<MainTableComponent>;
  let store: MockStore;
  let route: ActivatedRoute;
  let router: Router;

  let afterOpened: () => Subject<void>;
  let afterClosed: () => Subject<{
    reload?: boolean;
    minimize?: { id?: number; value: MaterialFormValue };
  }>;
  let mockDialogRef: MatDialogRef<any>;

  let mockSubjectOpen: Subject<void>;
  let mockSubjectClose: Subject<{
    reload?: boolean;
    minimize?: { id?: number; value: MaterialFormValue };
  }>;

  const initialState = {
    msd: {
      data: initialDataState,
      dialog: initialDialogState,
      quickfilter: initialQuickfilterState,
    },
    'azure-auth': {
      accountInfo: {
        idTokenClaims: {
          roles: ['material-supplier-database-test-editor'],
        },
        department: 'mock_department',
        homeAccountId: 'mock_id',
        environment: 'mock_environment',
        tenantId: 'mock_id',
        username: 'mock_name',
        localAccountId: 'mock_id',
        name: 'mock_name',
      },
      profileImage: {
        url: 'mock_url',
        loading: false,
        errorMessage: 'mock_message',
      },
    },
  };

  const createComponent = createComponentFactory({
    component: MainTableComponent,
    imports: [
      MatDialogModule,
      CommonModule,
      MainTableRoutingModule,
      RouterTestingModule,
      AgGridModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
      LetModule,
      PushModule,
      MatButtonModule,
      LoadingSpinnerModule,
      MatCheckboxModule,
      MatIconModule,
      QuickFilterComponent,
      MsdNavigationModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      DatePipe,
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MsdDialogService,
        useValue: {
          openDialog: jest.fn(() => mockDialogRef),
        },
      },
      {
        provide: MsdAgGridStateService,
        useValue: {},
      },
      {
        provide: MsdAgGridConfigService,
        useValue: {
          getStaticQuickFilters: jest.fn(() => STEEL_STATIC_QUICKFILTERS),
          columnDefinitions$: new BehaviorSubject({
            defaultColumnDefinitions: STEEL_COLUMN_DEFINITIONS,
            savedColumnState: undefined,
          }),
        },
      },
    ],
    declarations: [MainTableComponent],
  });

  beforeEach(() => {
    mockSubjectOpen = new Subject<void>();
    mockSubjectClose = new Subject<{
      reload?: boolean;
      minimize?: { id?: number; value: MaterialFormValue };
    }>();
    afterOpened = () => mockSubjectOpen;
    afterClosed = () => mockSubjectClose;
    mockDialogRef = {
      afterOpened,
      afterClosed,
    } as unknown as MatDialogRef<any>;

    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    route = spectator.inject(ActivatedRoute);
    router = spectator.inject(Router);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnDestory', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });
  describe('parseQueryParams', () => {
    it('should do nothing if no filters are set in query params', () => {
      component['changeDetectorRef'].markForCheck = jest.fn();
      component['changeDetectorRef'].detectChanges = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      route.snapshot.queryParamMap.get = jest.fn(() => undefined);

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'materialClass'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'navigationLevel'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamAgGridFilter']).not.toHaveBeenCalled();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });

    it('should call the set filter functions if filters are defined in query params', () => {
      component['dataFacade'].dispatch = jest.fn();
      component['changeDetectorRef'].markForCheck = jest.fn();
      component['changeDetectorRef'].detectChanges = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      route.snapshot.queryParamMap.get = jest.fn((str) => {
        switch (str) {
          case 'materialClass':
            return 'st';
          case 'navigationLevel':
            return 'materials';
          default:
            return 'some params';
        }
      });

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'materialClass'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'navigationLevel'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamAgGridFilter']).toHaveBeenCalledWith(
        'some params'
      );

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        setNavigation({
          materialClass: MaterialClass.STEEL,
          navigationLevel: NavigationLevel.MATERIAL,
        })
      );

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
      expect(component['changeDetectorRef'].detectChanges).toHaveBeenCalled();
    });

    it('should subscribe to the columnDefinitions', () => {
      component.getColumnDefs = jest.fn();
      component['agGridColumnApi'] = {
        applyColumnState: jest.fn(),
      } as unknown as ColumnApi;

      jest.useFakeTimers();

      component['agGridConfigService'].columnDefinitions$.next({
        defaultColumnDefinitions: STEEL_COLUMN_DEFINITIONS,
        savedColumnState: [],
      });

      jest.advanceTimersByTime(1000);

      expect(component.getColumnDefs).toHaveBeenCalled();
      expect(
        component['agGridColumnApi'].applyColumnState
      ).toHaveBeenCalledWith({
        state: [],
        applyOrder: true,
      });

      jest.useRealTimers();
    });
  });

  describe('setParamAgGridFilter', () => {
    it('should do nothing if filterModel is not defined', () => {
      const mockFilterString = 'some filter';
      // eslint-disable-next-line unicorn/no-useless-undefined
      JSON.parse = jest.fn(() => undefined);

      component['setParamAgGridFilter'](mockFilterString);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
    it('should dispatch agGridFilter and set list controls if filter is defined', () => {
      const mockFilterString = 'some filter';
      const mockFilterValue = ['some filter value'];
      const mockFilterModel = {
        materialStandardMaterialNameHiddenFilter: { values: mockFilterValue },
        materialStandardStandardDocumentHiddenFilter: {
          values: mockFilterValue,
        },
        materialNumbers: { values: mockFilterValue },
      };
      // eslint-disable-next-line unicorn/no-useless-undefined
      JSON.parse = jest.fn(() => mockFilterModel);

      component['setParamAgGridFilter'](mockFilterString);

      expect(store.dispatch).toHaveBeenLastCalledWith(
        setAgGridFilter({ filterModel: mockFilterModel })
      );
    });
  });

  describe('onFilterChange', () => {
    it('should dispatch agGridFilter and filtered rows on defined filter', () => {
      const mockFilterModel = { 'some filter': 'some value' };
      const mockDataResult: DataResult = {
        id: 0,
        manufacturerSupplierName: 'gibt net',
      } as DataResult;
      const mockRowNodes = [{ data: mockDataResult }];

      const mockApi = {
        getFilterModel: jest.fn(() => mockFilterModel),
        forEachNodeAfterFilter: jest.fn((fn: (rowNode: RowNode) => any) =>
          mockRowNodes.map((rowNode) => fn(rowNode as RowNode))
        ),
        getDisplayedRowCount: jest.fn(() => 0),
      };

      component.onFilterChange({ api: mockApi as unknown as GridApi });

      expect(mockApi.getFilterModel).toHaveBeenCalled();

      expect(store.dispatch).toBeCalledWith(
        setAgGridFilter({ filterModel: mockFilterModel })
      );
    });
    it('should dispatch agGridFilter and filtered rows and reset the list controls on empty filter', () => {
      const mockFilterModel = {};
      const mockDataResult: DataResult = {
        id: 0,
        manufacturerSupplierName: 'gibt net',
      } as DataResult;
      const mockRowNodes = [{ data: mockDataResult }];

      const mockApi = {
        getFilterModel: jest.fn(() => mockFilterModel),
        forEachNodeAfterFilter: jest.fn((fn: (rowNode: RowNode) => any) =>
          mockRowNodes.map((rowNode) => fn(rowNode as RowNode))
        ),
        getDisplayedRowCount: jest.fn(() => 0),
      };

      component.onFilterChange({ api: mockApi as unknown as GridApi });

      expect(mockApi.getFilterModel).toHaveBeenCalled();

      expect(store.dispatch).toBeCalledWith(
        setAgGridFilter({ filterModel: mockFilterModel })
      );
    });
  });
  describe('setAgGridFilter', () => {
    it('should set filterModel if it is defined', () => {
      const mockApi = {
        setFilterModel: jest.fn(),
      };
      component['dataFacade'].agGridFilter$ = of({});

      component['agGridApi'] = undefined;

      component.setAgGridFilter({ api: mockApi as unknown as GridApi });

      expect(component['agGridApi']).toEqual(mockApi as unknown as GridApi);
      expect(mockApi.setFilterModel).toHaveBeenCalledWith({});
    });
    it('should do nothing if filterModel is not defined', () => {
      const mockApi = {
        setFilterModel: jest.fn(),
      };
      // eslint-disable-next-line unicorn/no-useless-undefined
      component['dataFacade'].agGridFilter$ = of(undefined);

      component['agGridApi'] = undefined;

      component.setAgGridFilter({ api: mockApi as unknown as GridApi });

      expect(component['agGridApi']).toEqual(mockApi as unknown as GridApi);
      expect(mockApi.setFilterModel).not.toHaveBeenCalled();
    });
  });
  describe('compareStringOptions', () => {
    it('should return false if a is not defined', () => {
      const a: StringOption = undefined;
      const b: StringOption = { id: 0, title: 'gibts net' };

      const result = component.compareStringOptions(a, b);

      expect(result).toBe(false);
    });
    it('should return false if b is not defined', () => {
      const a: StringOption = { id: 0, title: 'gibts net' };
      const b: StringOption = undefined;

      const result = component.compareStringOptions(a, b);

      expect(result).toBe(false);
    });
    it('should return false if a.id is not equal to b.id', () => {
      const a: StringOption = { id: 0, title: 'gibts net' };
      const b: StringOption = { id: 1, title: 'gibts net' };

      const result = component.compareStringOptions(a, b);

      expect(result).toBe(false);
    });
    it('should return false if a.name is not equal to b.name', () => {
      const a: StringOption = { id: 0, title: 'gibts net' };
      const b: StringOption = { id: 0, title: 'gibts scho' };

      const result = component.compareStringOptions(a, b);

      expect(result).toBe(false);
    });
    it('should return true if a and b have same id and name', () => {
      const a: StringOption = { id: 0, title: 'gibts net' };
      const b: StringOption = { id: 0, title: 'gibts net' };

      const result = component.compareStringOptions(a, b);

      expect(result).toBe(true);
    });
  });
  describe('fetchResult', () => {
    it('should dispatch fetchResult', () => {
      component['dataFacade'].dispatch = jest.fn();

      component.fetchResult();

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        fetchResult()
      );
    });
  });
  describe('onGridReady', () => {
    it('should dispatch setFilteredRows and set column count', () => {
      const mockDataResult: DataResult = {
        id: 0,
        manufacturerSupplierName: 'gibt net',
      } as DataResult;
      const mockRowNodes = [{ data: mockDataResult }];
      const mockApi = {
        forEachNodeAfterFilter: jest.fn((fn: (rowNode: RowNode) => any) =>
          mockRowNodes.map((rowNode) => fn(rowNode as RowNode))
        ),
        getDisplayedRowCount: jest.fn(() => 0),
      };
      const mockColumnApi = {
        applyColumnState: jest.fn(),
      };

      // eslint-disable-next-line unicorn/no-useless-undefined
      component['agGridReadyService'].agGridApiready = jest.fn(() => '');

      component.setAgGridFilter = jest.fn();

      component['agGridApi'] = undefined;
      component['agGridColumnApi'] = undefined;
      component['setVisibleColumns'] = jest.fn();

      component.onGridReady({
        api: mockApi as unknown as GridApi,
        columnApi: mockColumnApi as unknown as ColumnApi,
      });

      expect(component['agGridApi']).toEqual(mockApi as unknown as GridApi);
      expect(component['agGridColumnApi']).toEqual(
        mockColumnApi as unknown as ColumnApi
      );

      expect(component.setAgGridFilter).toHaveBeenCalledWith({ api: mockApi });
      expect(component['setVisibleColumns']).toHaveBeenCalled();
      expect(component['agGridReadyService'].agGridApiready).toHaveBeenCalled();
    });
    it('should dispatch setFilteredRows and set column count and apply column state if column state is defined', () => {
      const mockApi = {};
      const mockColumnApi = {};

      // eslint-disable-next-line unicorn/no-useless-undefined
      component['agGridReadyService'].agGridApiready = jest.fn(() => '');
      component.setAgGridFilter = jest.fn();

      component['agGridApi'] = undefined;
      component['agGridColumnApi'] = undefined;
      component['setVisibleColumns'] = jest.fn();

      component.onGridReady({
        api: mockApi as unknown as GridApi,
        columnApi: mockColumnApi as unknown as ColumnApi,
      });

      expect(component['agGridApi']).toEqual(mockApi as unknown as GridApi);
      expect(component['agGridColumnApi']).toEqual(
        mockColumnApi as unknown as ColumnApi
      );
      expect(component.setAgGridFilter).toHaveBeenCalledWith({ api: mockApi });
      expect(component['setVisibleColumns']).toHaveBeenCalled();
      expect(component['agGridReadyService'].agGridApiready).toHaveBeenCalled();
    });
  });
  describe('onColumnChange', () => {
    it('should set the column state', () => {
      const mockColumnApi = {
        getColumnState: jest.fn((): string[] => []),
      };
      component['agGridStateService'].setColumnState = jest.fn();
      component['setVisibleColumns'] = jest.fn();

      component.onColumnChange({
        columnApi: mockColumnApi as unknown as ColumnApi,
      });

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledWith([]);
      expect(store.dispatch).toHaveBeenCalledWith(
        setAgGridColumns({ agGridColumns: '[]' })
      );
      expect(component['setVisibleColumns']).toHaveBeenCalled();
    });
  });
  describe('resetAgGridFilter', () => {
    it('should reset the agGrid filter if the grid api is defined', () => {
      const mockApi = {
        setFilterModel: jest.fn(),
        onFilterChanged: jest.fn(),
      };
      component['agGridApi'] = mockApi as unknown as GridApi;

      component.resetAgGridFilter();

      // eslint-disable-next-line unicorn/no-null
      expect(mockApi.setFilterModel).toHaveBeenCalledWith(null);
      expect(mockApi.onFilterChanged).toHaveBeenCalled();
    });
    it('should do nothing if the grid api is not defined', () => {
      const mockApi = {
        setFilterModel: jest.fn(),
        onFilterChanged: jest.fn(),
      };
      component['agGridApi'] = undefined;

      component.resetAgGridFilter();

      // eslint-disable-next-line unicorn/no-null
      expect(mockApi.setFilterModel).not.toHaveBeenCalled();
      expect(mockApi.onFilterChanged).not.toHaveBeenCalled();
    });
  });
  describe('resetAgGridColumnConfiguration', () => {
    it('should reset the column configuration if the column api is defined', () => {
      const mockColumnApi = {
        applyColumnState: jest.fn(),
      };

      component.getColumnDefs = jest.fn(() => STEEL_COLUMN_DEFINITIONS);

      const expectedState = STEEL_COLUMN_DEFINITIONS.map(
        (column: ColDef) =>
          ({
            colId: column.field,
          } as ColumnState)
      );

      component['agGridColumnApi'] = mockColumnApi as unknown as ColumnApi;
      component['setVisibleColumns'] = jest.fn();

      component.resetAgGridColumnConfiguration();

      expect(mockColumnApi.applyColumnState).toHaveBeenCalledWith({
        state: expectedState,
        applyOrder: true,
      });
      expect(component['setVisibleColumns']).toHaveBeenCalled();
    });
    it('should do nothing if the column api is not defined', () => {
      const mockColumnApi = {
        applyColumnState: jest.fn(),
      };

      component['agGridColumnApi'] = undefined;
      component['setVisibleColumns'] = jest.fn();

      component.resetAgGridColumnConfiguration();

      expect(mockColumnApi.applyColumnState).not.toHaveBeenCalled();
      expect(component['setVisibleColumns']).not.toHaveBeenCalled();
    });
  });
  describe('applyAgGridFilter', () => {
    it('should do nothing if the agGrid api is not defined', () => {
      const mockColumn = 'column';
      const mockValues: string[] = [undefined];

      const mockFilterInstance = {
        setModel: jest.fn(),
      };
      const mockApi = {
        getFilterInstance: jest.fn(
          () => mockFilterInstance as unknown as IFilterComp
        ),
        onFilterChanged: jest.fn(),
      };

      component['agGridApi'] = undefined;

      component.applyAgGridFilter(mockColumn, mockValues);

      // eslint-disable-next-line unicorn/no-null
      expect(mockFilterInstance.setModel).not.toHaveBeenCalled();
      expect(mockApi.getFilterInstance).not.toHaveBeenCalled();
      expect(mockApi.onFilterChanged).not.toHaveBeenCalled();
    });
    it('should set the filterValue for the column', () => {
      const mockColumn = 'column';
      const mockValues = [undefined, 'value', 'another value'];

      const mockFilteredValues = ['value', 'another value'];

      const mockFilterInstance = {
        setModel: jest.fn(),
      };
      const mockApi = {
        getFilterInstance: jest.fn(
          () => mockFilterInstance as unknown as IFilterComp
        ),
        onFilterChanged: jest.fn(),
      };

      component['agGridApi'] = mockApi as unknown as GridApi;

      component.applyAgGridFilter(mockColumn, mockValues);

      expect(mockFilterInstance.setModel).toHaveBeenCalledWith({
        values: mockFilteredValues,
      });
      expect(mockApi.getFilterInstance).toHaveBeenCalledWith(mockColumn);
      expect(mockApi.onFilterChanged).toHaveBeenCalled();
    });
    it('should reset the filterValue for the column if value is empty', () => {
      const mockColumn = 'column';
      const mockValues: string[] = [undefined];

      const mockFilterInstance = {
        setModel: jest.fn(),
      };
      const mockApi = {
        getFilterInstance: jest.fn(
          () => mockFilterInstance as unknown as IFilterComp
        ),
        onFilterChanged: jest.fn(),
      };

      component['agGridApi'] = mockApi as unknown as GridApi;

      component.applyAgGridFilter(mockColumn, mockValues);

      // eslint-disable-next-line unicorn/no-null
      expect(mockFilterInstance.setModel).toHaveBeenCalledWith(null);
      expect(mockApi.getFilterInstance).toHaveBeenCalledWith(mockColumn);
      expect(mockApi.onFilterChanged).toHaveBeenCalled();
    });
  });
  describe('resetForm', () => {
    it('should reset the filter form if it is not default', () => {
      component.isDefaultAgGridFilter = jest.fn(() => true);

      component.resetAgGridFilter = jest.fn();

      component.resetForm();

      expect(component.resetAgGridFilter).not.toHaveBeenCalled();
    });
  });

  describe('isDefaultAgGridFilter', () => {
    it('should return true if agGridApi is undefined', () => {
      component['agGridApi'] = undefined;

      const result = component.isDefaultAgGridFilter();

      expect(result).toBe(true);
    });

    it('should return true if agGrid filterModel is undefined', () => {
      component['agGridApi'] = {
        getFilterModel: jest.fn(),
      } as unknown as GridApi;

      const result = component.isDefaultAgGridFilter();

      expect(result).toBe(true);
    });
    it('should return true if agGrid filterModel is empty', () => {
      component['agGridApi'] = {
        getFilterModel: jest.fn(() => {}),
      } as unknown as GridApi;

      const result = component.isDefaultAgGridFilter();

      expect(result).toBe(true);
    });
    it('should return false if agGrid filter is set', () => {
      component['agGridApi'] = {
        getFilterModel: jest.fn(() => ({ someFilter: 'someValue' })),
      } as unknown as GridApi;

      const result = component.isDefaultAgGridFilter();

      expect(result).toBe(false);
    });
  });

  describe('exportExcel', () => {
    it('should call export function with current timestamp', () => {
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['agGridApi'] = {} as unknown as GridApi;
      component['agGridApi'].exportDataAsExcel = jest.fn();

      const mockArrayFn = () => [] as ExcelRow[];
      const mockStringFn = () => '';

      component['splitRowsForMultipleSapIdsInExportFactory'] = jest.fn(
        () => mockArrayFn
      );
      component['excelExportProcessCellCallbackFactory'] = jest.fn(
        () => mockStringFn
      );

      component['visibleColumns'] = [];

      component.exportExcel();

      expect(component['datePipe'].transform).toHaveBeenCalledWith(
        expect.any(Date),
        'yyyy-MM-dd'
      );
      expect(component['agGridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'materialsSupplierDatabase.mainTable.excelExport.author',
        fileName:
          '1234-13-44materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix',
        sheetName: 'materialsSupplierDatabase.mainTable.excelExport.sheetName',
        columnKeys: [],
        getCustomContentBelowRow: mockArrayFn,
        processCellCallback: mockStringFn,
      });
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Export Excel');
    });

    it('should do nothing if ag grid api is not defined', () => {
      component['agGridApi'] = undefined;
      component['datePipe'].transform = jest.fn();

      component.exportExcel();

      expect(component['datePipe'].transform).not.toHaveBeenCalled();
    });
  });

  describe('setVisibleColumns', () => {
    it('should do nothing if column api is not defined', () => {
      component['agGridColumnApi'] = undefined;
      component['visibleColumns'] = undefined;

      component['setVisibleColumns']();

      expect(component['visibleColumns']).toBe(undefined);
    });

    it('should set the visible columns', () => {
      component['agGridColumnApi'] = {
        getColumnState: jest.fn(() => [
          {
            colId: 'col1',
            hide: true,
          },
          {
            colId: 'col2',
            hide: false,
          },
        ]),
      } as unknown as ColumnApi;
      component['visibleColumns'] = undefined;

      component['setVisibleColumns']();

      expect(component['visibleColumns']).toEqual(['col2']);
    });
  });

  describe('splitRowsForMultipleSapIdsInExportFactory', () => {
    let mockGetCellValue: () => string;
    let mockSplitRowsForMultipleSapIdsInExport: (
      params: ProcessRowGroupForExportParams
    ) => ExcelRow[];

    beforeEach(() => {
      mockGetCellValue = jest.fn(() => 'test');
      mockSplitRowsForMultipleSapIdsInExport =
        component['splitRowsForMultipleSapIdsInExportFactory'](
          mockGetCellValue
        );
    });
    it('should return empty result if no sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [SAP_SUPPLIER_IDS]: [],
          },
        } as unknown as RowNode,
      } as ProcessRowGroupForExportParams;

      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([]);
    });

    it('should return empty result if only one sap id is present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [SAP_SUPPLIER_IDS]: ['onlyOneId'],
          },
        } as unknown as RowNode,
      } as ProcessRowGroupForExportParams;

      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([]);
    });

    it('should return additional rows if more than one sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [SAP_SUPPLIER_IDS]: ['id1', 'id2', 'id3'],
            releaseDateYear: 2000,
            releaseDateMonth: 1,
          },
        } as unknown as RowNode,
      } as ProcessRowGroupForExportParams;
      component['visibleColumns'] = [
        'col1',
        SAP_SUPPLIER_IDS,
        RELEASE_DATE,
        RELEASED_STATUS,
      ];
      const result: ExcelRow[] =
        mockSplitRowsForMultipleSapIdsInExport(mockParams);

      expect(result).toEqual([
        {
          cells: [
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
          ],
        },
        {
          cells: [
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
            {
              data: {
                type: 'String',
                value: 'test',
              },
            },
          ],
        },
      ]);
      expect(mockGetCellValue).toHaveBeenCalledWith('col1', 'a');
      expect(mockGetCellValue).not.toHaveBeenCalledWith('col2', 'b');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        RELEASE_DATE,
        new Date(2000, 0)
      );
      expect(mockGetCellValue).toHaveBeenCalledWith(
        RELEASED_STATUS,
        'materialsSupplierDatabase.status.statusValues.undefined'
      );
      expect(mockGetCellValue).toHaveBeenCalledWith(SAP_SUPPLIER_IDS, 'id2');
      expect(mockGetCellValue).toHaveBeenCalledWith(SAP_SUPPLIER_IDS, 'id3');
    });
  });

  describe('excelExportProcessCellCallback', () => {
    let mockGetCellValue: () => string;
    let mockExcelExportProcessCellCallback: (
      params: ProcessCellForExportParams
    ) => string;

    beforeEach(() => {
      mockGetCellValue = jest.fn(() => 'test');
      mockExcelExportProcessCellCallback =
        component['excelExportProcessCellCallbackFactory'](mockGetCellValue);
    });

    it('should return the first sap id if multiple ids are present', () => {
      const mockParams = {
        column: {
          getColId: jest.fn(() => SAP_SUPPLIER_IDS),
        } as unknown as Column,
        node: {
          data: {
            [SAP_SUPPLIER_IDS]: ['id1', 'id2', 'id3'],
          },
        },
        value: ['id1-value', 'id2', 'id3'],
      } as ProcessCellForExportParams;

      const result: string = mockExcelExportProcessCellCallback(mockParams);

      expect(result).toEqual('test');
      expect(mockGetCellValue).toHaveBeenCalledWith(SAP_SUPPLIER_IDS, 'id1');
    });

    it('should return the value if only one sap id is present', () => {
      const mockParams = {
        column: {
          getColId: jest.fn(() => SAP_SUPPLIER_IDS),
        } as unknown as Column,
        node: {
          data: {
            [SAP_SUPPLIER_IDS]: ['id1'],
          },
        },
        value: 'id1-value',
      } as ProcessCellForExportParams;

      const result: string = mockExcelExportProcessCellCallback(mockParams);

      expect(result).toEqual('test');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        SAP_SUPPLIER_IDS,
        'id1-value'
      );
    });

    it('should return the value if no sap id is present', () => {
      const mockParams = {
        column: {
          getColId: jest.fn(() => SAP_SUPPLIER_IDS),
        } as unknown as Column,
        node: {
          data: {
            [SAP_SUPPLIER_IDS]: [] as string[],
          },
        },
        value: 'id1-value',
      } as ProcessCellForExportParams;

      const result: string = mockExcelExportProcessCellCallback(mockParams);

      expect(result).toEqual('test');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        SAP_SUPPLIER_IDS,
        'id1-value'
      );
    });

    it('should return the value if the processed cell is not the sap ids', () => {
      const mockParams = {
        column: {
          getColId: jest.fn(() => 'some other field'),
        } as unknown as Column,
        node: {
          data: {
            [SAP_SUPPLIER_IDS]: [] as string[],
          },
        },
        value: 'id1-value',
      } as ProcessCellForExportParams;

      const result: string = mockExcelExportProcessCellCallback(mockParams);

      expect(result).toEqual('test');
      expect(mockGetCellValue).toHaveBeenCalledWith(
        'some other field',
        'id1-value'
      );
    });
  });

  describe('getCellValue', () => {
    it.each([
      [Status.BLOCKED.toString(), RELEASED_STATUS, Status.BLOCKED],
      [Status.DEFAULT.toString(), RELEASED_STATUS, undefined],
      ['02/01/1970', LAST_MODIFIED, 150_000],
      ['', LAST_MODIFIED, undefined],
      ['02/02/2008', RELEASE_DATE, new Date(2008, 1, 2)],
      ['', RELEASE_DATE, undefined],
      ['1', 'some col', 1],
      ['', 'some col', undefined],
    ])(
      'should return %p for column %p with value %p',
      (expected, columnName, value) => {
        const result = component['getCellValue'](columnName, value);

        expect(result).toEqual(expected);
      }
    );
  });

  describe('editableClass', () => {
    it('should return true for editable classes', () => {
      const result = component.editableClass(MaterialClass.STEEL);

      expect(result).toBe(true);
    });

    it('should return false for not editable classes', () => {
      const result = component.editableClass(MaterialClass.POLYMER);

      expect(result).toBe(false);
    });
  });

  describe('getColumnDefs', () => {
    it('should return translated column defs', () => {
      component.editableClass = jest.fn(() => true);

      const columnDefs = component.defaultColumnDefs;

      const translatedColumnDefs = component.getColumnDefs(false);

      for (const columnDef of columnDefs) {
        expect(translate).toHaveBeenCalledWith(
          `materialsSupplierDatabase.mainTable.columns.${columnDef.headerName}`
        );
      }
      expect(columnDefs.length).toEqual(translatedColumnDefs.length);
    });
  });

  describe('isBlockedRow', () => {
    it('should return true if the status is blocked', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.BLOCKED);

      const result = component.isBlockedRow({
        data: { blocked: true, lastModified: 1 },
      } as RowClassParams);

      expect(result).toBe(true);
      expect(getStatus).toHaveBeenCalledWith(true, 1);
    });
    it('should return false if the status is not blocked', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.DEFAULT);

      const result = component.isBlockedRow({
        data: { blocked: false, lastModified: 1 },
      } as RowClassParams);

      expect(result).toBe(false);
      expect(getStatus).toHaveBeenCalledWith(false, 1);
    });
  });

  describe('isRecentlyChangedRow', () => {
    it('should return true if the status is changed', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.CHANGED);

      const result = component.isRecentlyChangedRow({
        data: { blocked: true, lastModified: 1 },
      } as RowClassParams);

      expect(result).toBe(true);
      expect(getStatus).toHaveBeenCalledWith(true, 1);
    });
    it('should return false if the status is not changed', () => {
      (getStatus as jest.Mock).mockReturnValue(Status.DEFAULT);

      const result = component.isRecentlyChangedRow({
        data: { blocked: false, lastModified: 1 },
      } as RowClassParams);

      expect(result).toBe(false);
      expect(getStatus).toHaveBeenCalledWith(false, 1);
    });
  });

  describe('resumeDialog', () => {
    it('should call open dialog', () => {
      component.openDialog = jest.fn();
      component.resumeDialog();
      expect(component.openDialog).toHaveBeenCalledWith(true);
    });
  });

  describe('openDialog', () => {
    it('should dispatch the edit dialog actions and cancel on close', (done) => {
      component['dataFacade'].dispatch = jest.fn();

      let otherDone = false;
      component.openDialog();

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        openDialog()
      );

      mockDialogRef.afterOpened().subscribe(() => {
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockDialogRef.afterClosed().subscribe((_value) => {
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          materialDialogCanceled()
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockSubjectOpen.next();
      mockSubjectClose.next({ reload: false, minimize: undefined });
    });
    it('should dispatch the edit dialog actions and dispatch fetch and minimize', (done) => {
      component['dataFacade'].dispatch = jest.fn();
      component.fetchResult = jest.fn();

      let otherDone = false;

      component.openDialog(true);

      expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
        openDialog()
      );

      mockDialogRef.afterOpened().subscribe(() => {
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockDialogRef.afterClosed().subscribe(() => {
        expect(component.fetchResult).toHaveBeenCalled();
        expect(component['dataFacade'].dispatch).toHaveBeenCalledWith(
          minimizeDialog({ value: {} as MaterialFormValue })
        );
        if (otherDone) {
          done();
        } else {
          otherDone = true;
        }
      });

      mockSubjectOpen.next();
      mockSubjectClose.next({
        reload: true,
        minimize: { value: {} as MaterialFormValue },
      });
    });
  });
});
