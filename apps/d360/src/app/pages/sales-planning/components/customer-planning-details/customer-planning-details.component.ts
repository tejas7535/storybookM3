import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { finalize, map, Observable, of, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowGroupOpenedEvent,
} from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  DetailedCustomerSalesPlan,
  PlanningLevelMaterial,
  SalesPlanningDetailLevel,
} from '../../../../feature/sales-planning/model';
import { PlanningLevelService } from '../../../../feature/sales-planning/planning-level.service';
import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import {
  clientSideTableDefaultProps,
  columnSideBar,
  getCustomTreeDataAutoGroupColumnDef,
  getDefaultColDef,
} from '../../../../shared/ag-grid/grid-defaults';
import { AgGridFilterType } from '../../../../shared/ag-grid/grid-types';
import { NoDataOverlayComponent } from '../../../../shared/components/ag-grid/no-data/no-data.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { NumberWithoutFractionDigitsPipe } from '../../../../shared/pipes/number-without-fraction-digits.pipe';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { CustomerPlanningLevelConfigurationModalComponent } from '../customer-planning-level-configuration-modal/customer-planning-level-configuration-modal.component';
import { SalesPlanningGroupLevelCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-group-level-cell-renderer/sales-planning-group-level-cell-renderer.component';
import { yearlyCustomerPlanningDetailsColumnDefinitions } from './column-definition';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal/monthly-customer-planning-details-modal.component';
import { YearlyCustomerPlanningDetailsColumnSettingsService } from './service/customer-planning-details-column-settings.service';

type YearlyCustomerPlanningDetailsColumnDefinitions = ReturnType<
  typeof yearlyCustomerPlanningDetailsColumnDefinitions
>[number];

@Component({
  selector: 'd360-customer-planning-details',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIcon,
    MatIconButton,
    MatButton,
    AgGridAngular,
    TableToolbarComponent,
  ],
  templateUrl: './customer-planning-details.component.html',
})
export class CustomerPlanningDetailsComponent {
  private readonly planningLevelService = inject(PlanningLevelService);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);

  public readonly planningLevelMaterialConfiguration =
    signal<PlanningLevelMaterial | null>(null);
  public readonly customerName = input.required<string>();
  public readonly customerNumber = input.required<string>();
  public readonly planningCurrency = input.required<string>();
  public readonly openFullscreen = input.required<boolean>();
  public readonly toggleFullscreen = input.required<() => void>();
  public readonly collapsedSection = input.required<boolean>();
  public readonly toggleSection = input.required<() => void>();

  public readonly getApi: OutputEmitterRef<GridApi> = output();

  public readonly rowCount = signal<number>(0);
  protected readonly isLoading = signal<boolean>(false);

  protected readonly columnSettingsService: YearlyCustomerPlanningDetailsColumnSettingsService<
    string,
    YearlyCustomerPlanningDetailsColumnDefinitions
  > = inject(
    YearlyCustomerPlanningDetailsColumnSettingsService<
      string,
      YearlyCustomerPlanningDetailsColumnDefinitions
    >
  );

  protected readonly noDataOverlayComponent = NoDataOverlayComponent;
  protected readonly noDataOverlayMessage = {
    message: translate('sales_planning.table.no_data'),
  };

  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected gridApi: GridApi | null = null;

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    ...getCustomTreeDataAutoGroupColumnDef<DetailedCustomerSalesPlan>({
      getDataPath: (data: DetailedCustomerSalesPlan) => this.getDataPath(data),
      autoGroupColumnDef: {
        headerName: translate('sales_planning.table.autoGroupColumn'),
        colId: 'autoGroup',
        sortable: false,
        suppressHeaderFilterButton: false,
        suppressHeaderMenuButton: true,
        minWidth: 400,
        rowGroup: true,
        filter: AgGridFilterType.Text,
        filterValueGetter: (params) => {
          const year = params.data.planningYear;

          if (params.node.level === 0) {
            return year;
          }

          const planningMaterial = params.data.planningMaterial;
          const planningMaterialText = params.data.planningMaterialText;

          return `${planningMaterial} - ${planningMaterialText}`;
        },
        cellRenderer: SalesPlanningGroupLevelCellRendererComponent,
        cellRendererParams: {
          clickAction: this.handleYearlyAggregationClicked.bind(this),
        },
      },
    }),
    context: {
      numberPipe: new NumberWithoutFractionDigitsPipe(),
      reloadData: () => {
        this.setYearlyPlanningData(
          this.planningLevelMaterialConfiguration().planningLevelMaterialType
        );
        this.fetchPlanningLevelMaterial(this.customerNumber());
      },
    },
    isGroupOpenByDefault: () => true,
    suppressGroupRowsSticky: true,
    sideBar: {
      toolPanels: [columnSideBar],
    },
    getRowId: (params: GetRowIdParams<DetailedCustomerSalesPlan>): string =>
      `${params.data.customerNumber}-${params.data.planningYear}-${params.data.planningMonth}-${params.data.planningMaterial}`,
  };

  public constructor() {
    effect(() => {
      this.planningLevelMaterialConfiguration.set(null);

      if (this.isNoCustomerSelected()) {
        this.planningLevelMaterialConfiguration.set(null);
        this.gridApi?.setGridOption('rowData', []);
        this.rowCount.set(this.gridApi?.getDisplayedRowCount());
      } else {
        this.fetchPlanningLevelMaterial(this.customerNumber());
        this.setYearlyPlanningData(null);
      }
    });
  }

  public handlePlanningLevelModalClicked() {
    this.dialog
      .open(CustomerPlanningLevelConfigurationModalComponent, {
        data: {
          customerName: this.customerName(),
          customerNumber: this.customerNumber(),
          planningLevelMaterial: this.planningLevelMaterialConfiguration(),
        },
        width: '600px',
        maxWidth: '900px',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        switchMap(
          ({ deleteExistingPlanningData, newPlanningLevelMaterialType }) =>
            deleteExistingPlanningData
              ? this.planningLevelService
                  .deleteMaterialTypeByCustomerNumber(this.customerNumber())
                  .pipe(map(() => newPlanningLevelMaterialType))
              : of(null).pipe(map(() => newPlanningLevelMaterialType))
        ),
        tap((newPlanningLevelMaterialType) => {
          if (newPlanningLevelMaterialType) {
            this.planningLevelMaterialConfiguration.set({
              ...this.planningLevelMaterialConfiguration(),
              planningLevelMaterialType: newPlanningLevelMaterialType,
            });

            this.setYearlyPlanningData(newPlanningLevelMaterialType);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public isNoCustomerSelected() {
    return this.customerName() === null && this.customerNumber() === null;
  }

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.getApi.emit(event.api);

    this.createColumnDefs();
  }

  protected onFirstDataRendered(event: FirstDataRenderedEvent): void {
    this.columnSettingsService.applyStoredFilters(event.api);
  }

  private setYearlyPlanningData(planningLevelMaterialType?: string) {
    this.isLoading.set(true);
    this.rowCount.set(0);

    this.fetchYearlyPlanningData(
      this.customerNumber(),
      this.planningCurrency(),
      planningLevelMaterialType
    )
      .pipe(
        tap((data) => {
          this.gridApi?.setGridOption('rowData', data);
          this.rowCount.set(this.gridApi?.getDisplayedRowCount());
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private createColumnDefs() {
    this.columnSettingsService
      .getColumnSettings()
      .pipe(
        tap((columnSettings) => {
          const floatingFilter =
            // eslint-disable-next-line unicorn/no-array-reduce
            columnSettings.reduce(
              (current, next) => current || !!next.filterModel,
              false
            );

          this.gridApi?.setGridOption('columnDefs', [
            ...(columnSettings.map((col) => ({
              ...getDefaultColDef(
                this.translocoLocaleService.getLocale(),
                col.filter,
                col.filterParams
              ),
              key: col.colId,
              colId: col.colId,
              field: col.colId,
              headerName: translate(col.title, {}),
              filter: col.filter,
              cellRenderer: col.cellRenderer,
              cellRendererParams: col.cellRendererParams,
              hide: !col.visible,
              sortable: col.sortable,
              sort: col.sort,
              lockVisible: col.alwaysVisible,
              lockPinned: true,
              valueFormatter: col.valueFormatter,
              floatingFilter,
              maxWidth: col?.maxWidth,
              tooltipComponent: col?.tooltipComponent,
              tooltipComponentParams: col?.tooltipComponentParams,
              tooltipField: col?.tooltipField,
            })) || []),
          ] as ColDef[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private getDataPath(data: DetailedCustomerSalesPlan) {
    if (!data) {
      return [];
    }

    if (!data.planningMaterial) {
      return [data.planningYear];
    }

    return [data.planningYear, data.planningMaterial];
  }

  private fetchYearlyPlanningData(
    customerNumber: string,
    planningCurrency: string,
    planningLevelMaterialType?: string
  ): Observable<DetailedCustomerSalesPlan[]> {
    return this.salesPlanningService.getDetailedCustomerSalesPlan({
      customerNumber,
      planningCurrency,
      planningLevelMaterialType,
      detailLevel:
        SalesPlanningDetailLevel.YearlyAndPlanningLevelMaterialDetailLevel,
    });
  }

  private fetchPlanningLevelMaterial(customerNumber: string) {
    this.planningLevelService
      .getMaterialTypeByCustomerNumber(customerNumber)
      .pipe(
        tap((data) => this.planningLevelMaterialConfiguration.set(data)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public onFilterChanged() {
    this.rowCount.set(this.gridApi.getDisplayedRowCount());
  }

  public onRowGroupOpened(_: RowGroupOpenedEvent) {
    this.rowCount.set(this.gridApi.getDisplayedRowCount());
  }

  public handleYearlyAggregationClicked(
    rowData: DetailedCustomerSalesPlan,
    isYearlyAggregationRowClicked: boolean
  ) {
    let detailLevel =
      SalesPlanningDetailLevel.MonthlyAndPlanningLevelMaterialDetailLevel;
    let planningEntry = `${rowData.planningMaterial} - ${rowData.planningMaterialText}`;

    if (isYearlyAggregationRowClicked) {
      detailLevel = SalesPlanningDetailLevel.MonthlyOnlyDetailLevel;
      planningEntry = '';
    }

    this.dialog.open(MonthlyCustomerPlanningDetailsModalComponent, {
      data: {
        detailLevel,
        planningEntry,
        customerNumber: this.customerNumber(),
        customerName: this.customerName(),
        planningCurrency: this.planningCurrency(),
        planningYear: rowData.planningYear,
        planningMaterial: rowData.planningMaterial,
        planningLevelMaterialType:
          this.planningLevelMaterialConfiguration().planningLevelMaterialType,
        totalSalesPlanUnconstrained: rowData.totalSalesPlanUnconstrained,
        totalSalesPlanAdjusted: rowData.totalSalesPlanAdjusted,
      },
      autoFocus: false,
      disableClose: true,
      hasBackdrop: false,
      panelClass: 'monthly-customer-planning-details',
      width: '100vw',
      height: '100vh',
    });
  }
}
