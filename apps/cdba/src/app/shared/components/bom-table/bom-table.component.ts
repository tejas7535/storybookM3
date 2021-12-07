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
  ExcelExportModule,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowGroupingModule,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import {
  ScrambleMaterialDesignationPipe,
  ScrambleMaterialNumberPipe,
} from '@cdba/shared/pipes';
import { translate } from '@ngneat/transloco';

import { BomItem } from '../../models';
import { ColumnUtilsService, formatMaterialNumberFromString } from '../table';
import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import {
  CustomNoRowsOverlayComponent,
  NoRowsParams,
} from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';

@Component({
  selector: 'cdba-bom-table',
  templateUrl: './bom-table.component.html',
  styleUrls: ['./bom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomTableComponent implements OnChanges {
  public constructor(
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe,
    protected scrambleMaterialNumberPipe: ScrambleMaterialNumberPipe,
    private readonly columnUtilsService: ColumnUtilsService
  ) {}

  @Input() index: number;
  @Input() rowData: BomItem[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly rowSelected: EventEmitter<BomItem> = new EventEmitter();
  @Output() readonly gridReady: EventEmitter<GridApi> = new EventEmitter();

  defaultCellClass = 'line-height-30';

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    cellClass: this.defaultCellClass,
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
    cellClassRules: {
      'indent-0': (params: any) => params.data.level === 1,
      'indent-1': (params: any) => params.data.level === 2,
      'indent-2': (params: any) => params.data.level === 3,
      'indent-3': (params: any) => params.data.level === 4,
      'indent-4': (params: any) => params.data.level === 5,
      'indent-5': (params: any) => params.data.level === 6,
      'indent-6': (params: any) => params.data.level === 7,
      'indent-7': (params: any) => params.data.level === 8,
      'indent-8': (params: any) => params.data.level === 9,
      'indent-9': (params: any) => params.data.level === 10,
      'indent-10': (params: any) => params.data.level === 11,
      'indent-11': (params: any) => params.data.level === 12,
      'indent-12': (params: any) => params.data.level === 13,
      'indent-13': (params: any) => params.data.level === 14,
      'indent-14': (params: any) => params.data.level === 15,
    },
  };

  groupDefaultExpanded = 1;

  columnDefs: ColDef[] = [
    {
      field: 'level',
      headerName: translate('shared.bom.headers.level'),
      hide: true,
    },
    {
      field: 'totalPricePerPc',
      headerName: translate('shared.bom.headers.totalPricePerPc'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'currency',
      headerName: translate('shared.bom.headers.currency'),
    },
    {
      field: 'materialNumber',
      headerName: translate('shared.bom.headers.materialNumber'),
      valueGetter: (params) =>
        formatMaterialNumberFromString(params.data.materialNumber),
      valueFormatter: (params) =>
        this.scrambleMaterialNumberPipe.transform(params.value),
      cellClass: ['stringType', this.defaultCellClass],
    },
    {
      field: 'plant',
      headerName: translate('shared.bom.headers.plant'),
    },
    {
      field: 'lotsize',
      headerName: translate('shared.bom.headers.lotsize'),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'setupTime',
      headerName: translate('shared.bom.headers.setupTime'),
      cellClass: ['floatingNumberType', this.defaultCellClass],
    },
    {
      field: 'cycleTime',
      headerName: translate('shared.bom.headers.cycleTime'),
      cellClass: ['floatingNumberType', this.defaultCellClass],
    },
    {
      field: 'toolingFactor',
      headerName: translate('shared.bom.headers.toolingFactor'),
    },
    {
      field: 'quantityPerParent',
      headerName: translate('shared.bom.headers.quantityPerParent'),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'unitOfMeasure',
      headerName: translate('shared.bom.headers.unitOfMeasure'),
    },
    {
      field: 'costCenter',
      headerName: translate('shared.bom.headers.workCenter'),
    },
  ];

  modules = [ClientSideRowModelModule, RowGroupingModule, ExcelExportModule];

  excelStyles = [
    ...this.createIndentExcelStyles(),
    {
      id: 'header',
      alignment: { vertical: 'Center' },
      interior: {
        color: '#AEAAAA',
        pattern: 'Solid',
      },
      borders: {
        borderBottom: {
          color: '#000',
          lineStyle: 'Continuous',
          weight: 1,
        },
        borderTop: {
          color: '#000',
          lineStyle: 'Continuous',
          weight: 1,
        },
      },
    },
    {
      id: 'prependedMetadata',
      interior: {
        color: '#D9D9D9',
        pattern: 'Solid',
      },
    },
    {
      id: 'stringType',
      dataType: 'String',
      alignment: {
        horizontal: 'Right',
      },
    },
    {
      id: 'floatingNumberType',
      numberFormat: {
        // https://customformats.com/
        format: '0.0####;-0.0####;0',
      },
    },
  ];

  rowClassRules = {
    'padding-left-40': (params: any) => params.data.level === 2,
    'padding-left-80': (params: any) => params.data.level === 3,
    'padding-left-120': (params: any) => params.data.level === 4,
    'padding-left-160': (params: any) => params.data.level === 5,
    'padding-left-200': (params: any) => params.data.level === 6,
    'padding-left-240': (params: any) => params.data.level === 7,
    'padding-left-280': (params: any) => params.data.level === 8,
    'padding-left-320': (params: any) => params.data.level === 9,
    'padding-left-360': (params: any) => params.data.level === 10,
    'padding-left-400': (params: any) => params.data.level === 11,
    'padding-left-440': (params: any) => params.data.level === 12,
    'padding-left-480': (params: any) => params.data.level === 13,
    'padding-left-520': (params: any) => params.data.level === 14,
    'padding-left-560': (params: any) => params.data.level === 15,
  };

  frameworkComponents = {
    customLoadingOverlay: CustomLoadingOverlayComponent,
    customNoRowsOverlay: CustomNoRowsOverlayComponent,
  };
  loadingOverlayComponent = 'customLoadingOverlay';

  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage || translate('shared.bom.noBom.text'),
  };

  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

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

    if (changes.rowData?.currentValue !== changes.rowData?.previousValue) {
      this.resetTable();
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.addEventListener(
      'rowGroupOpened',
      this.onRowGroupOpened.bind(this)
    );

    if (!this.isLoading) {
      this.gridApi.showNoRowsOverlay();
    }

    this.gridReady.emit(this.gridApi);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    params.columnApi.autoSizeAllColumns(false);
  }

  getDataPath = (data: BomItem): string[] => {
    const path: string[] = [];

    data.predecessorsInTree.forEach((item) =>
      path.push(
        this.scrambleMaterialDesignationPipe.transform(item, this.index || 0)
      )
    );

    return path;
  };

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
    if (this.nonLevel2Children.includes(params.node.id)) {
      let tmpNode = params.node;

      while (tmpNode.parent.id !== this.currentSelectedRow.node.id) {
        tmpNode = tmpNode.parent;
      }

      return `third-or-more-row-${tmpNode.childIndex}`;
    }

    return '';
  }

  private resetTable(): void {
    // select first row initially for coloring
    this.currentSelectedRow = {
      node: {
        id: '0',
      },
    };
    this.nonLevel2Children = [];
    this.gridApi.redrawRows();
  }

  createIndentExcelStyles(): any[] {
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 15; i++) {
      result.push({
        id: `indent-${i}`,
        alignment: {
          indent: i + 1,
        },
        dataType: 'string',
      });
    }

    return result;
  }
}
