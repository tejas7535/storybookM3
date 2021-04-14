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
  ColumnApi,
  GridApi,
  IStatusPanelParams,
  RowClickedEvent,
  RowGroupingModule,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import {
  formatMaterialNumber,
  formatNumber,
} from '@cdba/shared/components/table';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';

import { BomItem } from '../../../core/store/reducers/detail/models';

@Component({
  selector: 'cdba-bom-table',
  templateUrl: './bom-table.component.html',
  styleUrls: ['./bom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomTableComponent implements OnChanges {
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  @Input() rowData: BomItem[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly rowSelected: EventEmitter<BomItem> = new EventEmitter();

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    cellClass: 'line-height-30',
  };

  // select first row initially for coloring
  currentSelectedRow = {
    node: {
      id: '0',
    },
  };
  nonLevel2Children: any[] = [];

  autoGroupColumnDef = {
    headerName: 'Material Designation',
    resizable: true,
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
    },
  };

  groupDefaultExpanded = 1;

  columnDefs: ColDef[] = [
    {
      field: 'totalPricePerPc',
      headerName: translate('detail.bom.headers.totalPricePerPc'),
      valueFormatter: (params) => formatNumber(params, '1.5-5'),
    },
    {
      field: 'currency',
      headerName: translate('detail.bom.headers.currency'),
    },
    {
      field: 'materialNumber',
      headerName: translate('detail.bom.headers.materialNumber'),
      valueFormatter: formatMaterialNumber,
    },
    {
      field: 'plant',
      headerName: translate('detail.bom.headers.plant'),
    },
    {
      field: 'lotsize',
      headerName: translate('detail.bom.headers.lotsize'),
      valueFormatter: formatNumber,
    },
    {
      field: 'setupTime',
      headerName: translate('detail.bom.headers.setupTime'),
    },
    {
      field: 'cycleTime',
      headerName: translate('detail.bom.headers.cycleTime'),
    },
    {
      field: 'toolingFactor',
      headerName: translate('detail.bom.headers.toolingFactor'),
    },
    {
      field: 'quantityPerParent',
      headerName: translate('detail.bom.headers.quantityPerParent'),
    },
    {
      field: 'unitOfMeasure',
      headerName: translate('detail.bom.headers.unitOfMeasure'),
    },
    {
      field: 'costCenter',
      headerName: translate('detail.bom.headers.workCenter'),
    },
  ];

  rowSelection = 'single';
  suppressCellSelection = true;

  modules = [ClientSideRowModelModule, RowGroupingModule];

  rowClassRules = {
    'padding-left-40': (params: any) => {
      return params.data.level === 2;
    },
    'padding-left-80': (params: any) => {
      return params.data.level === 3;
    },
    'padding-left-120': (params: any) => {
      return params.data.level === 4;
    },
    'padding-left-160': (params: any) => {
      return params.data.level === 5;
    },
    'padding-left-200': (params: any) => {
      return params.data.level === 6;
    },
    'padding-left-240': (params: any) => {
      return params.data.level === 7;
    },
    'padding-left-280': (params: any) => {
      return params.data.level === 8;
    },
    'padding-left-320': (params: any) => {
      return params.data.level === 9;
    },
  };

  frameworkComponents = {
    customLoadingOverlay: CustomLoadingOverlayComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
  };
  loadingOverlayComponent = 'customLoadingOverlay';

  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading?.currentValue) {
      /**
       * timeout is necessary, so that the table can meanwhile check, if there is data to display or not
       * the table only shows overlays, if there is no data to display
       */
      setTimeout(() => this.gridApi.showLoadingOverlay(), 10);
    } else {
      this.gridApi.showNoRowsOverlay();
    }
  }

  onGridReady(params: IStatusPanelParams): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.addEventListener(
      'rowGroupOpened',
      this.onRowGroupOpened.bind(this)
    );

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  onFirstDataRendered(params: IStatusPanelParams): void {
    params.columnApi.autoSizeAllColumns(false);
  }

  getDataPath(data: BomItem): string[] {
    return data.predecessorsInTree;
  }

  onRowGroupOpened(): void {
    this.gridColumnApi.autoSizeColumn('ag-Grid-AutoColumn');
    this.gridApi.redrawRows();
  }

  onRowClicked(evt: RowClickedEvent): void {
    this.rowSelected.emit(evt.data);

    this.nonLevel2Children = [];
    this.currentSelectedRow = evt;
    this.updateNonLevel2Children(evt.node);
    this.gridApi.redrawRows();
  }

  updateNonLevel2Children(node: RowNode): void {
    // if node is not root and not level 1 child
    if (
      node.id !== this.currentSelectedRow.node.id &&
      node.parent.id !== this.currentSelectedRow.node.id
    ) {
      this.nonLevel2Children.push(node.id);
    }

    node.childrenAfterGroup.forEach((child: RowNode) => {
      this.updateNonLevel2Children(child);
    });
  }

  getRowClass(params: any): string {
    // selected row / root
    if (params.node.id === this.currentSelectedRow.node.id) {
      return 'top-level-row';
    }

    // second level row
    if (params.node.parent.id === this.currentSelectedRow.node.id) {
      return `second-level-row-${params.node.childIndex}`;
    }

    // third or more level row
    if (this.nonLevel2Children.indexOf(params.node.id) !== -1) {
      let tmpNode = params.node;

      while (tmpNode.parent.id !== this.currentSelectedRow.node.id) {
        tmpNode = tmpNode.parent;
      }

      return `third-or-more-row-${tmpNode.childIndex}`;
    }

    return '';
  }
}
