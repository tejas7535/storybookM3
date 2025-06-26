/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { map, Observable, of, tap } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { translate } from '@jsverse/transloco';
import { GetRowIdParams } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  DetailedCustomerSalesPlan,
  PlanningLevelMaterial,
  SalesPlanningDetailLevel,
} from '../../../../feature/sales-planning/model';
import { PlanningLevelService } from '../../../../feature/sales-planning/planning-level.service';
import { SalesPlanningService } from '../../../../feature/sales-planning/sales-planning.service';
import {
  columnSideBar,
  getCustomTreeDataAutoGroupColumnDef,
  getDefaultColDef,
} from '../../../../shared/ag-grid/grid-defaults';
import { AgGridFilterType } from '../../../../shared/ag-grid/grid-types';
import { StyledSectionComponent } from '../../../../shared/components/styled-section/styled-section.component';
import {
  AbstractFrontendTableComponent,
  ExtendedColumnDefs,
  FrontendTableComponent,
  FrontendTableResponse,
  TableCreator,
} from '../../../../shared/components/table';
import { NumberWithoutFractionDigitsPipe } from '../../../../shared/pipes/number-without-fraction-digits.pipe';
import { Customer } from '../../sales-planning.component';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { CustomerPlanningDetailsChangeHistoryModalComponent } from '../customer-planning-details-change-history-modal/customer-planning-details-change-history-modal.component';
import { CustomerPlanningLevelConfigurationModalComponent } from '../customer-planning-level-configuration-modal/customer-planning-level-configuration-modal.component';
import { SalesPlanningGroupLevelCellRendererComponent } from './ag-grid/cell-renderer/sales-planning-group-level-cell-renderer/sales-planning-group-level-cell-renderer.component';
import {
  customComparatorForCustomerPlanningDetails,
  getColumnDefinitions,
  TimeScope,
} from './column-definition';
import { MonthlyCustomerPlanningDetailsModalComponent } from './monthly-customer-planning-details-modal/monthly-customer-planning-details-modal.component';

@Component({
  selector: 'd360-customer-planning-details',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIcon,
    MatIconButton,
    MatButton,
    FrontendTableComponent,
    StyledSectionComponent,
  ],
  templateUrl: './customer-planning-details.component.html',
  styleUrl: './customer-planning-details.component.scss',
})
export class CustomerPlanningDetailsComponent extends AbstractFrontendTableComponent {
  private readonly planningLevelService = inject(PlanningLevelService);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly dialog = inject(MatDialog);

  protected readonly planningLevelMaterialConfiguration =
    signal<PlanningLevelMaterial | null>(null);
  protected readonly collapsedSection = signal<boolean>(false);

  public readonly customer = input.required<Customer>();
  public readonly tableInFullscreen = model.required<boolean>();
  public readonly toggleFullscreen = input.required<() => void>();

  protected readonly numberPipe = new NumberWithoutFractionDigitsPipe();

  protected isCustomerSelected = computed(
    () => !!this.customer().customerName && !!this.customer().customerNumber
  );

  public constructor() {
    super();

    effect(() => {
      this.planningLevelMaterialConfiguration.set(null);

      if (this.isCustomerSelected()) {
        this.loadData();
      } else {
        this.reload$().next(true);
      }
    });
  }

