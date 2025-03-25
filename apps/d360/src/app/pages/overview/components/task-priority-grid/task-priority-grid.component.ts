import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellStyle,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-enterprise';

import { AlertType } from '@schaeffler/alert';

import {
  AlertService,
  GroupedAlert,
} from '../../../../feature/alerts/alert.service';
import {
  Alert,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { clientSideTableDefaultProps } from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { NoDataOverlayComponent } from '../../../../shared/components/ag-grid/no-data/no-data.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';

@Component({
  selector: 'd360-task-priority-grid',
  imports: [AgGridModule, PushPipe],
  templateUrl: './task-priority-grid.component.html',
  styleUrl: './task-priority-grid.component.scss',
})
export class TaskPriorityGridComponent {
  private readonly selectableOptionsService = inject(SelectableOptionsService);
  protected noOverlayMessage = {
    message: translate('overview.yourTasks.noTasks'),
  };
  private gridApi: GridApi = null;
  public openFunction = input.required<OpenFunction>();
  public gkamNumbers = input<string[]>(null);
  public customers = input<string[]>(null);
  public priorities = input<Priority[]>(null);
  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    cellSelection: false,
    suppressCellFocus: true,
  };
  private readonly alertService: AlertService = inject(AlertService);
  protected cellStyles: CellStyle = {
    padding: 0,
  };

  protected columnDefs: ColDef[] = [
    {
      field: 'customerNumber',
      colId: 'alert.customer_number.column_header',
      minWidth: 90,
      maxWidth: 90,
      cellStyle: this.cellStyles,
    },
    {
      field: 'customerName',
      colId: 'alert.customer_name.column_header',
      flex: 1,
      cellStyle: this.cellStyles,
    },
    {
      field: 'priorityCount',
      cellRenderer: TaskPrioritiesComponent,
      cellStyle: this.cellStyles,
      minWidth: 145,
      maxWidth: 145,
    },
    {
      cellClass: ['fixed-action-column'],
      field: 'menu',
      headerName: '',
      cellRenderer: ActionsMenuCellRendererComponent,
      lockVisible: true,
      pinned: 'right',
      lockPinned: true,
      cellStyle: { ...this.cellStyles, borderLeft: 0 },
      minWidth: 50,
      maxWidth: 50,
    },
  ];
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly NoDataOverlayComponent = NoDataOverlayComponent;
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  protected rowStyles = { fontSize: '12px' };
  protected isLoading$ = this.alertService.getLoadingEvent();
  private readonly filteredData = computed(() =>
    this.alertService
      .groupDataByCustomerAndPriority(
        (this.alertService.allActiveAlerts() || [])
          ?.filter((alert) => alert?.openFunction === this.openFunction())
          ?.filter(
            (alert) =>
              !this.customers() ||
              this.customers()?.includes(alert.customerNumber)
          )
          ?.filter(
            (alert) =>
              !this.gkamNumbers() ||
              this.gkamNumbers()?.includes(alert.keyAccount)
          )
      )
      ?.filter(
        (alert) =>
          !this.priorities() ||
          this.priorities()?.some(
            (requestedPriority) => alert.priorityCount[requestedPriority] > 0
          )
      )
  );

  public constructor() {
    effect(() => {
      this.reloadGrid(this.filteredData());
    });
    this.alertService
      .getFetchErrorEvent()
      .pipe(
        tap((hasError: boolean) => {
          if (hasError) {
            this.reloadGrid([]);
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private reloadGrid(data: GroupedAlert[]) {
    this.gridApi?.setGridOption('rowData', data);
  }

  protected context: Record<string, any> = {
    getMenu: (b: any) => {
      const alert = b.data;
      const customMenu = [];

      if (alert.openFunction) {
        const route: string = this.alertService.getRouteForOpenFunction(
          alert.openFunction
        );

        const customerFilter = {
          customerNumber: [
            {
              id: alert.customerNumber,
              text: alert.customerName,
            },
          ],
        };
        const submenu: { text: string; onClick: () => void }[] = [];
        Object.keys(alert.priorityCount).forEach((priority) => {
          if (
            Object.keys(Priority).includes(priority) &&
            alert.priorityCount[priority] > 0
          ) {
            submenu.push({
              text: translate(`overview.yourTasks.priority${priority}`),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  route,
                  {
                    ...customerFilter,
                    alertType: alert.alertTypes[priority].map(
                      (selectableAlert: AlertType) =>
                        this.getSelectableOptionForAlert(selectableAlert)
                    ),
                  }
                ),
            });
          }
        });

        customMenu.push({
          text: translate('alert.action_menu.goto_function', {
            function: this.alertService.getModuleForOpenFunction(
              alert.openFunction
            ),
          }),
          submenu: [
            ...submenu,
            {
              text: translate('overview.yourTasks.selectedPriorities'),
              onClick: () =>
                this.globalSelectionStateService.navigateWithGlobalSelection(
                  route,
                  {
                    ...customerFilter,
                    alertType: [
                      ...new Set(
                        this.priorities().flatMap(
                          (prio) => alert.alertTypes[prio] || []
                        )
                      ),
                    ].map((selectableAlert: AlertType) =>
                      this.getSelectableOptionForAlert(selectableAlert)
                    ),
                  }
                ),
            },
          ],
        });
      }

      return customMenu;
    },
  };
  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    if (this.filteredData()) {
      this.reloadGrid(this.filteredData());
    }
  }
  protected getRowId: GetRowIdFunc = (params: GetRowIdParams<Alert>) =>
    params.data.customerNumber;

  protected onDataUpdated() {
    if (this.gridApi) {
      if (this.gridApi.getDisplayedRowCount() === 0) {
        this.gridApi.showNoRowsOverlay();
      } else {
        this.gridApi.hideOverlay();
      }
    }
  }

  private getSelectableOptionForAlert(alertType: AlertType): SelectableValue {
    const alertTypeOptions = this.selectableOptionsService.get('alertTypes');

    return alertTypeOptions.loadingError === null
      ? alertTypeOptions?.options?.find((option) => option.id === alertType)
      : { id: alertType, text: alertType };
  }
}
