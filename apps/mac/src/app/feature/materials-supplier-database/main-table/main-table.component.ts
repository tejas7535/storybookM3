/* eslint-disable max-lines */
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, withLatestFrom } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import {
  ColumnApi,
  Column,
  ColumnState,
  RowNode,
  ExcelRow,
} from 'ag-grid-community';
import { ColDef, ExcelCell, GridApi, SideBarDef } from 'ag-grid-enterprise';
import { translate } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StringOption } from '@schaeffler/inputs';

import { InputDialogComponent } from '@mac/msd/main-table/input-dialog/input-dialog.component';
import {
  COLUMN_DEFINITIONS,
  DEFAULT_COLUMN_DEFINITION,
  SAP_SUPPLIER_IDS,
  SIDE_BAR_CONFIG,
} from '@mac/msd/main-table/table-config';
import { DataResult } from '@mac/msd/models';
import { MsdAgGridStateService } from '@mac/msd/services';
import {
  addMaterialDialogOpened,
  DataFacade,
  fetchClassAndCategoryOptions,
  fetchMaterials,
  setAgGridColumns,
  setAgGridFilter,
  setFilter,
} from '@mac/msd/store';

/* eslint-disable max-lines */
@Component({
  selector: 'mac-main-table',
  templateUrl: './main-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTableComponent implements OnInit, OnDestroy, AfterViewInit {
  public materialClassOptions$ = this.dataFacade.materialClassOptions$;
  public productCategoryOptions$ = this.dataFacade.productCategoryOptions$;
  public optionsLoading$ = this.dataFacade.optionsLoading$;
  public resultLoading$ = this.dataFacade.resultLoading$;
  public result$ = this.dataFacade.result$;
  public resultCount$ = this.dataFacade.resultCount$;

  public displayCount = 0;

  public hasEditorRole$ = this.dataFacade.hasEditorRole$;

  public selectedClass: string;
  public selectedCategory: string;

  public destroy$ = new Subject<void>();

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;
  public defaultColumnDefs: ColDef[] = COLUMN_DEFINITIONS;
  public columnDefs: ColDef[];
  public sidebar: SideBarDef = SIDE_BAR_CONFIG;

  public materialClassSelectionControl = new FormControl<StringOption>(
    undefined,
    [Validators.required]
  );
  public productCategorySelectionControl = new FormControl<StringOption[]>(
    undefined,
    [Validators.required]
  );
  public allCategoriesSelectedControl = new FormControl<boolean>(false);
  @ViewChildren('categoryOption')
  public categoryOptionsQuery: QueryList<MatOption>;
  public categoryOptions: MatOption[];

  public filterForm = new FormGroup<{
    materialClass: FormControl<StringOption>;
    productCategory: FormControl<StringOption[]>;
  }>({
    materialClass: this.materialClassSelectionControl,
    productCategory: this.productCategorySelectionControl,
  });
  public defaultFilterFormValue!: Partial<{
    materialClass: StringOption;
    productCategory: StringOption[];
  }>;

  private defaultMaterialClass!: StringOption;

  private agGridApi!: GridApi;
  private agGridColumnApi!: ColumnApi;
  private readonly TABLE_KEY = 'msdMainTable';

  private visibleColumns: string[];
  public agGridTooltipDelay = 500;

  public constructor(
    private readonly dataFacade: DataFacade,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly agGridStateService: MsdAgGridStateService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly datePipe: DatePipe,
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.columnDefs = this.getColumnDefs();

    this.dataFacade.dispatch(fetchClassAndCategoryOptions());

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

    this.dataFacade.filters$
      .pipe(take(1))
      .subscribe(
        (filters: {
          materialClass: StringOption | undefined;
          productCategory: StringOption[] | undefined;
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
      .subscribe(({ materialClass, productCategory }) => {
        const filters = {
          materialClass,
          productCategory: this.allCategoriesSelectedControl.value
            ? undefined
            : productCategory,
        };
        this.dataFacade.dispatch(setFilter(filters));
        if (this.filterForm.valid) {
          this.fetchMaterials();
        }
      });

    this.dataFacade.agGridFilter$
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
          (option) => option.id === 'st'
        ) || { id: undefined, title: undefined };
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
      materialClass: StringOption;
      productCategory: StringOption[] | string;
    } = JSON.parse(filterString);

    if (filterParams?.materialClass && filterParams?.productCategory) {
      this.materialClassSelectionControl.patchValue(filterParams.materialClass);
      if (filterParams.productCategory === 'all') {
        this.changeDetectorRef.detectChanges();
        this.allCategoriesSelectedControl.patchValue(true);
      } else {
        this.productCategorySelectionControl.patchValue(
          filterParams.productCategory as StringOption[]
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
    this.dataFacade.dispatch(setAgGridFilter({ filterModel }));
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

    this.dataFacade.dispatch(setAgGridFilter({ filterModel }));
    this.displayCount = api.getDisplayedRowCount();
  }

  public setAgGridFilter({ api }: { api: GridApi }): void {
    this.agGridApi = api;
    this.dataFacade.agGridFilter$
      .pipe(take(1))
      .subscribe((filterModel: { [key: string]: any }) => {
        if (filterModel) {
          api.setFilterModel(filterModel);
        }
      });
  }

  public compareStringOptions(a: StringOption, b: StringOption) {
    return !!a && !!b && a.id === b.id && a.title === b.title;
  }

  public fetchMaterials(): void {
    this.selectedClass = this.materialClassSelectionControl.value?.id
      ? this.materialClassSelectionControl.value.title
      : undefined;

    this.selectedCategory =
      this.allCategoriesSelectedControl.value ||
      this.productCategorySelectionControl.value?.length === 0
        ? undefined
        : // eslint-disable-next-line unicorn/no-nested-ternary
        this.productCategorySelectionControl.value?.length === 1
        ? this.productCategorySelectionControl.value[0].title
        : `${this.productCategorySelectionControl.value.length} ${translate(
            'materialsSupplierDatabase.mainTable.productCategories'
          )}`;

    this.dataFacade.dispatch(fetchMaterials());
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
    this.dataFacade.dispatch(
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
    const value = this.filterForm.value;
    if (value?.materialClass !== this.defaultFilterFormValue?.materialClass) {
      return false;
    }

    let isDefault = true;
    this.defaultFilterFormValue?.productCategory?.map((defaultCategory) => {
      const found = value?.productCategory?.find(
        (category) =>
          defaultCategory.id === category.id &&
          defaultCategory.title === category.title
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
      author: translate(
        'materialsSupplierDatabase.mainTable.excelExport.author'
      ),
      fileName: `${dateString}${translate(
        'materialsSupplierDatabase.mainTable.excelExport.fileNameSuffix'
      )}`,
      sheetName: translate(
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
  ): ExcelRow[] => {
    const rowNode: RowNode = params.node;
    const data = rowNode.data;

    const result: ExcelRow[] = [];

    if (data.sapSupplierIds?.length > 1) {
      for (let i = 1; i < data.sapSupplierIds.length; i += 1) {
        const cells: ExcelCell[] = [];
        const keys = Object.keys(data)
          .filter((key) => this.visibleColumns.includes(key))
          .sort(
            (a: string, b: string) =>
              this.visibleColumns.indexOf(a) - this.visibleColumns.indexOf(b)
          );
        for (const key of keys) {
          if (key === SAP_SUPPLIER_IDS) {
            cells.push({
              data: {
                type: 'String',
                value: data[key][i].toString(),
              },
            });
          } else {
            cells.push({
              data: {
                type: 'String',
                value: data[key]?.toString() || '',
              },
            });
          }
        }
        const row: ExcelRow = { cells };
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
    this.defaultColumnDefs.map((columnDef) => ({
      ...columnDef,
      headerName: translate(
        `materialsSupplierDatabase.mainTable.columns.${columnDef.field}`
      ),
      headerTooltip: columnDef.tooltipField
        ? translate(
            `materialsSupplierDatabase.mainTable.tooltip.${columnDef.tooltipField}`
          )
        : undefined,
    }));

  public openDialog(): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '863px',
      autoFocus: false,
      enterAnimationDuration: '100ms',
      restoreFocus: false,
    });
    this.dataFacade.dispatch(addMaterialDialogOpened());

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reload?: boolean) => {
        if (reload) {
          this.fetchMaterials();
        }
      });
  }
}