  protected readonly getData$: () => Observable<FrontendTableResponse> = () =>
    this.isCustomerSelected()
      ? this.salesPlanningService
          .getDetailedCustomerSalesPlan({
            customerNumber: this.customer().customerNumber,
            planningCurrency: this.customer().planningCurrency,
            planningLevelMaterialType:
              this.planningLevelMaterialConfiguration()
                ?.planningLevelMaterialType || null,
            detailLevel:
              SalesPlanningDetailLevel.YearlyAndPlanningLevelMaterialDetailLevel,
          })
          .pipe(
            map((content) => ({ content })),
            takeUntilDestroyed(this.destroyRef)
          )
      : of({ content: [] });

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'sales-planning-customer-details-yearly',
          columnDefs,
          context: {
            numberPipe: this.numberPipe,
            reloadData: () => this.loadData(),
          },
          customTreeData: {
            ...getCustomTreeDataAutoGroupColumnDef<DetailedCustomerSalesPlan>({
              isGroupOpenByDefault: false,
              suppressGroupRowsSticky: true,
              getDataPath: (data: DetailedCustomerSalesPlan) =>
                this.getDataPath(data),
              autoGroupColumnDef: {
                headerName: translate('sales_planning.table.autoGroupColumn'),
                colId: 'autoGroup',
                sortable: true,
                suppressHeaderFilterButton: false,
                suppressHeaderMenuButton: true,
                minWidth: 400,
                rowGroup: true,
                filter: AgGridFilterType.Text,
                filterValueGetter: ({ data, node }) => {
                  const year = data.planningYear;

                  if (node.level === 0) {
                    return year;
                  }

                  const planningMaterial = data.planningMaterial;
                  const planningMaterialText = data.planningMaterialText;

                  return `${planningMaterial} - ${planningMaterialText}`;
                },
                cellRenderer: SalesPlanningGroupLevelCellRendererComponent,
                cellRendererParams: {
                  clickAction: this.handleYearlyAggregationClicked.bind(this),
                },
                comparator: customComparatorForCustomerPlanningDetails,
              },
            }),
          },
          getRowId: ({ data }: GetRowIdParams): string =>
            [
              data.customerNumber,
              data.planningYear,
              data.planningMonth,
              data.planningMaterial,
            ].join('-'),
          sideBar: { toolPanels: [columnSideBar] },
          noRowsMessage: translate('sales_planning.table.no_data'),
        }),
        isLoading$: of(false),
        hasTabView: true,
        renderFloatingFilter: false,
        maxAllowedTabs: 5,
      })
    );
  }

  protected setColumnDefinitions(): void {
    this.setConfig([
      ...(getColumnDefinitions(TimeScope.Yearly).map((col) => ({
        ...getDefaultColDef(
          this.translocoLocaleService.getLocale(),
          col.filter,
          col.filterParams
        ),
        key: col.colId,
        colId: col.colId,
        field: col.colId,
        headerName: col.title,
        headerTooltip: col.title,
        filter: col.filter,
        cellRenderer: col.cellRenderer,
        cellRendererParams: col.cellRendererParams,
        hide: !col.visible,
        sortable: col.sortable,
        sort: col.sort,
        alwaysVisible: col.alwaysVisible,
        lockPinned: true,
        valueFormatter: col.valueFormatter,
        maxWidth: col?.maxWidth,
        tooltipComponent: col?.tooltipComponent,
        tooltipComponentParams: col?.tooltipComponentParams,
        tooltipField: col?.tooltipField,
        visible: col.visible,
        comparator: col.comparator,
      })) || []),
    ]);
  }

  protected handlePlanningLevelModalClicked() {
    this.dialog
      .open(CustomerPlanningLevelConfigurationModalComponent, {
        data: {
          customerName: this.customer().customerName,
          customerNumber: this.customer().customerNumber,
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
                  .deleteMaterialTypeByCustomerNumber(
                    this.customer().customerNumber
                  )
                  .pipe(map(() => newPlanningLevelMaterialType))
              : of(newPlanningLevelMaterialType)
        ),
        tap((newPlanningLevelMaterialType) => {
          if (newPlanningLevelMaterialType) {
            this.planningLevelMaterialConfiguration.set({
              ...this.planningLevelMaterialConfiguration(),
              planningLevelMaterialType: newPlanningLevelMaterialType,
            });

            this.reload$().next(true);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected toggleSection(): void {
    this.collapsedSection.update((status) => !status);
  }

  protected handleChartHistoryModalClicked() {
    this.dialog.open(CustomerPlanningDetailsChangeHistoryModalComponent, {
      data: {
        customerName: this.customer().customerName,
        customerNumber: this.customer().customerNumber,
      },
      minWidth: '75vw',
      maxWidth: '100vw',
      autoFocus: false,
      disableClose: true,
      panelClass: 'resizable',
    });
  }

  protected handleYearlyAggregationClicked(
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

    this.dialog
      .open(MonthlyCustomerPlanningDetailsModalComponent, {
        data: {
          detailLevel,
          planningEntry,
          customerNumber: this.customer().customerNumber,
          customerName: this.customer().customerName,
          planningCurrency: this.customer().planningCurrency,
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
      })
      .afterClosed()
      .pipe(
        tap(
          (reloadData) =>
            detailLevel === SalesPlanningDetailLevel.MonthlyOnlyDetailLevel &&
            reloadData &&
            this.loadData()
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected openComments(): void {
    this.dialog.open(CommentsModalComponent, {
      data: {
        customerName: this.customer().customerName,
        customerNumber: this.customer().customerNumber,
      },
      minWidth: '350px',
      width: '100%',
      maxWidth: '560px',
      minHeight: '300px',
      maxHeight: '840px',
      height: '100%',
      autoFocus: false,
    });
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

  private fetchPlanningLevelMaterial(customerNumber: string) {
    this.planningLevelService
      .getMaterialTypeByCustomerNumber(customerNumber)
      .pipe(
        take(1),
        tap((data) => {
          this.planningLevelMaterialConfiguration.set(data);
          this.reload$().next(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private loadData(): void {
    this.fetchPlanningLevelMaterial(this.customer().customerNumber);
  }
}
