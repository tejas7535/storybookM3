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

import { tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  RowClassParams,
} from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { Alert, AlertStatus, Priority } from '../../../../feature/alerts/model';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { DateFilterComponent } from '../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';
import { NoDataOverlayComponent } from '../../../../shared/components/ag-grid/no-data/no-data.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';
import { getAlertTableColumnDefinitions } from './column-definitions';

export interface ContextMenuEntry {
  text: string;
  onClick?: () => void;
  showDivider?: boolean;
  submenu?: ContextMenuEntry[];
}

@Component({
  selector: 'd360-alert-table',
  imports: [AgGridModule, TableToolbarComponent, TranslocoDirective],
  templateUrl: './alert-table.component.html',
  styleUrl: './alert-table.component.scss',
})
export class AlertTableComponent {
  public gridApi: GridApi<Alert>;
  public getApi: OutputEmitterRef<GridApi<Alert>> = output();
  protected readonly alertService: AlertService = inject(AlertService);
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly selectableOptionsService: SelectableOptionsService = inject(
    SelectableOptionsService
  );
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly translocoLocaleService = inject(TranslocoLocaleService);

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
  };

  protected readonly noDataOverlayComponent = NoDataOverlayComponent;
  protected readonly data = this.alertService.getDataFetchedEvent();
  protected rowCount = signal<number>(0);

  protected readonly isGridAutoSized = signal(false);
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
    rowClassRules: {
      'is-active': (params: RowClassParams<Alert>) => params.data?.open,
      'is-prio1': (params: RowClassParams<Alert>) =>
        params.data?.open && params.data?.alertPriority === 1,
      'is-prio2': (params: RowClassParams<Alert>) =>
        params.data?.open && params.data?.alertPriority === 2,
      'is-info': (params: RowClassParams<Alert>) =>
        params.data?.open && params.data?.alertPriority === 3,
      'is-deactivated': (params: RowClassParams<Alert>) =>
        params.data?.deactivated,
      'is-closed': (params: RowClassParams<Alert>) => !params.data?.open,
    },
  };
  protected datasource: IServerSideDatasource;
  public priorities = input.required<Priority[]>();
  public status = input.required<AlertStatus>();

  protected context: Record<string, any> = {
    getMenu: (rowData: { data: Alert }): ContextMenuEntry[] => {
      const alert: Alert = rowData.data;
      const customMenu = [];

      if (alert.openFunction) {
        const route: string = this.alertService.getRouteForOpenFunction(
          alert.openFunction
        );

        customMenu.push({
          text: translate('alert.action_menu.goto_function', {
            function: this.alertService.getModuleForOpenFunction(
              alert.openFunction
            ),
          }),
          showDivider: true,
          submenu: [
            {
              text: translate('alert.action_menu.base_combination'),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  route,
                  {
                    customerNumber: [
                      {
                        id: alert.customerNumber,
                        text: alert.customerName,
                      },
                    ],
                    materialNumber: [
                      {
                        id: alert.materialNumber,
                        text: alert.materialDescription,
                      },
                    ],
                  }
                ),
            },
            {
              text: translate('alert.action_menu.customer_category'),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  route,
                  {
                    customerNumber: [
                      {
                        id: alert.customerNumber,
                        text: alert.customerName,
                      },
                    ],
                    alertType: [
                      {
                        id: alert.type,
                        text: translate(`alert.category.${alert.type}`),
                      },
                    ],
                  }
                ),
            },
            {
              text: translate('alert.action_menu.customer'),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  route,
                  {
                    customerNumber: [
                      {
                        id: alert.customerNumber,
                        text: alert.customerName,
                      },
                    ],
                  }
                ),
            },
          ],
        });
      }

      if (alert.open) {
        customMenu.push({
          text: translate('alert.action_menu.complete'),
          onClick: () =>
            this.alertService
              .completeAlert(alert.id)
              .pipe(
                tap(() => {
                  if (alert.deactivated) {
                    this.gridApi.applyServerSideTransaction({
                      update: [{ ...alert, open: false }],
                    });
                  } else {
                    this.gridApi.applyServerSideTransaction({
                      remove: [alert],
                    });
                    this.rowCount.set(this.rowCount() - 1);
                  }
                  this.alertService.refreshHashTimer();
                  this.alertService.loadActiveAlerts();
                  this.snackbarService.openSnackBar(
                    translate('alert.action_menu.alert_completed')
                  );
                }),
                takeUntilDestroyed(this.destroyRef)
              )
              .subscribe(),
        });
      }

      if (alert.deactivated) {
        customMenu.push({
          text: translate('alert.action_menu.activate'),
          onClick: () =>
            this.alertService
              .activateAlert(alert.id)
              .pipe(
                tap(() => {
                  this.gridApi.applyServerSideTransaction({
                    remove: [alert],
                  });
                  this.alertService.refreshHashTimer();
                  this.alertService.loadActiveAlerts();
                  this.rowCount.set(this.rowCount() - 1);
                  this.snackbarService.openSnackBar(
                    translate('alert.action_menu.alert_activated')
                  );
                }),
                takeUntilDestroyed(this.destroyRef)
              )
              .subscribe(),
        });
      } else {
        customMenu.push({
          text: translate('alert.action_menu.deactivate'),
          onClick: () =>
            this.alertService
              .deactivateAlert(alert.id)
              .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap(() => {
                  this.gridApi.applyServerSideTransaction({
                    remove: [alert],
                  });
                  this.alertService.refreshHashTimer();
                  this.alertService.loadActiveAlerts();
                  this.rowCount.set(this.rowCount() - 1);
                  this.snackbarService.openSnackBar(
                    translate('alert.action_menu.alert_deactivated')
                  );
                })
              )
              .subscribe(),
        });
      }

      return customMenu;
    },
  };

  public constructor() {
    effect(() =>
      this.setServerSideDatasource(this.status(), this.priorities())
    );

    this.alertService
      .getRefreshEvent()
      .pipe(
        tap(() => {
          this.setServerSideDatasource(this.status(), this.priorities());
          this.alertService.refreshHashTimer();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private updateColumnDefs(): void {
    this.gridApi?.setGridOption('columnDefs', [
      ...(getAlertTableColumnDefinitions(
        this.agGridLocalizationService,
        this.selectableOptionsService.get('alertTypes').options
      ).map((col) => ({
        ...getDefaultColDef(
          this.translocoLocaleService.getLocale(),
          col.filter,
          col.filterParams
        ),
        field: col.field,
        headerName: translate(col.colId),
        sortable: col.sortable,
        filter: col.filter,
        flex: col.flex,
        type: col.type,
        cellRenderer: col.cellRenderer,
        minWidth: col.minWidth,
        maxWidth: col.maxWidth,
        tooltipValueGetter: col.tooltipValueGetter,
        tooltipField: col.tooltipField,
        colId: col.field,
        valueFormatter: col.valueFormatter,
      })) || []),
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        headerName: '',
        cellRenderer: ActionsMenuCellRendererComponent,
        lockVisible: true,
        pinned: 'right',
        lockPinned: true,
        suppressHeaderMenuButton: true,
        maxWidth: 64,
        suppressSizeToFit: true,
      },
    ] as ColDef<Alert>[]);
  }

  protected onGridReady(event: GridReadyEvent<Alert>): void {
    this.gridApi = event.api;
    this.getApi.emit(event.api);
    if (this.gridApi) {
      this.updateColumnDefs();
      this.setServerSideDatasource(this.status(), this.priorities());
      this.alertService
        .getDataFetchedEvent()
        .pipe(
          tap((value) => {
            this.rowCount.set(value.rowCount);

            if (!this.isGridAutoSized()) {
              this.isGridAutoSized.set(true);
              this.gridApi?.autoSizeAllColumns();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  protected getRowId: GetRowIdFunc = (params: GetRowIdParams<Alert>) =>
    params?.data?.id;

  protected onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event?.api?.autoSizeAllColumns();
  }

  private setServerSideDatasource(status: AlertStatus, priorities: Priority[]) {
    if (this.gridApi) {
      this.gridApi.setGridOption(
        'serverSideDatasource',
        this.alertService.createAlertDatasource(status, priorities)
      );
    }
  }

  protected onDataUpdated() {
    if (this.gridApi) {
      if (this.gridApi.getDisplayedRowCount() === 0) {
        this.gridApi.showNoRowsOverlay();
      } else {
        this.gridApi.hideOverlay();
      }
    }
  }
}
