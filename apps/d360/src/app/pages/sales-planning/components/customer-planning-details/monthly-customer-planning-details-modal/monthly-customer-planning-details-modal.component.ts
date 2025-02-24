import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { finalize, map, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import {
  clientSideTableDefaultProps,
  columnSideBar,
  getDefaultColDef,
} from '../../../../../shared/ag-grid/grid-defaults';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { monthlyCustomerPlanningDetailsColumnDefinitions } from './column-definition';
import { MonthlyCustomerPlanningDetailsColumnSettingsService } from './service/monthly-customer-planning-details-column-settings.service';

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

type MonthlyCustomerPlanningDetailsColumnDefinitions = ReturnType<
  typeof monthlyCustomerPlanningDetailsColumnDefinitions
>[number];

@Component({
  selector: 'd360-monthly-customer-planning-details-modal',
  standalone: true,
  imports: [CommonModule, MatIcon, MatIconButton, AgGridAngular],
  templateUrl: './monthly-customer-planning-details-modal.component.html',
  styleUrl: './monthly-customer-planning-details-modal.component.scss',
})
export class MonthlyCustomerPlanningDetailsModalComponent implements OnInit {
  protected readonly dialogRef: MatDialogRef<MonthlyCustomerPlanningDetailsModalComponent> =
    inject(MatDialogRef<MonthlyCustomerPlanningDetailsModalComponent>);

  protected readonly data: MonthlyCustomerPlanningDetailsProps =
    inject(MAT_DIALOG_DATA);

  protected readonly columnSettingsService: MonthlyCustomerPlanningDetailsColumnSettingsService<
    string,
    MonthlyCustomerPlanningDetailsColumnDefinitions
  > = inject(
    MonthlyCustomerPlanningDetailsColumnSettingsService<
      string,
      MonthlyCustomerPlanningDetailsColumnDefinitions
    >
  );

  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly salesPlanningService = inject(SalesPlanningService);
  private readonly numberWithoutFractionDigitsPipe = inject(
    NumberWithoutFractionDigitsPipe
  );

  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected gridApi: GridApi | null = null;

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    context: {
      numberPipe: this.numberWithoutFractionDigitsPipe,
    },
    sideBar: {
      toolPanels: [columnSideBar],
    },
    suppressGroupRowsSticky: true,
    getRowId: (params: GetRowIdParams<DetailedCustomerSalesPlan>): string =>
      `${params.data.customerNumber}-${params.data.planningYear}-${params.data.planningMonth}-${params.data.planningMaterial}`,
  };

  public readonly isLoading = signal(false);

  public readonly title = computed(() => {
    const planning = translate('sales_planning.table.planning');

    return `${planning} ${this.data.planningYear} ${this.data.planningEntry}`;
  });

  public readonly subtitle = computed(() => {
    const yearly = translate('sales_planning.table.yearly');
    const totalSalesPlanUnconstrained = translate(
      'sales_planning.table.totalSalesPlanUnconstrained'
    );
    const totalSalesPlanAdjusted = translate(
      'sales_planning.table.totalSalesPlanAdjusted'
    );

    return [
      `${yearly} ${totalSalesPlanUnconstrained} ${this.numberWithoutFractionDigitsPipe.transform(this.data.totalSalesPlanUnconstrained)}`,
      `${yearly} ${totalSalesPlanAdjusted} ${this.numberWithoutFractionDigitsPipe.transform(this.data.totalSalesPlanAdjusted)}`,
      this.data.customerName,
    ].join(' | ');
  });

  public ngOnInit(): void {
    this.isLoading.set(true);

    this.salesPlanningService
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
        tap((data) => {
          this.gridApi?.setGridOption('rowData', data);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public onClose() {
    this.dialogRef.close(false);
  }

  public onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.createColumnDefs();
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
}
