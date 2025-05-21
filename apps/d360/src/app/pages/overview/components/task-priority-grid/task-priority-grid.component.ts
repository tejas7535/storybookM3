import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { combineLatest, map, Observable, of, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { AlertType } from '@schaeffler/alert';

import { AlertService } from '../../../../feature/alerts/alert.service';
import {
  AlertCategory,
  alertTypesToActivateToggleViaURL,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  AbstractFrontendTableComponent,
  ExtendedColumnDefs,
  FrontendTableComponent,
  FrontendTableResponse,
  TableCreator,
} from '../../../../shared/components/table';
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';

@Component({
  selector: 'd360-task-priority-grid',
  imports: [FrontendTableComponent],
  templateUrl: './task-priority-grid.component.html',
  styleUrl: './task-priority-grid.component.scss',
})
export class TaskPriorityGridComponent
  extends AbstractFrontendTableComponent
  implements OnInit
{
  private readonly alertService: AlertService = inject(AlertService);
  private readonly globalSelectionStateService: GlobalSelectionStateService =
    inject(GlobalSelectionStateService);

  public openFunction = input.required<OpenFunction>();
  public headline = input.required<string>();
  public gkamNumbers = input<string[]>(null);
  public customers = input<string[]>(null);
  public priorities = input<Priority[]>(null);

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
          (Array.isArray(this.priorities()) &&
            this.priorities().length === 0) ||
          this.priorities()?.some(
            (requestedPriority) => alert.priorityCount[requestedPriority] > 0
          )
      )
  );
  protected context: Record<string, any> = {
    getMenu: (row: any) => {
      const alert = row.data;
      const customMenu = [];

      if (alert.openFunction) {
        const route: string = this.alertService.getRouteForOpenFunction(
          alert.openFunction
        );

        const customerFilter = {
          customerNumber: [
            { id: alert.customerNumber, text: alert.customerName },
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
                    alertType:
                      alert.alertTypes?.[priority]?.map(
                        (selectableAlert: AlertType) =>
                          this.getSelectableOptionForAlert(selectableAlert)
                      ) ?? [],
                    materialNumber: alert.materialNumbers?.[priority] ?? [],
                  },
                  alert.openFunction ===
                    OpenFunction.Customer_Material_Portfolio
                    ? {
                        state: {
                          activateToggle: (
                            alert?.alertTypes[priority] || []
                          )?.some((type: AlertCategory) =>
                            alertTypesToActivateToggleViaURL.includes(type)
                          ),
                        },
                      }
                    : undefined
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
                        this.priorities()?.flatMap(
                          (prio) => alert.alertTypes?.[prio] || []
                        ) ?? []
                      ),
                    ].map((selectableAlert: AlertType) =>
                      this.getSelectableOptionForAlert(selectableAlert)
                    ),
                    materialNumber:
                      this.priorities()
                        ?.flatMap((prio) => alert.materialNumbers?.[prio] || [])
                        ?.filter(
                          (
                            selectableValue: SelectableValue,
                            index: number,
                            array: SelectableValue[]
                          ) =>
                            array.findIndex(
                              (arrayValue) =>
                                selectableValue.id === arrayValue.id
                            ) === index
                        ) ?? [],
                  },
                  alert.openFunction ===
                    OpenFunction.Customer_Material_Portfolio
                    ? {
                        state: {
                          activateToggle: [
                            ...new Set(
                              this.priorities().flatMap(
                                (prio) => alert.alertTypes[prio] || []
                              )
                            ),
                          ]?.some((type) =>
                            alertTypesToActivateToggleViaURL.includes(type)
                          ),
                        },
                      }
                    : undefined
                ),
            },
          ],
        });
      }

      return customMenu;
    },
  };

  protected override readonly getData$ =
    (): Observable<FrontendTableResponse> =>
      of(this.filteredData()).pipe(map((content) => ({ content })));

  public constructor() {
    super();

    effect(() => this.filteredData() && this.reload$().next(true));
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.alertService
      .getFetchErrorEvent()
      .pipe(
        tap((hasError: boolean) => hasError && this.reload$().next(true)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected override setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: `task-priority-grid${this.openFunction()}`,
          context: this.context,
          columnDefs,
          noRowsMessage: translate('overview.yourTasks.noTasks'),
          getRowId: (params) => params.data.customerNumber,
          autoSizeStrategy: false,
          sideBar: {},
          headerHeight: 0,
          cellSelection: false,
          suppressCellFocus: true,
        }),
        isLoading$: combineLatest([
          this.isLoading$,
          this.selectableOptionsService.loading$,
        ]).pipe(
          map((isLoading, loading) => !!isLoading || !!loading),
          takeUntilDestroyed(this.destroyRef)
        ),
        hasTabView: false,
        hasToolbar: false,
        callbacks: { onGridReady: () => this.reload$().next(true) },
      })
    );
  }

  protected override setColumnDefinitions(): void {
    this.setConfig([
      {
        field: 'customerNumber',
        width: 90,
        cellStyle: { padding: 0 },
      },
      {
        field: 'customerName',
        flex: 1,
        cellStyle: { padding: 0 },
      },
      {
        field: 'priorityCount',
        width: 145,
        cellRenderer: TaskPrioritiesComponent,
        cellStyle: { padding: 0 },
      },
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        width: 50,
        cellRenderer: ActionsMenuCellRendererComponent,
        cellStyle: { borderLeft: 0 },
      },
    ]);
  }

  private getSelectableOptionForAlert(alertType: AlertType): SelectableValue {
    const alertTypeOptions = this.selectableOptionsService.get('alertTypes');

    return alertTypeOptions.loadingError === null
      ? alertTypeOptions?.options?.find(
          (option) => option.id === alertType
        ) || { id: alertType, text: alertType }
      : { id: alertType, text: alertType };
  }
}
