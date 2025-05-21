import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { BehaviorSubject, finalize, map, Observable } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { GetRowIdParams } from 'ag-grid-enterprise';

import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import {
  columnSideBar,
  getDefaultColDef,
} from '../../../../../shared/ag-grid/grid-defaults';
import { StyledSectionComponent } from '../../../../../shared/components/styled-section/styled-section.component';
import {
  AbstractFrontendTableComponent,
  ExtendedColumnDefs,
  FrontendTableComponent,
  FrontendTableResponse,
  TableCreator,
} from '../../../../../shared/components/table';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { getColumnDefinitions, TimeScope } from '../column-definition';

export interface MonthlyCustomerPlanningDetailsProps {
  customerName: string;
  customerNumber: string;
  planningCurrency: string;
  planningLevelMaterialType: string;
  planningMaterial: string;
  planningYear: string;
  detailLevel: string;
  planningEntry: string;
  totalSalesPlanUnconstrained: number;
  totalSalesPlanAdjusted: number;
}
@Component({
  selector: 'd360-monthly-customer-planning-details-modal',

  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    FrontendTableComponent,
    StyledSectionComponent,
  ],
  templateUrl: './monthly-customer-planning-details-modal.component.html',
})
export class MonthlyCustomerPlanningDetailsModalComponent extends AbstractFrontendTableComponent {
  protected readonly dialogRef: MatDialogRef<MonthlyCustomerPlanningDetailsModalComponent> =
    inject(MatDialogRef<MonthlyCustomerPlanningDetailsModalComponent>);

  protected readonly data: MonthlyCustomerPlanningDetailsProps =
    inject(MAT_DIALOG_DATA);

  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly numberWithoutFractionDigitsPipe = inject(
    NumberWithoutFractionDigitsPipe
  );

  private hasChangedData = false;

  private firstCall = true;
  private readonly isLoading$ = new BehaviorSubject<boolean>(true);

  public get title(): string {
    return [
      translate('sales_planning.table.planning'),
      this.data.planningYear,
      this.data.planningEntry,
    ].join(' ');
  }

  public get subtitle(): string {
    const yearly = translate('sales_planning.table.yearly');

    return [
      [
        yearly,
        `${translate('sales_planning.table.totalSalesPlanUnconstrained')}:`,
        this.numberWithoutFractionDigitsPipe.transform(
          this.data.totalSalesPlanUnconstrained
        ),
      ].join(' '),
      [
        yearly,
        `${translate('sales_planning.table.totalSalesPlanAdjusted')}:`,
        this.data.totalSalesPlanAdjusted === -1
          ? '-'
          : this.numberWithoutFractionDigitsPipe.transform(
              this.data.totalSalesPlanAdjusted
            ),
      ].join(' '),
      this.data.customerName,
    ].join(' | ');
  }

  /** @inheritdoc */
  protected readonly getData$: () => Observable<FrontendTableResponse> = () => {
    if (this.firstCall) {
      this.isLoading$.next(true);
      this.firstCall = false;
    }

    return this.salesPlanningService
      .getDetailedCustomerSalesPlan({
        customerNumber: this.data.customerNumber,
        planningCurrency: this.data.planningCurrency,
        planningMaterial: this.data.planningMaterial,
        planningLevelMaterialType: this.data.planningLevelMaterialType,
        detailLevel: this.data.detailLevel,
        planningYear: this.data.planningYear,
      })
      .pipe(
        map((allMonths) =>
          allMonths.filter((month) => month.planningMonth !== '00')
        ),
        map((content) => ({ content })),
        finalize(() => this.isLoading$.next(false)), // Close loading overlay
        takeUntilDestroyed(this.destroyRef)
      );
  };

  /** @inheritdoc */
  protected override setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'sales-planning-customer-details-monthly',
          context: {
            numberPipe: this.numberWithoutFractionDigitsPipe,
            reloadData: () => {
              this.reload$().next(true);
              this.hasChangedData = true;
            },
          },
          columnDefs,
          getRowId: ({ data }: GetRowIdParams): string =>
            [
              data.customerNumber,
              data.planningYear,
              data.planningMonth,
              data.planningMaterial,
            ].join('-'),
          sideBar: { toolPanels: [columnSideBar] },
        }),
        isLoading$: this.isLoading$,
        hasToolbar: false,
        hasTabView: true,
        maxAllowedTabs: 5,
      })
    );
  }

  /** @inheritdoc */
  protected override setColumnDefinitions(): void {
    this.setConfig([
      ...(getColumnDefinitions(TimeScope.Monthly).map((col) => ({
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
        lockVisible: col.alwaysVisible,
        lockPinned: true,
        valueFormatter: col.valueFormatter,
        maxWidth: col?.maxWidth,
        tooltipComponent: col?.tooltipComponent,
        tooltipComponentParams: col?.tooltipComponentParams,
        tooltipField: col?.tooltipField,
        visible: col.visible,
      })) || []),
    ]);
  }

  public onClose() {
    this.dialogRef.close(this.hasChangedData);
  }
}
