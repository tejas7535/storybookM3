/* eslint-disable max-lines */
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import {
  ClientSideRowModelModule,
  ColumnApi,
  GridApi,
  GridOptions,
  Module,
} from '@ag-grid-community/all-modules';
import { ColumnState, RowNode } from '@ag-grid-community/core';
import {
  ColDef,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  MultiFilterModule,
  SetFilterModule,
  SideBarDef,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';
import { Store } from '@ngrx/store';

import { DataFilter, DataResult } from '../models';
import { fetchMaterials, setAgGridFilter, setFilter } from '../store/actions';
import { MsdAgGridStateService } from './../services/msd-ag-grid-state/msd-ag-grid-state.service';
import {
  getAgGridFilter,
  getCo2ColumnVisible,
  getFilterLists,
  getFilters,
  getLoading,
  getMaterialClassOptions,
  getOptionsLoading,
  getProductCategoryOptions,
  getResult,
} from './../store';
import {
  fetchClassAndCategoryOptions,
  resetResult,
  setAgGridColumns,
  setFilteredRows,
} from './../store/actions/data.actions';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  GRID_OPTIONS,
  SIDE_BAR_CONFIG,
} from './table-config';

@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy {
  public materialClassOptions$: Observable<DataFilter[]>;
  public productCategoryOptions$: Observable<DataFilter[]>;
  public optionsLoading$: Observable<boolean>;
  public resultLoading$: Observable<boolean>;
  public result$: Observable<DataResult[]>;
  public filterLists$: Observable<{
    materialNames: string[];
    materialStandards: string[];
    materialNumbers: string[];
  }>;
  public co2ColumnVisible$: Observable<boolean>;

  public selectedClass: string;
  public selectedCategory: string[];

  public rowCount: number;

  public destroy$ = new Subject<void>();

  public modules: Module[] = [
    ClientSideRowModelModule,
    SideBarModule,
    ColumnsToolPanelModule,
    MultiFilterModule,
    FiltersToolPanelModule,
    SetFilterModule,
    MenuModule,
  ];
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;
  public gridOptions: GridOptions = GRID_OPTIONS;

  public materialClassSelectionControl = new FormControl(undefined, [
    Validators.required,
  ]);
  public productCategorySelectionControl = new FormControl(undefined, [
    Validators.required,
  ]);
  public allCategoriesSelectedControl = new FormControl(false);
  @ViewChildren('categoryOption') public categoryOptions: MatOption[];

  public filterForm = new FormGroup({
    materialClass: this.materialClassSelectionControl,
    productCategory: this.productCategorySelectionControl,
  });

  public materialNameFilterList = new FormControl([]);
  public standardDocumentFilterList = new FormControl([]);
  public materialNumbersFilterList = new FormControl([]);

  public tableFilterForm = new FormGroup({
    materialStandardMaterialName: this.materialNameFilterList,
    materialStandardStandardDocument: this.standardDocumentFilterList,
    materialNumber: this.materialNumbersFilterList,
  });

  private agGridApi!: GridApi;
  private agGridColumnApi!: ColumnApi;
  private readonly TABLE_KEY = 'msdMainTable';

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridStateService: MsdAgGridStateService
  ) {}

  public ngOnInit(): void {
    this.materialClassOptions$ = this.store.select(getMaterialClassOptions);
    this.productCategoryOptions$ = this.store.select(getProductCategoryOptions);
    this.optionsLoading$ = this.store.select(getOptionsLoading);
    this.resultLoading$ = this.store.select(getLoading);
    this.result$ = this.store.select(getResult);
    this.filterLists$ = this.store.select(getFilterLists);
    this.co2ColumnVisible$ = this.store.select(getCo2ColumnVisible);

    this.store.dispatch(fetchClassAndCategoryOptions());

    this.productCategorySelectionControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const deselectedOptions =
          this.categoryOptions?.filter(
            (categoryOption) => !categoryOption.selected
          ) || [];
        this.allCategoriesSelectedControl.patchValue(
          deselectedOptions.length === 0,
          {
            onlySelf: true,
            emitEvent: false,
          }
        );
      });

    this.allCategoriesSelectedControl.valueChanges.subscribe((value: boolean) =>
      this.toggleAllCategories(value)
    );

    this.materialNameFilterList.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: string[]) =>
        this.applyAgGridFilter(
          'materialStandardMaterialNameHiddenFilter',
          values
        )
      );

    this.standardDocumentFilterList.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: string[]) =>
        this.applyAgGridFilter(
          'materialStandardStandardDocumentHiddenFilter',
          values
        )
      );

    this.materialNumbersFilterList.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: string[]) =>
        this.applyAgGridFilter('materialNumbers', values)
      );

    this.store
      .select(getFilters)
      .pipe(take(1))
      .subscribe(
        (filters: {
          materialClass: DataFilter | undefined;
          productCategory: DataFilter[] | undefined;
        }) => {
          if (filters.materialClass) {
            this.materialClassSelectionControl.setValue(filters.materialClass);
          }
          if (filters.productCategory) {
            this.productCategorySelectionControl.setValue(
              filters.productCategory
            );
          }
        }
      );

    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(5))
      .subscribe(
        ({
          materialClass,
          productCategory,
        }: {
          materialClass: DataFilter | undefined;
          productCategory: DataFilter[] | undefined;
        }) => {
          const filters = {
            materialClass,
            productCategory: this.allCategoriesSelectedControl.value
              ? undefined
              : productCategory,
          };
          this.store.dispatch(setFilter(filters));
        }
      );

    this.store
      .select(getAgGridFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterModel: { [key: string]: any }) => {
        if (this.agGridApi && !filterModel) {
          this.agGridApi.setFilterModel(filterModel);
        }
      });

    this.parseQueryParams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private parseQueryParams(): void {
    const filterParamsString =
      this.route.snapshot.queryParamMap.get('filterForm');
    const agGridFilterString =
      this.route.snapshot.queryParamMap.get('agGridFilter');

    if (filterParamsString) {
      this.setParamFilter(filterParamsString);
    }
    if (agGridFilterString) {
      this.setParamAgGridFilter(agGridFilterString);
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  private setParamFilter(filterString: string): void {
    const filterParams: {
      materialClass: DataFilter;
      productCategory: DataFilter[];
    } = JSON.parse(filterString);

    if (filterParams?.materialClass && filterParams?.productCategory) {
      this.materialClassSelectionControl.patchValue(
        filterParams.materialClass as DataFilter
      );
      this.productCategorySelectionControl.patchValue(
        filterParams.productCategory as DataFilter[]
      );
      this.filterForm.markAsDirty();
    }

    if (this.filterForm.valid) {
      this.fetchMaterials();
    }
  }

  private setParamAgGridFilter(filterModelString: string): void {
    const filterModel = JSON.parse(filterModelString);
    if (!filterModel) {
      return;
    }
    this.store.dispatch(setAgGridFilter({ filterModel }));
    const options = {
      onlySelf: true,
      emitEvent: false,
    };
    if (filterModel['materialStandardMaterialNameHiddenFilter']) {
      this.materialNameFilterList.setValue(
        filterModel['materialStandardMaterialNameHiddenFilter'].values,
        options
      );
    }
    if (filterModel['materialStandardStandardDocumentHiddenFilter']) {
      this.standardDocumentFilterList.setValue(
        filterModel['materialStandardStandardDocumentHiddenFilter'].values,
        options
      );
    }
    if (filterModel['materialNumbers']) {
      this.materialNumbersFilterList.setValue(
        filterModel['materialNumbers'].values,
        options
      );
    }
  }

  public toggleAllCategories(select: boolean): void {
    if (select) {
      this.categoryOptions.map((categoryOption) => categoryOption.select());
    } else {
      this.categoryOptions.map((categoryOption) => categoryOption.deselect());
    }
  }

  public onFilterChange({ api }: { api: GridApi }): void {
    const filterModel = api.getFilterModel();
    const filteredResult: DataResult[] = [];
    api.forEachNodeAfterFilter((rowNode: RowNode) => {
      filteredResult.push(rowNode.data);
    });
    if (Object.keys(filterModel).length === 0) {
      const options = {
        onlySelf: true,
        emitEvent: false,
      };
      this.materialNameFilterList.setValue([undefined], options);
      this.standardDocumentFilterList.setValue([undefined], options);
      this.materialNumbersFilterList.setValue([undefined], options);
    }

    this.store.dispatch(setAgGridFilter({ filterModel }));
    this.store.dispatch(setFilteredRows({ filteredResult }));
  }

  public setAgGridFilter({ api }: { api: GridApi }): void {
    this.agGridApi = api;
    this.store
      .select(getAgGridFilter)
      .pipe(take(1))
      .subscribe((filterModel: { [key: string]: any }) => {
        if (filterModel) {
          api.setFilterModel(filterModel);
        }
      });
  }

  public compareDataFilters(a: DataFilter, b: DataFilter) {
    return !!a && !!b && a.id === b.id && a.name === b.name;
  }

  public fetchMaterials(): void {
    this.selectedClass = this.materialClassSelectionControl.value?.id
      ? this.materialClassSelectionControl.value.name
      : undefined;

    this.selectedCategory =
      this.allCategoriesSelectedControl.value ||
      this.productCategorySelectionControl.value?.length === 0
        ? undefined
        : // eslint-disable-next-line unicorn/no-nested-ternary
        this.productCategorySelectionControl.value?.length === 1
        ? this.productCategorySelectionControl.value[0].name
        : `${this.productCategorySelectionControl.value.length} Product Categories`;

    this.store.dispatch(fetchMaterials());
  }

  public onGridReady({
    api,
    columnApi,
  }: {
    api: GridApi;
    columnApi: ColumnApi;
  }): void {
    this.agGridApi = api;
    this.agGridColumnApi = columnApi;

    const filteredResult: DataResult[] = [];
    api.forEachNodeAfterFilter((rowNode: RowNode) => {
      filteredResult.push(rowNode.data);
    });
    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      columnApi.applyColumnState({ state, applyOrder: true });
    }
    this.rowCount = this.agGridApi.getDisplayedRowCount();
    this.store.dispatch(setFilteredRows({ filteredResult }));
  }

  public onColumnChange({ columnApi }: { columnApi: ColumnApi }): void {
    const agGridColumns = columnApi.getColumnState();
    this.agGridStateService.setColumnState(this.TABLE_KEY, agGridColumns);
    this.store.dispatch(
      setAgGridColumns({ agGridColumns: JSON.stringify(agGridColumns) })
    );
  }

  public resetAgGridFilter(): void {
    if (this.agGridApi) {
      // eslint-disable-next-line unicorn/no-null
      this.agGridApi.setFilterModel(null);
      this.agGridApi.onFilterChanged();
    }
  }

  public resetAgGridColumnConfiguration(): void {
    if (this.agGridColumnApi) {
      const state = COLUMN_DEFINITIONS.map(
        (column: ColDef) =>
          ({
            colId: column.field,
          } as ColumnState)
      );
      this.agGridColumnApi.applyColumnState({ state, applyOrder: true });
    }
  }

  public applyAgGridFilter(column: string, fullValues: string[]): void {
    const values: string[] = fullValues.filter((value: string) => !!value);
    if (this.agGridApi) {
      const filterInstance = this.agGridApi.getFilterInstance(column);
      // eslint-disable-next-line unicorn/no-null
      let filterValue: { values: string[] } = null;
      if (values.length > 0) {
        filterValue = { values };
      }
      filterInstance.setModel(filterValue);
      this.agGridApi.onFilterChanged();
    }
  }

  public resetForm(): void {
    this.filterForm.reset();
    this.filterForm.markAsUntouched();
    this.filterForm.markAsPristine();
    this.store.dispatch(resetResult());
  }
}
