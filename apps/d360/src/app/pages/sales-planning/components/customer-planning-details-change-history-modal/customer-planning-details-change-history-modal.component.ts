import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { GetRowIdParams } from 'ag-grid-enterprise';

import { ChangeHistoryService } from '../../../../feature/sales-planning/change-history.service';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  RequestType,
  TableCreator,
} from '../../../../shared/components/table';
import { ChangeHistoryData } from './../../../../feature/sales-planning/model';
import { changeHistoryColumnDefinitions } from './column-definition';

@Component({
  selector: 'd360-customer-planning-details-change-history-modal',
  imports: [
    TranslocoDirective,
    MatButton,
    MatDialogModule,
    CdkDrag,
    CdkDragHandle,
    BackendTableComponent,
  ],
  templateUrl:
    './customer-planning-details-change-history-modal.component.html',
  styleUrl: './customer-planning-details-change-history-modal.component.scss',
})
export class CustomerPlanningDetailsChangeHistoryModalComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  protected readonly changeHistoryService: ChangeHistoryService =
    inject(ChangeHistoryService);

  private readonly dialogRef: MatDialogRef<CustomerPlanningDetailsChangeHistoryModalComponent> =
    inject(MatDialogRef);

  public readonly data: {
    customerNumber: string;
    customerName: string;
  } = inject(MAT_DIALOG_DATA);

  protected readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse> = (params: RequestParams) =>
    this.changeHistoryService.getChangeHistory(params, {
      customerNumber: [this.data.customerNumber],
    });

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'customer-planning-details-change-history',
          columnDefs,
          getRowId: ({ data }: GetRowIdParams<ChangeHistoryData>) =>
            [
              data.customerNumber,
              data.planningYear,
              data.planningMonth,
              data.planningMaterial,
              data.changeTimestamp,
            ].join('-'),
        }),
        hasTabView: true,
        maxAllowedTabs: 5,
      })
    );
  }

  protected setColumnDefinitions(): void {
    this.setConfig(
      changeHistoryColumnDefinitions(this.agGridLocalizationService).map(
        (col) => ({
          ...getDefaultColDef(
            this.translocoLocaleService.getLocale(),
            col.filter,
            col.filterParams
          ),
          title: col.colId,
          key: col.colId,
          colId: col.colId,
          field: col.colId,
          headerName: translate(
            `sales_planning.changeHistory.columnHeadlines.${col.title}`
          ),
          filter: col?.filter ?? null,
          cellRenderer: col.cellRenderer,
          hide: !col.visible,
          sortable: col.sortable,
          sort: col.sort,
          lockVisible: col.alwaysVisible,
          valueFormatter: col.valueFormatter,
          minWidth: col?.minWidth,
          flex: col?.flex,
          visible: col?.visible,
        })
      )
    );
  }

  protected onCancel(): void {
    this.dialogRef.close(null);
  }
}
