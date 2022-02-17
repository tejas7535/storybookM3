import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS, MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AgGridModule } from '@ag-grid-community/angular';
import { ColumnApi, IFilterComp, RowNode } from '@ag-grid-community/core';
import { ColDef, ColumnState, GridApi } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DataFilter, DataResult } from '../models';
import { fetchMaterials, setAgGridFilter } from '../store/actions';
import { initialState as initialDataState } from '../store/reducers/data.reducer';
import { setAgGridColumns, setFilter } from './../store/actions/data.actions';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { COLUMN_DEFINITIONS } from './table-config/column-definitions';

describe('MainTableComponent', () => {
  let component: MainTableComponent;
  let spectator: Spectator<MainTableComponent>;
  let store: MockStore;
  let route: ActivatedRoute;
  let router: Router;

  const initialState = { msd: { data: initialDataState } };

  const createComponent = createComponentFactory({
    component: MainTableComponent,
    imports: [
      CommonModule,
      MainTableRoutingModule,
      RouterTestingModule,
      AgGridModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
      ReactiveComponentModule,
      MatButtonModule,
      LoadingSpinnerModule,
      MatCheckboxModule,
      MatIconModule,
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
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

        component.productCategorySelectionControl.patchValue(['something']);

        expect(
          component.allCategoriesSelectedControl.patchValue
        ).toHaveBeenCalledWith(true, options);
      });
      it('should patch allSelected control to false on productCategory change if not all values are selected', () => {
        component.categoryOptions = [{ selected: false } as MatOption];

        component.allCategoriesSelectedControl.patchValue = jest.fn();

        component.productCategorySelectionControl.patchValue(['something']);

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
          materialClass: DataFilter;
          productCategory: DataFilter[];
        } = {
          materialClass: undefined,
          productCategory: undefined,
        };
        component.filterForm.patchValue(mockValue);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(store.dispatch).toHaveBeenCalledWith(setFilter(mockValue));
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
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: undefined,
        productCategory: [{ id: 0, name: 'gibts net' }],
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
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: { id: 0, name: 'gibts net' },
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
        materialClass: { id: 0, name: 'gibts net' },
        productCategory: [{ id: 0, name: 'gibts net' }],
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
      ).toHaveBeenCalledWith(mockFilterParams.materialClass as DataFilter);
      expect(
        component.productCategorySelectionControl.patchValue
      ).toHaveBeenCalledWith(mockFilterParams.productCategory as DataFilter[]);
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
      store.select = jest.fn(() => of({}));

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
      store.select = jest.fn(() => of(undefined));

      component['agGridApi'] = undefined;

      component.setAgGridFilter({ api: mockApi as unknown as GridApi });

      expect(component['agGridApi']).toEqual(mockApi as unknown as GridApi);
      expect(mockApi.setFilterModel).not.toHaveBeenCalled();
    });
  });
  describe('compareDataFilters', () => {
    it('should return false if a is not defined', () => {
      const a: DataFilter = undefined;
      const b: DataFilter = { id: 0, name: 'gibts net' };

      const result = component.compareDataFilters(a, b);

      expect(result).toBe(false);
    });
    it('should return false if b is not defined', () => {
      const a: DataFilter = { id: 0, name: 'gibts net' };
      const b: DataFilter = undefined;

      const result = component.compareDataFilters(a, b);

      expect(result).toBe(false);
    });
    it('should return false if a.id is not equal to b.id', () => {
      const a: DataFilter = { id: 0, name: 'gibts net' };
      const b: DataFilter = { id: 1, name: 'gibts net' };

      const result = component.compareDataFilters(a, b);

      expect(result).toBe(false);
    });
    it('should return false if a.name is not equal to b.name', () => {
      const a: DataFilter = { id: 0, name: 'gibts net' };
      const b: DataFilter = { id: 0, name: 'gibts scho' };

      const result = component.compareDataFilters(a, b);

      expect(result).toBe(false);
    });
    it('should return true if a and b have same id and name', () => {
      const a: DataFilter = { id: 0, name: 'gibts net' };
      const b: DataFilter = { id: 0, name: 'gibts net' };

      const result = component.compareDataFilters(a, b);

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
        { id: 1, name: 'gibts net' },
        { onlySelf: true, emitEvent: false }
      );
      component.productCategorySelectionControl.setValue(
        [{ id: 1, name: 'gibts net' }],
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
        { id: 1, name: 'gibts net' },
        { onlySelf: true, emitEvent: false }
      );
      component.productCategorySelectionControl.setValue(
        [
          { id: 1, name: 'gibts net' },
          { id: 2, name: 'gibts auch net' },
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
      expect(component.selectedCategory).toEqual('2 Product Categories');
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

      component.setAgGridFilter = jest.fn();

      component['agGridApi'] = undefined;
      component['agGridColumnApi'] = undefined;

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
      component.setAgGridFilter = jest.fn();

      component['agGridApi'] = undefined;
      component['agGridColumnApi'] = undefined;

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
    });
  });
  describe('onColumnChange', () => {
    it('should set the column state', () => {
      const mockColumnApi = {
        getColumnState: jest.fn((): string[] => []),
      };
      component['agGridStateService'].setColumnState = jest.fn();

      component.onColumnChange({
        columnApi: mockColumnApi as unknown as ColumnApi,
      });

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledWith(component['TABLE_KEY'], []);
      expect(store.dispatch).toHaveBeenCalledWith(
        setAgGridColumns({ agGridColumns: '[]' })
      );
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

      component.resetAgGridColumnConfiguration();

      expect(mockColumnApi.applyColumnState).toHaveBeenCalledWith({
        state: expectedState,
        applyOrder: true,
      });
    });
    it('should do nothing if the column api is not defined', () => {
      const mockColumnApi = {
        applyColumnState: jest.fn(),
      };

      component['agGridColumnApi'] = undefined;

      component.resetAgGridColumnConfiguration();

      expect(mockColumnApi.applyColumnState).not.toHaveBeenCalled();
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
        id: 0,
        name: 'test',
      };
      const mockDefaultFormValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
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
    it('should return true if the form value and the default value are equal', () => {
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(true);
    });

    it('should return false if the form materialClass is not the defaultMaterialClass (id)', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 1,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if the form materialClass is not the defaultMaterialClass (name)', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test2',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected (id)', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 2, name: 'test2' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected (name)', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test3' },
        ],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if not all defaultProductCategories are currently selected', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [{ id: 0, name: 'test' }],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });
    it('should return false if no materialClass is selected', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        // eslint-disable-next-line unicorn/no-null
        materialClass: null,
        productCategory: [{ id: 0, name: 'test' }],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });

    it('should return false if no productCategory is selected', () => {
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
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
      const mockDefaultValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [
          { id: 0, name: 'test' },
          { id: 1, name: 'test2' },
        ],
      };
      const mockValue: {
        materialClass: DataFilter;
        productCategory: DataFilter[];
      } = {
        materialClass: {
          id: 0,
          name: 'test',
        },
        productCategory: [],
      };

      component.defaultFilterFormValue = mockDefaultValue;
      component.filterForm.setValue(mockValue);

      const result = component.isDefaultFilterForm();

      expect(result).toBe(false);
    });
  });
});
