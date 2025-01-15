import {
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-enterprise';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import {
  AlertRule,
  AlertRuleResponse,
} from '../../../../../feature/alert-rules/model';
import {
  clientSideTableDefaultProps,
  getDefaultColDef,
  sideBar,
} from '../../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { alertRuleColumnDefinitions } from '../../column-definition';
import { AlertRulesColumnSettingsService } from '../../services/alert-rules-column-settings.service';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';

type AlertRuleColumnDefinitions = ReturnType<
  typeof alertRuleColumnDefinitions
>[number];

@Component({
  selector: 'd360-alert-rule-table',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './alert-rule-table.component.html',
  styleUrl: './alert-rule-table.component.scss',
})
export class AlertRuleTableComponent implements OnInit {
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);
  private readonly alertRulesService: AlertRulesService =
    inject(AlertRulesService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly snackBarService: SnackbarService = inject(SnackbarService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public readonly columnSettingsService: AlertRulesColumnSettingsService<
    string,
    AlertRuleColumnDefinitions
  > = inject(
    AlertRulesColumnSettingsService<string, AlertRuleColumnDefinitions>
  );

  public getApi: OutputEmitterRef<GridApi> = output();

  @ViewChild('alertRulesGrid') grid!: AgGridAngular;

  public gridApi: GridApi;

  protected gridOptions: GridOptions = {
    ...clientSideTableDefaultProps,
    sideBar,
    getRowId: (params: GetRowIdParams<AlertRule>): string => params.data.id,
  };

  /**
   * The edit modal is used in the parent and in the table, so we pass it from the parent
   * in this component.
   *
   * @memberof AlertRuleTableComponent
   */
  public editAlertRuleCallback: InputSignal<(data?: AlertRule) => void> =
    input.required<(data?: AlertRule) => void>();

  /**
   * The table context to pass the getMenu method used in ActionsMenuCellRendererComponent.
   *
   * @protected
   * @type {Record<string, any>}
   * @memberof AlertRuleTableComponent
   */
  protected context: Record<string, any> = {
    getMenu: (params: ICellRendererParams<any, AlertRule>) => [
      {
        text: translate('button.edit'),
        onClick: () => this.editAlertRuleCallback()(params.data),
      },
      {
        text: translate(
          params.data.deactivated
            ? 'alert_rules.action_menu.activate'
            : 'alert_rules.action_menu.deactivate'
        ),
        onClick: () => this.toggleAlertRuleStatus(params),
      },
      {
        text: translate('alert_rules.action_menu.delete'),
        onClick: () => this.delete(params),
      },
    ],
  };

  public loadData$: InputSignal<() => Observable<AlertRuleResponse>> = input(
    () => of({ count: 0, content: [] })
  );

  public ngOnInit(): void {
    this.setAlertRuleData();
  }

  /**
   * Toggle the Alert Rule Status.
   *
   * @param {ICellRendererParams<any, AlertRule>} params
   * @return
   * @memberof AlertRuleTableComponent
   */
  public toggleAlertRuleStatus(params: ICellRendererParams<any, AlertRule>) {
    if (!params.data) {
      return;
    }

    const workflow = {
      ...params.data,
      deactivated: !params.data.deactivated,
      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      startDate: ValidationHelper.localeService.localizeDate(
        params.data.startDate
      ),
      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      endDate: ValidationHelper.localeService.localizeDate(params.data.endDate),
    };

    this.alertRulesService
      .saveMultiAlertRules([workflow])
      .pipe(
        take(1),
        tap((postResult) => {
          const userMessage = singlePostResultToUserMessage(
            postResult,
            errorsFromSAPtoMessage,
            translate(
              params.data.deactivated
                ? 'alert_rules.action_menu_activated'
                : 'alert_rules.action_menu_deactivated',
              {}
            )
          );

          // TODO: add variant like before... enqueueSnackbar(userMessage.message, { variant: userMessage.variant });
          this.snackBarService.openSnackBar(userMessage.message);

          if (userMessage.variant !== 'error') {
            params.setValue(workflow);
            params.api.getRowNode(params.node.id).updateData(workflow);
            params.api.refreshCells();
          }
        })
      )
      .subscribe();
  }

  /**
   * Open the dialog modal for a single entry.
   *
   * @param {ICellRendererParams<any, AlertRule>} params
   * @memberof AlertRuleTableComponent
   */
  public delete(params: ICellRendererParams<any, AlertRule>) {
    this.dialog.open(AlertRuleDeleteSingleModalComponent, {
      data: { gridApi: params.api, alertRule: params.data },
      disableClose: true,
      width: '600px',
    });
  }

  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.getApi.emit(event.api);

    this.createColumnDefs();
  }

  private setAlertRuleData() {
    this.loadData$()()
      .pipe(
        tap((data) => this.gridApi?.setGridOption('rowData', data?.content)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
              ...getDefaultColDef(col.filter, col.filterParams),
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
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Apply the stored filter
   *
   * @protected
   * @param {FirstDataRenderedEvent} event
   * @memberof AlertRuleTableComponent
   */
  protected onFirstDataRendered(event: FirstDataRenderedEvent): void {
    this.columnSettingsService.applyStoredFilters(event.api);
  }
}
