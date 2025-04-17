import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { take, tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-enterprise';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NoDataOverlayComponent } from 'apps/d360/src/app/shared/components/ag-grid/no-data/no-data.component';

import { AppRoutePath } from '../../../../app.routes.enum';
import { Alert } from '../../../../feature/alerts/model';
import { OverviewService } from '../../../../feature/overview/overview.service';
import {
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { applyColumnSettings } from '../../../../shared/ag-grid/grid-utils';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { CustomerSalesPlanningLayout } from '../../overview.component';
import { CustomerSalesPlanningColumnSettingsService } from '../../services/customer-sales-planning-column-settings.service';
import { getColumnDefs } from './column-definitions';

export interface CustomerSalesPlanningData {
  currency: string;
  customerNumber: string;
  customerName: string;
  lastPlannedBy: number;
  lastChangeDate: number;
  firmBusinessPreviousYear: number;
  yearlyTotalCurrentYear: number;
  firmBusinessCurrentYear: number;
  deviationToPreviousYear: number;
  salesPlannedCurrentYear: number;
  demandPlannedCurrentYear: number;
  yearlyTotalNextYear: number;
  firmBusinessNextYear: number;
  deviationToCurrentYear: number;
  salesPlannedNextYear: number;
  demandPlannedNextYear: number;
}

type CustomerSalesPlanningColumnDefinitions = ReturnType<
  typeof getColumnDefs
>[number];

@Component({
  selector: 'd360-customer-sales-planning-grid',
  imports: [AgGridAngular, TranslocoDirective, TableToolbarComponent, PushPipe],
  templateUrl: './customer-sales-planning-grid.component.html',
  styleUrl: './customer-sales-planning-grid.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerSalesPlanningGridComponent {
  protected readonly NoDataOverlayComponent = NoDataOverlayComponent;
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  protected readonly overviewService: OverviewService = inject(OverviewService);
  private readonly router: Router = inject(Router);

  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly columnSettingsService: CustomerSalesPlanningColumnSettingsService<
    string,
    CustomerSalesPlanningColumnDefinitions
  > = inject(
    CustomerSalesPlanningColumnSettingsService<
      string,
      CustomerSalesPlanningColumnDefinitions
    >
  );
  public layout = input.required<CustomerSalesPlanningLayout>();
  public isAssignedToMe = input.required<boolean>();
  public gkamNumbers = input<string[]>(null);
  public customerNumbers = input<string[]>(null);
  public selectionChanged = output<any>();
  protected gridApi: GridApi<CustomerSalesPlanningData> = null;
  protected gridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
  };
  protected rowStyles = { fontSize: '12px' };

  protected currentColumnDefs = signal(
    this.columnSettingsService.getColumnDefs(
      CustomerSalesPlanningLayout.PreviousToCurrent
    )
  );
  protected getRowId: GetRowIdFunc = (params: GetRowIdParams<Alert>) =>
    params.data.customerNumber;

  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.setServerSideDatasource(
      this.isAssignedToMe(),
      this.gkamNumbers(),
      this.customerNumbers()
    );
    this.createColumnDefsForLayout(this.layout());

    // Deselect row if currently selected customer is not contained in new data
    this.overviewService
      .getDataFetchedEvent()
      .pipe(
        tap((data) => {
          const customerNumberSelected =
            this.gridApi.getSelectedRows()?.[0]?.customerNumber;
          if (
            !data?.rows
              ?.map((row) => row.customerNumber)
              .includes(customerNumberSelected)
          ) {
            this.selectionChanged.emit(null);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private createColumnDefsForLayout(layout: CustomerSalesPlanningLayout): void {
    if (this.gridApi) {
      this.columnSettingsService
        .loadColumnSettings$(this.layout())
        .pipe(
          take(1),
          tap((columnSettings) => {
            if (columnSettings && columnSettings.length > 0) {
              applyColumnSettings(this.gridApi, columnSettings);
            } else {
              this.currentColumnDefs.set(
                this.columnSettingsService.getColumnDefs(layout)
              );
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )

        .subscribe();
    }
  }

  protected onDataUpdated(): void {
    if (this.gridApi) {
      if (this.gridApi.getDisplayedRowCount() === 0) {
        this.gridApi.showNoRowsOverlay();
      } else {
        this.gridApi.hideOverlay();
      }
    }
  }

  protected context: Record<string, any> = {
    getMenu: (row: { data: CustomerSalesPlanningData }) => {
      const entry = row.data;

      return [
        {
          text: translate('overview.yourCustomer.grid.jumpToFunction'),
          submenu: [
            {
              text: translate('tabbarMenu.sales-planning.label'),
              onClick: () => {
                sessionStorage.setItem(
                  AppRoutePath.SalesValidationPage,
                  JSON.stringify({ customerNumber: entry.customerNumber })
                );
                this.router.navigate([AppRoutePath.SalesValidationPage]);
              },
            },
            {
              text: translate('tabbarMenu.validation-of-demand.label'),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  AppRoutePath.DemandValidationPage,
                  {
                    customerNumber: [
                      {
                        id: entry.customerNumber,
                        text: entry.customerName,
                      },
                    ],
                  }
                ),
            },
          ],
        },
      ];
    },
  };

  public constructor() {
    effect(() => {
      this.setServerSideDatasource(
        this.isAssignedToMe(),
        this.gkamNumbers(),
        this.customerNumbers()
      );
    });
    effect(() => {
      this.createColumnDefsForLayout(this.layout());
    });
  }

  private setServerSideDatasource(
    isAssignedToMe: boolean,
    gkamNumbers: string[],
    customers: string[]
  ): void {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'serverSideDatasource',
        this.overviewService.createCustomerSalesPlanningDatasource(
          isAssignedToMe,
          gkamNumbers,
          customers
        )
      );
    }
  }

  protected toggleSelection(event: CellClickedEvent): void {
    const node = event.node;
    if (node.isSelected()) {
      node.setSelected(false);
      this.selectionChanged.emit(null);
    } else {
      node.setSelected(true);
      this.selectionChanged.emit(node.data);
    }
  }

  protected onFirstDataRendered(event: FirstDataRenderedEvent): void {
    this.columnSettingsService.applyStoredFilters(event.api);
  }

  public resetSelection(): void {
    this.gridApi.deselectAll();
    this.selectionChanged.emit(null);
  }
}
