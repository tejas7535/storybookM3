import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
} from '../../../../shared/ag-grid/grid-defaults';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { DataHintComponent } from '../../../../shared/components/data-hint/data-hint.component';
import { StyledGridSectionComponent } from '../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { InternalMaterialReplacementTableRowMenuButtonComponent } from '../internal-material-replacement-table-row-menu-button/internal-material-replacement-table-row-menu-button.component';
import { getIMRColumnDefinitions } from './column-definitions';

@Component({
  selector: 'app-no-data-overlay',
  template: ` <app-data-hint [text]="text"></app-data-hint>`,
  imports: [DataHintComponent],
  standalone: true,
})
class NoDataOverlayComponent {
  protected text = translate('hint.noData', {});
}

@Component({
  selector: 'app-internal-material-replacement-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    TableToolbarComponent,
    StyledGridSectionComponent,
    NoDataOverlayComponent,
  ],
  templateUrl: './internal-material-replacement-table.component.html',
  styleUrl: './internal-material-replacement-table.component.scss',
})
export class InternalMaterialReplacementTableComponent {
  @Input({ required: true }) selectedRegion: string;

  gridApi: GridApi;

  constructor(
    protected readonly imrService: IMRService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {}

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.setServerSideDatasource(this.selectedRegion);
    if (this.gridApi) {
      this.imrService.getDataFetchedEvent().subscribe((value) => {
        this.rowCount = value.rowCount;
        if (this.rowCount === 0) {
          this.gridApi.showNoRowsOverlay();
        } else {
          this.gridApi.hideOverlay();
        }
      });
    }
  }

  setServerSideDatasource(selectedRegion: string) {
    this.rowCount = 0;
    this.gridApi.setServerSideDatasource(
      this.imrService.createInternalMaterialReplacementDatasource(
        selectedRegion
      )
    );
  }

  protected rowCount = 0;

  // TODO implement
  //   useAutosizeColumns(grid);

  protected columnDefs = [
    ...(getIMRColumnDefinitions(this.agGridLocalizationService).map((col) => ({
      ...getDefaultColDef(col.filter, col.filterParams),
      colId: col.property,
      field: col.property,
      headerName: translate(col.colId, {}),
      sortable: true,
      filter: col.filter,
      valueFormatter: col.valueFormatter,
      cellRenderer: col.cellRenderer,
      tooltipComponent: col.tooltipComponent,
      tooltipField: col.tooltipField,
    })) || []),
    {
      field: 'menu',
      headerName: '',
      cellRenderer: InternalMaterialReplacementTableRowMenuButtonComponent,
      lockVisible: true,
      pinned: 'right',
      lockPinned: true,
      suppressMenu: true,
      maxWidth: 64,
      suppressSizeToFit: true,
    },
  ] as ColDef[];

  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
  };

  protected getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    JSON.stringify(params.data);

  protected readonly NoDataOverlayComponent = NoDataOverlayComponent;

  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.columnApi.autoSizeAllColumns();
  }
}
