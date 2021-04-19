import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  IStatusPanelParams,
  RowSelectedEvent,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { Drawing } from '@cdba/shared/models';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { COLUMN_DEFINITIONS, DEFAULT_COLUMN_DEFINITION } from './config';

@Component({
  selector: 'cdba-drawings-table',
  templateUrl: './drawings-table.component.html',
  styleUrls: ['./drawings-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingsTableComponent implements OnChanges {
  private gridApi: GridApi;

  @Input() rowData: Drawing[];
  @Input() selectedNodeId: string;
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly selectionChange: EventEmitter<{
    nodeId: string;
    drawing: Drawing;
  }> = new EventEmitter();

  public modules: any[] = [ClientSideRowModelModule];

  public defaultColDef: ColDef = DEFAULT_COLUMN_DEFINITION;

  public columnDefs: ColDef[] = COLUMN_DEFINITIONS;

  public frameworkComponents = {
    customLoadingOverlay: CustomLoadingOverlayComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
    actionsCellRenderer: ActionsCellRendererComponent,
  };

  public noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  public loadingOverlayComponent = 'customLoadingOverlay';
  public noRowsOverlayComponent = 'customNoRowsOverlay';

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading && changes.isLoading.currentValue) {
      this.gridApi.showLoadingOverlay();
    } else {
      this.gridApi.showNoRowsOverlay();
    }
  }

  /**
   * Limit selected rows to a maximum of two
   */
  public onRowSelected({ node, api }: RowSelectedEvent): void {
    const nodeId = node.id;
    const drawing = api.getSelectedRows()[0];

    this.selectionChange.emit({ nodeId, drawing });
  }

  public onFirstDataRendered(params: IStatusPanelParams): void {
    if (this.selectedNodeId) {
      this.gridApi
        .getRowNode(this.selectedNodeId)
        .setSelected(true, true, true);
    }

    params.columnApi.autoSizeAllColumns(false);
  }

  public onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    setTimeout(() => this.refreshHeaders(), 50);

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  private refreshHeaders(): void {
    this.columnDefs
      .filter((colDef) => colDef.colId !== 'checkbox')
      .map((colDef) => colDef.colId)
      .forEach((colId) => {
        const columnDef = this.gridApi.getColumnDef(colId);
        columnDef.headerName = translate(columnDef.headerName);
      });

    this.gridApi.refreshHeader();
  }
}
