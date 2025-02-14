import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellStyle,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
} from 'ag-grid-enterprise';

import { AlertService } from '../../../../feature/alerts/alert.service';
import {
  Alert,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { serverSideTableDefaultProps } from '../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { NoDataOverlayComponent } from '../../../../shared/components/ag-grid/no-data/no-data.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { TaskPrioritiesComponent } from '../task-priorities/task-priorities.component';
import { DateFilterComponent } from './../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';

@Component({
  selector: 'd360-task-priority-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './task-priority-grid.component.html',
  styleUrl: './task-priority-grid.component.scss',
})
export class TaskPriorityGridComponent implements OnInit {
  protected noOverlayMessage = {
    message: translate('overview.yourTasks.noTasks'),
  };
  private gridApi: GridApi = null;
  public openFunction = input.required<OpenFunction>();
  public customers = input<string[]>();
  public priorities = input<Priority[]>([]);
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    cellSelection: false,
    suppressCellFocus: true,
  };
  private readonly alertService: AlertService = inject(AlertService);
  protected cellStyles: CellStyle = {
    padding: 0,
  };

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
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
  protected datasource: IServerSideDatasource = null;
  protected readonly NoDataOverlayComponent = NoDataOverlayComponent;
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  protected rowStyles = { fontSize: '12px' };
  public constructor() {
    effect(() => {
      this.reloadGrid();
    });
  }
  public ngOnInit(): void {
    this.alertService.getRefreshEvent().pipe(
      tap(() => {
        this.reloadGrid();
      }),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private reloadGrid() {
    this.datasource = this.alertService.createGroupedAlertDatasource(
      'ACTIVE',
      this.openFunction(),
      this.customers(),
      this.priorities()
    );
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
                      (type: string) => ({
                        id: type,
                        text: type,
                      })
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
                    ].map((type: string) => ({
                      id: type,
                      text: type,
                    })),
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
  }
  protected getRowId: GetRowIdFunc = (params: GetRowIdParams<Alert>) =>
    params.data.customerNumber;

  protected onFirstDataRendered() {}

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
