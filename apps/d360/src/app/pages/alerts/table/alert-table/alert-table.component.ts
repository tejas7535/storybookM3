import {
  Component,
  DestroyRef,
  inject,
  output,
  OutputEmitterRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowClassParams,
} from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { Alert } from '../../../../feature/alerts/model';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';
import { NoDataOverlayComponent } from './../../../../shared/components/ag-grid/no-data/no-data.component';
import { getAlertTableColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-alert-table',
  standalone: true,
  imports: [AgGridModule, TableToolbarComponent, TranslocoDirective],
  templateUrl: './alert-table.component.html',
  styleUrl: './alert-table.component.scss',
})
export class AlertTableComponent {
  public gridApi: GridApi;
  public getApi: OutputEmitterRef<GridApi> = output();
  public onUpdateAlert: OutputEmitterRef<void> = output();
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

  protected readonly noDataOverlayComponent = NoDataOverlayComponent;
  protected readonly data = this.alertService.getDataFetchedEvent();
  protected rowCount = signal<number>(0);

  protected readonly isGridAutoSized = signal(false);
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
    rowClassRules: {
      'is-active': (params: RowClassParams) =>
        (params.data as Alert | undefined)?.open,
      'is-critical': (params: RowClassParams) =>
        (params.data as Alert | undefined)?.open &&
        (params.data as Alert | undefined)?.priority,
      'is-deactivated': (params: RowClassParams) =>
        (params.data as Alert | undefined)?.deactivated,
      'is-closed': (params: RowClassParams) =>
        !(params.data as Alert | undefined)?.open,
    },
  };
  protected datasource = this.alertService.createAlertDatasource('ACTIVE');

  protected context: Record<string, any> = {
    getMenu: (b: any) => {
      const alert: Alert = b.data;
      const customMenu = [];

      if (alert.openFunction) {
        let module: string;
        let route: string;

        switch (alert.openFunction) {
          case 'VOD': {
            module = translate('validation_of_demand.title');
            route = 'validationOfDemand';
            break;
          }
          case 'CMP': {
            module = translate('customer_material_portfolio.title');
            route = 'customerMaterialPortfolio';
            break;
          }
          default: {
            module = alert.openFunction;
            route = '/';
            break;
          }
        }
        customMenu.push({
          text: translate('alert.action_menu.goto_function', {
            function: module,
          }),
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

                  this.onUpdateAlert.emit();
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
                  this.onUpdateAlert.emit();
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
                  this.onUpdateAlert.emit();
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

  private updateColumnDefs(): void {
    this.gridApi?.setGridOption('columnDefs', [
      ...(getAlertTableColumnDefinitions(
        this.agGridLocalizationService,
        this.selectableOptionsService.get('alertTypes').options
      ).map((col) => ({
        ...getDefaultColDef(col.filter, col.filterParams),
        field: col.property,
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
        colId: col.property,
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
    ] as ColDef[]);
  }

  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.getApi.emit(event.api);
    if (this.gridApi) {
      this.updateColumnDefs();

      this.alertService
        .getDataFetchedEvent()
        .pipe(
          tap((value) => {
            this.rowCount.set(value.rowCount);

            if (value.rowCount === 0) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.gridApi.hideOverlay();
            }

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
    params.data.id;

  protected onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.autoSizeAllColumns();
  }
}
