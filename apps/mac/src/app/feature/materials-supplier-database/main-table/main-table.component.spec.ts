import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS, MatOption } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of, Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import {
  Column,
  ColumnApi,
  ExcelRow,
  IFilterComp,
  RowNode,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { ColDef, ColumnState, GridApi } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InputDialogComponent } from '@mac/msd/main-table/input-dialog/input-dialog.component';
import {
  BOOLEAN_VALUE_GETTER,
  EMPTY_VALUE_FORMATTER,
} from '@mac/msd/main-table/table-config';
import {
  COLUMN_DEFINITIONS,
  SAP_SUPPLIER_IDS,
} from '@mac/msd/main-table/table-config/column-definitions';
import { DataResult, MaterialFormValue } from '@mac/msd/models';
import {
  fetchMaterials,
  materialDialogOpened,
  minimizeDialog,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from '@mac/msd/store/actions';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';
import { initialState as initialQuickfilterState } from '@mac/msd/store/reducers/quickfilter/quickfilter.reducer';

import * as en from '../../../../assets/i18n/en.json';
import { DialogData } from '../models/data/dialog-data.model';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let spectator: Spectator<MainTableComponent>;
  let store: MockStore;
  let route: ActivatedRoute;
  let router: Router;

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
      PushModule,
      MatButtonModule,
      LoadingSpinnerModule,
      MatCheckboxModule,
      MatIconModule,
      QuickFilterComponent,
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
        provide: MatSnackBar,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
    declarations: [MainTableComponent],
  });

  beforeEach(() => {
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

  describe('ngOnInit', () => {
    describe('formControls', () => {
      const options = { onlySelf: true, emitEvent: false };
      it('should patch allSelected control to true on productCategory change if all values are selected', () => {
        component.categoryOptions = [{ selected: true } as MatOption];

        component.allCategoriesSelectedControl.patchValue = jest.fn();

        component.productCategorySelectionControl.patchValue([]);

        expect(
          component.allCategoriesSelectedControl.patchValue
        ).toHaveBeenCalledWith(true, options);
      });
      it('should patch allSelected control to false on productCategory change if not all values are selected', () => {
        component.categoryOptions = [{ selected: false } as MatOption];

        component.allCategoriesSelectedControl.patchValue = jest.fn();

        component.productCategorySelectionControl.patchValue([]);

        expect(
          component.allCategoriesSelectedControl.patchValue
        ).toHaveBeenCalledWith(false, options);
      });

      it('should call toggleAllCategories on allCategories control change', () => {
        component.toggleAllCategories = jest.fn();

        component.allCategoriesSelectedControl.patchValue(true);

        expect(component.toggleAllCategories).toHaveBeenCalledWith(true);
      });

      it('should dispatch setFilterModel on filterForm change', async () => {
        const mockValue: {
          materialClass: StringOption;
          productCategory: StringOption[];
        } = {
          materialClass: undefined,
          productCategory: undefined,
        };
        component.filterForm.patchValue(mockValue);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(store.dispatch).toHaveBeenCalledWith(setFilter(mockValue));
      });

      it('should call open dialog', () => {
        const mockSubject = new Subject<any>();
        component['dataFacade'].editMaterialInformation = mockSubject;
        component.openDialog = jest.fn();

        component.ngOnInit();

        mockSubject.next({});
        expect(component.openDialog).toHaveBeenCalledWith({ editMaterial: {} });
      });

      it('should open snackbar', () => {
        const mockSubject = new Subject<any>();
        component['dataFacade'].editMaterialInformation = mockSubject;
        component.openDialog = jest.fn();

        component.ngOnInit();

        // eslint-disable-next-line unicorn/no-useless-undefined
        mockSubject.next(undefined);
        expect(component['snackbar'].open).toHaveBeenCalled();
      });
    });
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
      component['setParamFilter'] = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      route.snapshot.queryParamMap.get = jest.fn(() => undefined);

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'filterForm'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamFilter']).not.toHaveBeenCalled();
      expect(component['setParamAgGridFilter']).not.toHaveBeenCalled();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
    });

    it('should call the set filter functions if filters are defined in query params', () => {
      component['setParamFilter'] = jest.fn();
      component['setParamAgGridFilter'] = jest.fn();
      router.navigate = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      route.snapshot.queryParamMap.get = jest.fn(() => 'some params');

      component['parseQueryParams']();

      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'filterForm'
      );
      expect(route.snapshot.queryParamMap.get).toHaveBeenCalledWith(
        'agGridFilter'
      );
      expect(component['setParamFilter']).toHaveBeenCalledWith('some params');
      expect(component['setParamAgGridFilter']).toHaveBeenCalledWith(
        'some params'
      );

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {},
      });
    });
  });
  describe('setParamFilter', () => {
    it('should do nothing if filterParams is not defined', () => {
      const mockFilterString = 'some params';
      // eslint-disable-next-line unicorn/no-useless-undefined
      JSON.parse = jest.fn(() => undefined);
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.productCategorySelectionControl.patchValue = jest.fn();
      component.filterForm = {
        valid: false,
        markAsDirty: jest.fn(),
      } as unknown as FormGroup;
      component.fetchMaterials = jest.fn();

      component['setParamFilter'](mockFilterString);

      expect(JSON.parse).toHaveBeenCalledWith(mockFilterString);
      expect(
        component.materialClassSelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(
        component.productCategorySelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(component.fetchMaterials).not.toHaveBeenCalled();
      expect(component.filterForm.markAsDirty).not.toHaveBeenCalled();
    });
    it('should do nothing if materialClass is not defined', () => {
      const mockFilterString = 'some params';
      const mockFilterParams: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: undefined,
        productCategory: [{ id: 'id', title: 'gibts net' }],
      };
      JSON.parse = jest.fn(() => mockFilterParams);
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.productCategorySelectionControl.patchValue = jest.fn();
      component.filterForm = {
        valid: false,
        markAsDirty: jest.fn(),
      } as unknown as FormGroup;
      component.fetchMaterials = jest.fn();

      component['setParamFilter'](mockFilterString);

      expect(JSON.parse).toHaveBeenCalledWith(mockFilterString);
      expect(
        component.materialClassSelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(
        component.productCategorySelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(component.fetchMaterials).not.toHaveBeenCalled();
      expect(component.filterForm.markAsDirty).not.toHaveBeenCalled();
    });
    it('should do nothing if productCategory is not defined', () => {
      const mockFilterString = 'some params';
      const mockFilterParams: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: { id: 'id', title: 'gibts net' },
        productCategory: undefined,
      };
      JSON.parse = jest.fn(() => mockFilterParams);
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.productCategorySelectionControl.patchValue = jest.fn();
      component.filterForm = {
        valid: false,
        markAsDirty: jest.fn(),
      } as unknown as FormGroup;
      component.fetchMaterials = jest.fn();

      component['setParamFilter'](mockFilterString);

      expect(JSON.parse).toHaveBeenCalledWith(mockFilterString);
      expect(
        component.materialClassSelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(
        component.productCategorySelectionControl.patchValue
      ).not.toHaveBeenCalled();
      expect(component.fetchMaterials).not.toHaveBeenCalled();
      expect(component.filterForm.markAsDirty).not.toHaveBeenCalled();
    });
    it('should patch controls and fetch materials if params are defined', () => {
      const mockFilterString = 'some params';
      const mockFilterParams = {
        materialClass: { id: 'id', title: 'gibts net' },
        productCategory: [{ id: 'id', title: 'gibts net' }],
      };
      JSON.parse = jest.fn(() => mockFilterParams);
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.productCategorySelectionControl.patchValue = jest.fn();
      component.filterForm = {
        valid: true,
        markAsDirty: jest.fn(),
      } as unknown as FormGroup;
      component.fetchMaterials = jest.fn();

      component['setParamFilter'](mockFilterString);

      expect(JSON.parse).toHaveBeenCalledWith(mockFilterString);
      expect(
        component.materialClassSelectionControl.patchValue
      ).toHaveBeenCalledWith(mockFilterParams.materialClass as StringOption);
      expect(
        component.productCategorySelectionControl.patchValue
      ).toHaveBeenCalledWith(
        mockFilterParams.productCategory as StringOption[]
      );
      expect(component.fetchMaterials).toHaveBeenCalled();
      expect(component.filterForm.markAsDirty).toHaveBeenCalled();
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
  describe('toggleAllCategories', () => {
    it('should do nothing if categoryOptions are not defined', () => {
      const mockSelectFn = jest.fn();
      const mockDeselectFn = jest.fn();
      component.categoryOptions = undefined;

      component.toggleAllCategories(true);

      expect(mockSelectFn).not.toHaveBeenCalled();
      expect(mockDeselectFn).not.toHaveBeenCalled();
    });

    it('should select all categoryOptions', () => {
      const mockSelectFn = jest.fn();
      const mockDeselectFn = jest.fn();
      component.categoryOptions = [
        {
          select: mockSelectFn,
          deselect: mockDeselectFn,
        } as unknown as MatOption,
      ];

      component.toggleAllCategories(true);

      expect(mockSelectFn).toHaveBeenCalled();
      expect(mockDeselectFn).not.toHaveBeenCalled();
    });
    it('should deselect all categoryOptions', () => {
      const mockSelectFn = jest.fn();
      const mockDeselectFn = jest.fn();
      component.categoryOptions = [
        {
          select: mockSelectFn,
          deselect: mockDeselectFn,
        } as unknown as MatOption,
      ];

      component.toggleAllCategories(false);

      expect(mockSelectFn).not.toHaveBeenCalled();
      expect(mockDeselectFn).toHaveBeenCalled();
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
  describe('fetchMaterials', () => {
    it('should dispatch fetchMaterials and set headline all x all', () => {
      component.materialClassSelectionControl.setValue(undefined, {
        onlySelf: true,
        emitEvent: false,
      });
      component.productCategorySelectionControl.setValue(undefined, {
        onlySelf: true,
        emitEvent: false,
      });
      component.allCategoriesSelectedControl.setValue(true, {
        onlySelf: true,
        emitEvent: false,
      });

      component.fetchMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(fetchMaterials());
      expect(component.selectedClass).toEqual(undefined);
      expect(component.selectedCategory).toEqual(undefined);
    });
    it('should dispatch fetchMaterials and set headline cat x cat', () => {
      component.materialClassSelectionControl.setValue(
        { id: 'id1', title: 'gibts net' },
        { onlySelf: true, emitEvent: false }
      );
      component.productCategorySelectionControl.setValue(
        [{ id: 'id2', title: 'gibts net' }],
        { onlySelf: true, emitEvent: false }
      );
      component.allCategoriesSelectedControl.setValue(false, {
        onlySelf: true,
        emitEvent: false,
      });

      component.fetchMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(fetchMaterials());
      expect(component.selectedClass).toEqual('gibts net');
      expect(component.selectedCategory).toEqual('gibts net');
    });
    it('should dispatch fetchMaterials and set headline cat x multiple', () => {
      component.materialClassSelectionControl.setValue(
        { id: 'id', title: 'gibts net' },
        { onlySelf: true, emitEvent: false }
      );
      component.productCategorySelectionControl.setValue(
        [
          { id: 'id1', title: 'gibts net' },
          { id: 'id2', title: 'gibts auch net' },
        ],
        { onlySelf: true, emitEvent: false }
      );
      component.allCategoriesSelectedControl.setValue(false, {
        onlySelf: true,
        emitEvent: false,
      });

      component.fetchMaterials();

      expect(store.dispatch).toHaveBeenCalledWith(fetchMaterials());
      expect(component.selectedClass).toEqual('gibts net');
      expect(component.selectedCategory).toEqual(
        '2 materialsSupplierDatabase.mainTable.productCategories'
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
      component['agGridStateService'].getColumnState = jest.fn(() => undefined);
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

      expect(mockColumnApi.applyColumnState).not.toHaveBeenCalled();
      expect(component['agGridStateService'].getColumnState).toHaveBeenCalled();
      expect(component.setAgGridFilter).toHaveBeenCalledWith({ api: mockApi });
      expect(component['setVisibleColumns']).toHaveBeenCalled();
      expect(component['agGridReadyService'].agGridApiready).toHaveBeenCalled();
    });
    it('should dispatch setFilteredRows and set column count and apply column state if column state is defined', () => {
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
      component['agGridStateService'].getColumnState = jest.fn(() => []);
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

      expect(mockColumnApi.applyColumnState).toHaveBeenCalledWith({
        state: [],
        applyOrder: true,
      });
      expect(component['agGridStateService'].getColumnState).toHaveBeenCalled();
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
      ).toHaveBeenCalledWith(component['TABLE_KEY'], []);
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

      const expectedState = COLUMN_DEFINITIONS.map(
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
      component.filterForm = {
        reset: jest.fn(),
        markAsUntouched: jest.fn(),
        markAsPristine: jest.fn(),
      } as unknown as FormGroup;
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.toggleAllCategories = jest.fn();
      component.isDefaultFilterForm = jest.fn(() => false);
      component.isDefaultAgGridFilter = jest.fn(() => true);

      component.resetAgGridFilter = jest.fn();

      const mockDefaultMaterialClass = {
        id: 'id',
        title: 'test',
      };
      const mockDefaultFormValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: mockDefaultMaterialClass,
        productCategory: [],
      };

      component['defaultMaterialClass'] = mockDefaultMaterialClass;
      component.defaultFilterFormValue = mockDefaultFormValue;

      component.resetForm();

      expect(component.filterForm.reset).toHaveBeenCalledWith(
        mockDefaultFormValue
      );
      expect(
        component.materialClassSelectionControl.patchValue
      ).toHaveBeenCalledWith(mockDefaultMaterialClass, {
        emitEvent: false,
        onlySelf: true,
      });
      expect(component.toggleAllCategories).toHaveBeenCalledWith(true);
      expect(component.resetAgGridFilter).not.toHaveBeenCalled();
    });

    it('should reset the agGrid filter if it is not default', () => {
      component.filterForm = {
        reset: jest.fn(),
        markAsUntouched: jest.fn(),
        markAsPristine: jest.fn(),
      } as unknown as FormGroup;
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.toggleAllCategories = jest.fn();
      component.isDefaultFilterForm = jest.fn(() => true);
      component.isDefaultAgGridFilter = jest.fn(() => false);

      component.resetAgGridFilter = jest.fn();

      component.resetForm();

      expect(component.filterForm.reset).not.toHaveBeenCalled();
      expect(
        component.materialClassSelectionControl.patchValue
      ).not.toHaveBeenCalledWith();
      expect(component.toggleAllCategories).not.toHaveBeenCalledWith();
      expect(component.resetAgGridFilter).toHaveBeenCalled();
    });

    it('should not reset anything if everything is default', () => {
      component.filterForm = {
        reset: jest.fn(),
        markAsUntouched: jest.fn(),
        markAsPristine: jest.fn(),
      } as unknown as FormGroup;
      component.materialClassSelectionControl.patchValue = jest.fn();
      component.toggleAllCategories = jest.fn();
      component.isDefaultFilterForm = jest.fn(() => true);
      component.isDefaultAgGridFilter = jest.fn(() => true);

      component.resetAgGridFilter = jest.fn();

      component.resetForm();

      expect(component.filterForm.reset).not.toHaveBeenCalled();
      expect(
        component.materialClassSelectionControl.patchValue
      ).not.toHaveBeenCalledWith();
      expect(component.toggleAllCategories).not.toHaveBeenCalledWith();
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

  describe('isDefaultFilterForm', () => {
    let mockDefaultValue: {
      materialClass: StringOption;
      productCategory: StringOption[];
    };

    beforeEach(() => {
      mockDefaultValue = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        productCategory: [
          { id: 'id1', title: 'test' },
          { id: 'id2', title: 'test2' },
        ],
      };
    });
    it('should return true if the form value and the default value are equal', () => {
      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockDefaultValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(true);
    });

    it('should return false if the form materialClass is not the defaultMaterialClass (id)', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'notid',
          title: 'test',
        },
        productCategory: [
          { id: 'id1', title: 'test' },
          { id: 'id2', title: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if the form materialClass is not the defaultMaterialClass (name)', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test2',
        },
        productCategory: [
          { id: 'id1', title: 'test' },
          { id: 'id2', title: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected (id)', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        productCategory: [
          { id: 'id1', title: 'test' },
          { id: 'notid2', title: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected (name)', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        productCategory: [
          { id: 'id1', title: 'test' },
          { id: 'id2', title: 'test3' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        productCategory: [{ id: 'id1', title: 'test' }],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });
    it('should return false if no materialClass is selected', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        // eslint-disable-next-line unicorn/no-null
        materialClass: null,
        productCategory: [{ id: 'id1', title: 'test' }],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if no productCategory is selected', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        // eslint-disable-next-line unicorn/no-null
        productCategory: null,
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if no productCategory is selected (empty)', () => {
      const mockValue: {
        materialClass: StringOption;
        productCategory: StringOption[];
      } = {
        materialClass: {
          id: 'id',
          title: 'test',
        },
        productCategory: [],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });
  });

  describe('exportExcel', () => {
    it('should call export function with current timestamp', () => {
      component['datePipe'].transform = jest.fn().mockReturnValue('1234-13-44');
      component['agGridApi'] = {} as unknown as GridApi;
      component['agGridApi'].exportDataAsExcel = jest.fn();

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
        getCustomContentBelowRow:
          component['splitRowsForMultipleSapIdsInExport'],
        processCellCallback: component['reduceSapIdsForFirstRowInExport'],
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

  describe('splitRowsForMultipleSapIdsInExport', () => {
    it('should return empty result if no sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [SAP_SUPPLIER_IDS]: [],
          },
        } as unknown as RowNode,
      };

      const result: ExcelRow[] =
        component['splitRowsForMultipleSapIdsInExport'](mockParams);

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
      };

      const result: ExcelRow[] =
        component['splitRowsForMultipleSapIdsInExport'](mockParams);

      expect(result).toEqual([]);
    });

    it('should return additional rows if more than one sap ids are present', () => {
      const mockParams = {
        node: {
          data: {
            col1: 'a',
            col2: 'b',
            [SAP_SUPPLIER_IDS]: ['id1', 'id2', 'id3'],
          },
        } as unknown as RowNode,
      };
      component['visibleColumns'] = ['col1', SAP_SUPPLIER_IDS];

      const result: ExcelRow[] =
        component['splitRowsForMultipleSapIdsInExport'](mockParams);

      expect(result).toEqual([
        {
          cells: [
            {
              data: {
                type: 'String',
                value: 'a',
              },
            },
            {
              data: {
                type: 'String',
                value: 'id2',
              },
            },
          ],
        },
        {
          cells: [
            {
              data: {
                type: 'String',
                value: 'a',
              },
            },
            {
              data: {
                type: 'String',
                value: 'id3',
              },
            },
          ],
        },
      ]);
    });
  });

  describe('reduceSapIdsForFirstRowInExport', () => {
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
      };

      const result: string =
        component['reduceSapIdsForFirstRowInExport'](mockParams);

      expect(result).toEqual('id1');
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
      };

      const result: string =
        component['reduceSapIdsForFirstRowInExport'](mockParams);

      expect(result).toEqual('id1-value');
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
      };

      const result: string =
        component['reduceSapIdsForFirstRowInExport'](mockParams);

      expect(result).toEqual('id1-value');
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
      };

      const result: string =
        component['reduceSapIdsForFirstRowInExport'](mockParams);

      expect(result).toEqual('id1-value');
    });
  });

  describe('getColumnDefs', () => {
    it('should return translated column defs', () => {
      const columnDefs = component.columnDefs;

      const translatedColumnDefs = component.getColumnDefs(false);

      for (const columnDef of columnDefs) {
        expect(translate).toHaveBeenCalledWith(
          `materialsSupplierDatabase.mainTable.columns.${columnDef.field}`
        );
      }
      columnDefs
        .filter((c) => c.tooltipField)
        .forEach((columnDef) => {
          expect(translate).toHaveBeenCalledWith(
            `materialsSupplierDatabase.mainTable.tooltip.${columnDef.tooltipField}`
          );
        });

      columnDefs
        .filter((c) => !c.tooltipField)
        .forEach((columnDef) => {
          expect(translate).not.toHaveBeenCalledWith(
            `materialsSupplierDatabase.mainTable.tooltip.${columnDef.tooltipField}`
          );
        });
      expect(columnDefs.length).toEqual(translatedColumnDefs.length);
    });

    it('should skip tooltip if property not set', () => {
      component.defaultColumnDefs = [
        {
          field: 'fieldname',
          tooltipField: undefined,
        },
      ];
      component.getColumnDefs(true);
      expect(translate).not.toHaveBeenCalledWith(
        `materialsSupplierDatabase.mainTable.tooltip.fieldname`
      );
    });

    it('should setup tooltip if property set', () => {
      component.defaultColumnDefs = [
        {
          field: 'fieldname',
          tooltipField: 'fieldname',
        },
      ];
      component.getColumnDefs(false);
      expect(translate).toHaveBeenCalledWith(
        `materialsSupplierDatabase.mainTable.tooltip.fieldname`
      );
    });
  });

  describe('BOOLEAN_VALUE_GETTER', () => {
    it('should return a comparable string value of a boolean value', () => {
      const mockGetId = jest.fn(() => 'columnId');
      const mockGetValue = jest.fn(() => 1);
      const mockValueGetterParams = {
        column: {
          getId: mockGetId,
        },
        getValue: mockGetValue,
      } as unknown as ValueGetterParams;

      const expected = '1';
      const result = BOOLEAN_VALUE_GETTER(mockValueGetterParams);

      expect(result).toEqual(expected);
      expect(mockGetId).toHaveBeenCalled();
      expect(mockGetValue).toHaveBeenCalledWith('columnId');
    });
  });

  describe('EMPTY_VALUE_FORMATTER', () => {
    it('should return (Empty) instead of (Blanks)', () => {
      // eslint-disable-next-line unicorn/no-null
      const mockNullParams = { value: null } as ValueFormatterParams;
      const mockUndefinedParams = { value: undefined } as ValueFormatterParams;

      const nullResult = EMPTY_VALUE_FORMATTER(mockNullParams);
      const undefinedResult = EMPTY_VALUE_FORMATTER(mockUndefinedParams);

      expect(nullResult).toBe('(Empty)');
      expect(undefinedResult).toBe('(Empty)');
    });

    it('should return cell value if it is defined', () => {
      const mockParams = { value: 'some value' } as ValueFormatterParams;

      const result = EMPTY_VALUE_FORMATTER(mockParams);

      expect(result).toBe('some value');
    });
  });

  describe('resumeDialog', () => {
    it('should call open dialog', () => {
      const mockSubject = new Subject<any>();
      component['dataFacade'].resumeDialogData$ = mockSubject;
      component.openDialog = jest.fn();

      component.resumeDialog();

      mockSubject.next({} as DialogData);
      expect(component.openDialog).toHaveBeenCalledWith({} as DialogData);
    });
  });

  describe('openDialog', () => {
    it('should open the dialog', () => {
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => new Observable()),
          } as unknown as MatDialogRef<
            InputDialogComponent,
            {
              reload?: boolean;
              minimize?: { id: number; value: MaterialFormValue };
            }
          >)
      );

      component.openDialog({} as DialogData);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InputDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          enterAnimationDuration: '100ms',
          disableClose: true,
          restoreFocus: false,
          data: {} as DialogData,
        }
      );
      expect(store.dispatch).toHaveBeenCalledWith(materialDialogOpened());
    });

    it('should do nothing on close if reload is not set', () => {
      const mockObservable = new Subject<{
        reload?: boolean;
        minimize?: { id: number; value: MaterialFormValue };
      }>();
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => mockObservable),
          } as unknown as MatDialogRef<
            InputDialogComponent,
            {
              reload?: boolean;
              minimize?: { id: number; value: MaterialFormValue };
            }
          >)
      );
      component.fetchMaterials = jest.fn();

      component.openDialog({} as DialogData);
      mockObservable.next({});

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InputDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          enterAnimationDuration: '100ms',
          disableClose: true,
          restoreFocus: false,
          data: {} as DialogData,
        }
      );
      expect(store.dispatch).toHaveBeenCalledWith(materialDialogOpened());
      expect(component.fetchMaterials).not.toHaveBeenCalled();
    });

    it('should call fetchMaterials on close if reload is true', () => {
      const mockObservable = new Subject<{
        reload?: boolean;
        minimize?: { id: number; value: MaterialFormValue };
      }>();
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => mockObservable),
          } as unknown as MatDialogRef<
            InputDialogComponent,
            {
              reload?: boolean;
              minimize?: { id: number; value: MaterialFormValue };
            }
          >)
      );
      component.fetchMaterials = jest.fn();

      component.openDialog({} as DialogData);
      mockObservable.next({ reload: true });

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InputDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          enterAnimationDuration: '100ms',
          disableClose: true,
          restoreFocus: false,
          data: {} as DialogData,
        }
      );
      expect(store.dispatch).toHaveBeenCalledWith(materialDialogOpened());
      expect(component.fetchMaterials).toHaveBeenCalled();
    });

    it('should call minimizeDialog on close if minimized information is provided', () => {
      const mockObservable = new Subject<{
        reload?: boolean;
        minimize?: { id: number; value: MaterialFormValue };
      }>();
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: jest.fn(() => mockObservable),
          } as unknown as MatDialogRef<
            InputDialogComponent,
            {
              reload?: boolean;
              minimize?: { id: number; value: MaterialFormValue };
            }
          >)
      );
      component.fetchMaterials = jest.fn();

      component.openDialog({} as DialogData);
      mockObservable.next({
        minimize: {
          id: 1,
          value: { manufacturerSupplierId: 1 } as MaterialFormValue,
        },
      });

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InputDialogComponent,
        {
          width: '863px',
          autoFocus: false,
          enterAnimationDuration: '100ms',
          disableClose: true,
          restoreFocus: false,
          data: {} as DialogData,
        }
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        minimizeDialog({
          id: 1,
          value: { manufacturerSupplierId: 1 } as MaterialFormValue,
        })
      );
    });
  });

  describe('toggle sidebar', () => {
    it('change value after toggle', () => {
      expect(component.minimizeSideBar).toBeFalsy();
      component.toggleSideBar();
      expect(component.minimizeSideBar).toBeTruthy();
    });

    it('change back after second toggle', () => {
      expect(component.minimizeSideBar).toBeFalsy();
      component.toggleSideBar();
      component.toggleSideBar();
      expect(component.minimizeSideBar).toBeFalsy();
    });
  });
});
