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
import { GridOptions, IServerSideDatasource } from 'ag-grid-enterprise';

import { ViewToggleModule } from '@schaeffler/view-toggle';

import { clientSideTableDefaultProps } from '../../ag-grid/grid-defaults';
import { TableToolbarComponent } from '../ag-grid/table-toolbar/table-toolbar.component';
import { AbstractTableComponent } from './abstract-table.component';
import { TableType, TableTypes } from './enums';
import { FrontendTableResponse } from './interfaces';
import { TableService } from './services';

/**
 * The Table component to wrap ag grid and to handle backend tables.
 *
 * @export
 * @class FrontendTableComponent
 * @extends {AbstractTableComponent}
 */
@Component({
  selector: 'd360-frontend-table',
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
export class FrontendTableComponent extends AbstractTableComponent {
  /** @inheritdoc */
  protected override type: TableTypes = TableType.Frontend;

  /** @inheritdoc */
  protected tableDefaultProps: GridOptions = clientSideTableDefaultProps;

  /** @inheritdoc */
  public getData: InputSignal<() => Observable<any>> = input.required();

  /** @inheritdoc */
  protected getDataSource(): IServerSideDatasource {
    throw new Error('[TableWrapper] Not available for frontend tables');
  }

  /** @inheritdoc */
  protected init(): void {
    this.loadData();
  }

  /** @inheritdoc */
  protected override loadData(): void {
    if (!this.gridApi) {
      return;
    }

    this.showLoader();

    this.getData()()
      .pipe(
        take(1),
        tap((response: FrontendTableResponse) => {
          this.hideOverlays();

          const content = response?.content || [];

          // apply the data to the grid
          this.gridApi.setGridOption('rowData', content);

          this.dataFetchedEvent$().next({
            rowCount: this.gridApi.getDisplayedRowCount() || 0,
          });

          if (content?.length === 0) {
            this.showMessage(this.config()?.table?.noRowsMessage ?? '');
          }
        }),
        catchError((error) => this.handleFetchError$(error, null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
