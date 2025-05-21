import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { catchError, Observable, take, tap } from 'rxjs';

import { PushPipe } from '@ngrx/component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridOptions,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';

import { ViewToggleModule } from '@schaeffler/view-toggle';

import { serverSideTableDefaultProps } from '../../ag-grid/grid-defaults';
import { formatFilterModelForBackend } from '../../ag-grid/grid-filter-model';
import { TableToolbarComponent } from '../ag-grid/table-toolbar/table-toolbar.component';
import { AbstractTableComponent } from './abstract-table.component';
import { RequestType, TableType, TableTypes } from './enums';
import { BackendTableResponse, RequestParams } from './interfaces';
import { TableService } from './services';

/**
 * The Table component to wrap ag grid and to handle backend tables.
 *
 * @export
 * @class BackendTableComponent
 * @extends {AbstractTableComponent}
 */
@Component({
  selector: 'd360-backend-table',
  imports: [
    AgGridAngular,
    MatButtonModule,
    MatCheckboxModule,
    PushPipe,
    TableToolbarComponent,
    ViewToggleModule,
  ],
  providers: [TableService],
  templateUrl: './abstract-table.component.html',
  styleUrl: './abstract-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackendTableComponent extends AbstractTableComponent {
  /** @inheritdoc */
  protected override type: TableTypes = TableType.Backend;

  /** @inheritdoc */
  protected tableDefaultProps: GridOptions = serverSideTableDefaultProps;

  /** @inheritdoc */
  public getData: InputSignal<
    (
      params: RequestParams,
      requestType: RequestType
    ) => Observable<BackendTableResponse>
  > = input.required();

  /** @inheritdoc */
  protected override loadData(): void {
    throw new Error('[TableWrapper] Not available for backend tables');
  }

  /** @inheritdoc */
  protected init(): void {
    this.gridApi?.setGridOption('serverSideDatasource', this.getDataSource());
  }

  /** @inheritdoc */
  protected override getDataSource(): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        this.hideOverlays();
        const { startRow, endRow, sortModel, filterModel, groupKeys } =
          params.request;
        const columnFilters = formatFilterModelForBackend(filterModel);

        // Hint: unfortunately AG-Grid is not supporting to pass a colId to the autoGroupColumnDef for sorting it is
        // always: 'ag-Grid-AutoColumn'.
        // So, if a 'ag-Grid-AutoColumn' is in the sortModel...
        const autoColumn: number = sortModel.findIndex(
          (model) => model.colId === 'ag-Grid-AutoColumn'
        );

        // ...we replace the colId with the autoGroupColumnDef.field.
        if (autoColumn >= 0) {
          sortModel[autoColumn] = {
            ...sortModel[autoColumn],
            colId: params.api.getGridOption('autoGroupColumnDef').field,
          };
        }

        // subsequent data loading by AgGrid won't change the rowCount as we're only
        // interested in the first data request for the rowCount display
        if (startRow === 0) {
          this.dataFetchedEvent$().next({ rowCount: 0 });
        }

        const requestParams: RequestParams = {
          startRow,
          endRow,
          sortModel,
          columnFilters: [columnFilters].filter(
            (filter) => filter && Object.keys(filter).length > 0
          ),
          groupKeys,
        };

        this.gridApi?.setGridOption(
          'loading',
          this.showLoaderForInfiniteScroll
        );

        this.getData()(
          requestParams,
          groupKeys?.length > 0 ? RequestType.GroupClick : RequestType.Fetch
        )
          .pipe(
            take(1),
            tap((response: BackendTableResponse) => {
              this.hideOverlays();

              if (response.rowCount === 0 || response.rows.length === 0) {
                this.showMessage(this.config()?.table?.noRowsMessage ?? '');
              }
              this.dataFetchedEvent$().next({
                rowCount: response.rowCount,
              });
              params.success({
                rowData: response.rows,
                rowCount: response.rowCount,
              });
            }),
            catchError((error) => this.handleFetchError$(error, params)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      },
    };
  }
}
