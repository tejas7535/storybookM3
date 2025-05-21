/* eslint-disable max-lines */
import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { filter, Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { RowClassParams } from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import {
  Alert,
  AlertStatus,
  alertTypesToActivateToggleViaURL,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  RequestType,
  TableCreator,
} from '../../../../shared/components/table';
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
  imports: [BackendTableComponent],
  templateUrl: './alert-table.component.html',
  styleUrl: './alert-table.component.scss',
})
export class AlertTableComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  protected readonly alertService: AlertService = inject(AlertService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );

  public priorities: InputSignal<Priority[]> = input.required<Priority[]>();
  public status: InputSignal<AlertStatus> = input.required<AlertStatus>();

  private readonly params = computed(() => ({
    status: this.status(),
    priorities: this.priorities(),
  }));

  protected readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse> = (params: RequestParams) =>
    this.alertService.getAlertData(this.status(), this.priorities(), params);

  public constructor() {
    super();

    effect(() => this.params() && this.reload$().next(true));
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.alertService
      .getRefreshEvent()
      .pipe(
        tap(() => this.alertService.refreshHashTimer()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'alerts',
          context: {
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
                          },
                          alert.openFunction ===
                            OpenFunction.Customer_Material_Portfolio
                            ? {
                                state: {
                                  activateToggle:
                                    alertTypesToActivateToggleViaURL.includes(
                                      alert?.type
                                    ),
                                },
                              }
                            : undefined
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
                          },
                          alert.openFunction ===
                            OpenFunction.Customer_Material_Portfolio
                            ? {
                                state: {
                                  activateToggle:
                                    alertTypesToActivateToggleViaURL.includes(
                                      alert?.type
                                    ),
                                },
                              }
                            : undefined
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
                          },
                          alert.openFunction ===
                            OpenFunction.Customer_Material_Portfolio
                            ? {
                                state: {
                                  activateToggle:
                                    alertTypesToActivateToggleViaURL.includes(
                                      alert?.type
                                    ),
                                },
                              }
                            : undefined
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
                            this.gridApi?.applyServerSideTransaction({
                              update: [{ ...alert, open: false }],
                            });
                          } else {
                            this.gridApi?.applyServerSideTransaction({
                              remove: [alert],
                            });
                            this.dataFetchedEvent$.next({
                              ...this.dataFetchedEvent$.getValue(),
                              rowCount:
                                this.dataFetchedEvent$.getValue().rowCount - 1,
                            });
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
                          this.gridApi?.applyServerSideTransaction({
                            remove: [alert],
                          });
                          this.alertService.refreshHashTimer();
                          this.alertService.loadActiveAlerts();
                          this.dataFetchedEvent$.next({
                            ...this.dataFetchedEvent$.getValue(),
                            rowCount:
                              this.dataFetchedEvent$.getValue().rowCount - 1,
                          });
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
                          this.gridApi?.applyServerSideTransaction({
                            remove: [alert],
                          });
                          this.alertService.refreshHashTimer();
                          this.alertService.loadActiveAlerts();
                          this.dataFetchedEvent$.next({
                            ...this.dataFetchedEvent$.getValue(),
                            rowCount:
                              this.dataFetchedEvent$.getValue().rowCount - 1,
                          });
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
          },
          columnDefs,
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
        }),
        isLoading$: this.selectableOptionsService.loading$,
        hasTabView: true,
        maxAllowedTabs: 5,
      })
    );
  }

  protected setColumnDefinitions(): void {
    this.selectableOptionsService.loading$
      .pipe(
        filter((loading) => !loading),
        take(1),
        tap(() =>
          this.setConfig([
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
              visible: true,
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
          ])
        ),

        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
