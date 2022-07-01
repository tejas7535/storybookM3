import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject, withLatestFrom } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { ColumnApi, Module } from '@ag-grid-community/all-modules';
import { Column, ColumnState, RowNode } from '@ag-grid-community/core';
import {
  ColDef,
  ExcelCell,
  GridApi,
  SideBarDef,
} from '@ag-grid-enterprise/all-modules';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { DataFilter, DataResult } from '../models';
import { fetchMaterials, setAgGridFilter, setFilter } from '../store/actions';
import { MsdAgGridStateService } from './../services/msd-ag-grid-state/msd-ag-grid-state.service';
import {
  getAgGridFilter,
  getFilters,
  getLoading,
  getMaterialClassOptions,
  getOptionsLoading,
  getProductCategoryOptions,
  getResult,
  getResultCount,
} from './../store';
import {
  fetchClassAndCategoryOptions,
  setAgGridColumns,
} from './../store/actions/data.actions';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  MODULES,
  SAP_SUPPLIER_IDS,
  SIDE_BAR_CONFIG,
} from './table-config';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from './input-dialog/input-dialog.component';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public resultCount$: Observable<number>;
  public displayCount = 0;

  public selectedClass: string;
  public selectedCategory: string[];

  public destroy$ = new Subject<void>();

  public modules: Module[] = MODULES;
  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;

  public materialClassSelectionControl = new UntypedFormControl(undefined, [
    Validators.required,
  ]);
  public productCategorySelectionControl = new UntypedFormControl(undefined, [
    Validators.required,
  ]);
  public allCategoriesSelectedControl = new UntypedFormControl(false);
  @ViewChildren('categoryOption')
  public categoryOptionsQuery: QueryList<MatOption>;
  public categoryOptions: MatOption[];

  public filterForm = new UntypedFormGroup({
    materialClass: this.materialClassSelectionControl,
    productCategory: this.productCategorySelectionControl,
  });
  public defaultFilterFormValue!: {
    materialClass: DataFilter;
    productCategory: DataFilter[];
  };

  private defaultMaterialClass!: DataFilter;

  private agGridApi!: GridApi;
  private agGridColumnApi!: ColumnApi;
  private readonly TABLE_KEY = 'msdMainTable';

  private visibleColumns: string[];

  public constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridStateService: MsdAgGridStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly datePipe: DatePipe,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly translocoService: TranslocoService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.materialClassOptions$ = this.store.select(getMaterialClassOptions);
    this.productCategoryOptions$ = this.store.select(getProductCategoryOptions);
    this.optionsLoading$ = this.store.select(getOptionsLoading);
    this.resultLoading$ = this.store.select(getLoading);
    this.result$ = this.store.select(getResult);
    this.resultCount$ = this.store.select(getResultCount);

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
          if (this.filterForm.valid) {
            this.fetchMaterials();
          }
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
  }

  public ngAfterViewInit(): void {
    this.categoryOptionsQuery.changes
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(50),
        withLatestFrom(this.materialClassOptions$)
      )
      .subscribe(([options, materialClassOptions]) => {
        this.categoryOptions = options.toArray();
        this.defaultMaterialClass = materialClassOptions.find(
          (option) => option.name === 'Steel'
        ) || { id: undefined, name: undefined };
        this.materialClassSelectionControl.patchValue(
          this.defaultMaterialClass
        );
        this.allCategoriesSelectedControl.patchValue(true);
        this.defaultFilterFormValue = this.filterForm.value;

        this.parseQueryParams();
      });
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
      this.setParamFilter(decodeURIComponent(filterParamsString));
    }
    if (agGridFilterString) {
      this.setParamAgGridFilter(decodeURIComponent(agGridFilterString));
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  private setParamFilter(filterString: string): void {
    const filterParams: {
      materialClass: DataFilter;
      productCategory: DataFilter[] | string;
    } = JSON.parse(filterString);

    if (filterParams?.materialClass && filterParams?.productCategory) {
      this.materialClassSelectionControl.patchValue(
        filterParams.materialClass as DataFilter
      );
      if (filterParams.productCategory === 'all') {
        this.changeDetectorRef.detectChanges();
        this.allCategoriesSelectedControl.patchValue(true);
      } else {
        this.productCategorySelectionControl.patchValue(
          filterParams.productCategory as DataFilter[]
        );
      }
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
  }

  public toggleAllCategories(select: boolean): void {
    if (!this.categoryOptions) {
      return;
    }

    if (select) {
      this.categoryOptions.map((categoryOption) => categoryOption.select());
    } else {
      this.categoryOptions.map((categoryOption) => categoryOption.deselect());
    }
  }

  public onFilterChange({ api }: { api: GridApi }): void {
    const filterModel = api.getFilterModel();

    this.store.dispatch(setAgGridFilter({ filterModel }));
    this.displayCount = api.getDisplayedRowCount();
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
        : `${
            this.productCategorySelectionControl.value.length
          } ${this.translocoService.translate(
            'materialsSupplierDatabase.mainTable.productCategories'
          )}`;

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

    this.setAgGridFilter({ api });

    const filteredResult: DataResult[] = [];
    api.forEachNodeAfterFilter((rowNode: RowNode) => {
      filteredResult.push(rowNode.data);
    });
    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      columnApi.applyColumnState({ state, applyOrder: true });
    }

    this.displayCount = api.getDisplayedRowCount();
    this.setVisibleColumns();
  }

  public onColumnChange({ columnApi }: { columnApi: ColumnApi }): void {
    const agGridColumns = columnApi.getColumnState();
    this.agGridStateService.setColumnState(this.TABLE_KEY, agGridColumns);
    this.store.dispatch(
      setAgGridColumns({ agGridColumns: JSON.stringify(agGridColumns) })
    );
    this.setVisibleColumns();
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
      const state = this.getColumnDefs().map(
        (column: ColDef) =>
          ({
            colId: column.field,
          } as ColumnState)
      );
      this.agGridColumnApi.applyColumnState({ state, applyOrder: true });
      this.setVisibleColumns();
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
    if (!this.isDefaultAgGridFilter()) {
      this.resetAgGridFilter();
    }

    if (!this.isDefaultFilterForm()) {
      this.filterForm.reset(this.defaultFilterFormValue);
      this.materialClassSelectionControl.patchValue(this.defaultMaterialClass, {
        emitEvent: false,
        onlySelf: true,
      });
      this.toggleAllCategories(true);
    }
  }

  public isDefaultAgGridFilter(): boolean {
    return !(
      this.agGridApi &&
      this.agGridApi.getFilterModel() &&
      Object.keys(this.agGridApi.getFilterModel()).length > 0
    );
  }

  public isDefaultFilterForm(): boolean {
    const value: { materialClass: DataFilter; productCategory: DataFilter[] } =
      this.filterForm.value;
    if (value?.materialClass !== this.defaultFilterFormValue?.materialClass) {
      return false;
    }

    let isDefault = true;
    this.defaultFilterFormValue?.productCategory?.map((defaultCategory) => {
      const found = value?.productCategory?.find(
        (category) =>
          defaultCategory.id === category.id &&
          defaultCategory.name === category.name
      );

      if (!found) {
        isDefault = false;
      }
    });

    return isDefault;
  }

  public exportExcel(): void {
    if (!this.agGridApi) {
      return;
    }
    this.applicationInsightsService.logEvent('[MAC - MSD] Export Excel');

    const dateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.agGridApi.exportDataAsExcel({
      author: this.translocoService.translate(
        'materialsSupplierDatabase.mainTable.excelExport.author'
      ),
      fileName: `${dateString}${this.translocoService.translate(
        'materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix'
      )}`,
      sheetName: this.translocoService.translate(
        'materialsSupplierDatabase.mainTable.excelExport.sheetName'
      ),
      getCustomContentBelowRow: this.splitRowsForMultipleSapIdsInExport,
      processCellCallback: this.reduceSapIdsForFirstRowInExport,
    });
  }

  private setVisibleColumns(): void {
    if (!this.agGridColumnApi) {
      return;
    }
    this.visibleColumns = this.agGridColumnApi
      .getColumnState()
      .filter((columnState: ColumnState) => !columnState.hide)
      .map((columnState: ColumnState) => columnState.colId);
  }

  private readonly splitRowsForMultipleSapIdsInExport = (
    params: any
  ): ExcelCell[][] => {
    const rowNode: RowNode = params.node;
    const data = rowNode.data;

    const result: ExcelCell[][] = [];

    if (data.sapSupplierIds?.length > 1) {
      for (let i = 1; i < data.sapSupplierIds.length; i += 1) {
        const row: ExcelCell[] = [];
        const keys = Object.keys(data)
          .filter((key) => this.visibleColumns.includes(key))
          .sort(
            (a: string, b: string) =>
              this.visibleColumns.indexOf(a) - this.visibleColumns.indexOf(b)
          );
        for (const key of keys) {
          if (key === SAP_SUPPLIER_IDS) {
            row.push({
              data: {
                type: 'String',
                value: data[key][i].toString(),
              },
            });
          } else {
            row.push({
              data: {
                type: 'String',
                value: data[key]?.toString() || '',
              },
            });
          }
        }
        result.push(row);
      }
    }

    return result;
  };

  private reduceSapIdsForFirstRowInExport(params: any): string {
    const column: Column = params.column;

    return column.getColId() === SAP_SUPPLIER_IDS &&
      params.node.data[SAP_SUPPLIER_IDS]?.length > 1
      ? params.node.data[SAP_SUPPLIER_IDS][0].toString()
      : params.value?.toString() || '';
  }

  public getColumnDefs = (): ColDef[] =>
    this.columnDefs.map((columnDef) => ({
      ...columnDef,
      headerName: this.translocoService.translate(
        `materialsSupplierDatabase.mainTable.columns.${columnDef.field}`
      ),
    }));

  public openDialog(): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '863px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed: ' + result);
    });
  }
}
