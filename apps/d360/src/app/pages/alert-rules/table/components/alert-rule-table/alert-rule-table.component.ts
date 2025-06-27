import { Component, inject, input, InputSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import { AlertRule } from '../../../../../feature/alert-rules/model';
import { getDefaultColDef } from '../../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { alertRuleColumnDefinitions } from '../../column-definition';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';
import {
  AbstractFrontendTableComponent,
  ExtendedColumnDefs,
  FrontendTableComponent,
  FrontendTableResponse,
  TableCreator,
} from './../../../../../shared/components/table';

@Component({
  selector: 'd360-alert-rule-table',
  imports: [AgGridModule, FrontendTableComponent],
  templateUrl: './alert-rule-table.component.html',
  styleUrl: './alert-rule-table.component.scss',
})
export class AlertRuleTableComponent extends AbstractFrontendTableComponent {
  private readonly alertRulesService: AlertRulesService =
    inject(AlertRulesService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  /** @inheritdoc */
  protected override readonly getData$ =
    (): Observable<FrontendTableResponse> =>
      this.alertRulesService.getAlertRuleData();

  /**
   * The edit modal is used in the parent and in the table, so we pass it from the parent
   * in this component.
   *
   * @memberof AlertRuleTableComponent
   */
  public editAlertRuleCallback: InputSignal<(data?: AlertRule) => void> =
    input.required<(data?: AlertRule) => void>();

  /** @inheritdoc */
  protected override setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'alert-rule-table',
          context: {
            getMenu: (params: ICellRendererParams<any, AlertRule>) => [
              {
                text: translate('button.edit'),
                onClick: () => this.editAlertRuleCallback()(params.node.data),
              },
              {
                text: translate(
                  params.node.data.deactivated
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
          },
          columnDefs,
        }),
        isLoading$: this.selectableOptionsService.loading$,
        hasTabView: true,
        maxAllowedTabs: 5,
      })
    );
  }

  /**
   * Toggle the Alert Rule Status.
   *
   * @param {ICellRendererParams<any, AlertRule>} params
   * @return
   * @memberof AlertRuleTableComponent
   */
  protected toggleAlertRuleStatus(params: ICellRendererParams<any, AlertRule>) {
    if (!params.node.data) {
      return;
    }

    const workflow = {
      ...params.node.data,
      deactivated: !params.node.data.deactivated,
      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      startDate: ValidationHelper.localeService?.localizeDate(
        params.node.data.startDate
      ),
      // saveMultiAlertRules expects a local date, so we need to convert here
      // This is because of the clipboard functionality of the multi modal. (Copy/Paste from Excel)
      endDate: ValidationHelper.localeService?.localizeDate(
        params.node.data.endDate
      ),
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
              params.node.data.deactivated
                ? 'alert_rules.action_menu_activated'
                : 'alert_rules.action_menu_deactivated'
            )
          );

          this.snackbarService.show(
            userMessage.message,
            undefined,
            undefined,
            userMessage.variant as any
          );

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
   * @protected
   * @param {ICellRendererParams<any, AlertRule>} params
   * @memberof AlertRuleTableComponent
   */
  protected delete(params: ICellRendererParams<any, AlertRule>) {
    this.dialog.open(AlertRuleDeleteSingleModalComponent, {
      data: { gridApi: params.api, alertRule: params.node.data },
      disableClose: true,
      width: '600px',
    });
  }

  /** @inheritdoc */
  protected override setColumnDefinitions(): void {
    this.setConfig([
      ...(alertRuleColumnDefinitions(this.agGridLocalizationService).map(
        (column) => ({
          ...getDefaultColDef(
            this.translocoLocaleService.getLocale(),
            column.filter,
            column.filterParams
          ),
          key: column.colId,
          colId: column.colId,
          field: column.colId,
          headerName: translate(column.title),
          filter: column?.filter ?? null,
          cellRenderer: column.cellRenderer,
          hide: !column.visible,
          sortable: column.sortable,
          sort: column.sort,
          lockVisible: column.alwaysVisible,
          lockPinned: true,
          valueFormatter: column.valueFormatter,
          maxWidth: column?.maxWidth,
          tooltipComponent: column?.tooltipComponent,
          tooltipComponentParams: column?.tooltipComponentParams,
          tooltipField: column?.tooltipField,
          visible: true,
        })
      ) || []),
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
        sortable: false,
      },
    ]);
  }
}
