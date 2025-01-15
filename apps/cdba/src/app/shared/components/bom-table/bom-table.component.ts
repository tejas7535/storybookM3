import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { translate } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import {
  CellRange,
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnState,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  IRowNode,
  RowClickedEvent,
  RowSelectionOptions,
} from 'ag-grid-enterprise';

import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';
import { CostShareService } from '@cdba/shared/services';

import { BomItem } from '../../models';
import { NoRowsParams } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  BOM_ROW_CLASS_RULES,
  BOM_TABLE_COMPONENTS,
  BOM_TABLE_EXCEL_STYLES,
  BOM_TABLE_STATUS_BAR_CONFIG,
  ColumnDefinitionService,
  SidebarService,
} from './config';

@Component({
  selector: 'cdba-bom-table',
  templateUrl: './bom-table.component.html',
  styleUrls: ['./bom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomTableComponent implements OnChanges {
  @Input() index: number;
  @Input() rowData: BomItem[];
  @Input() isLoading: boolean;
  @Input() errorMessage: string;

  @Output() readonly rowSelected: EventEmitter<BomItem> = new EventEmitter();
  @Output() readonly gridReady: EventEmitter<GridReadyEvent> =
    new EventEmitter();

  // select first row initially for coloring
  currentSelectedRow = {
    node: {
      id: '0',
    },
  };
  rowSelection = {
    mode: 'multiRow',
    checkboxes: false,
    headerCheckbox: false,
  } as RowSelectionOptions;
  nonLevel2Children: any[] = [];
  cellRanges: CellRange[];

  columnDefs = this.columnDefinitionService.getColDef();
  defaultColDef = this.columnDefinitionService.DEFAULT_COL_DEF;
  autoGroupColumnDef = this.columnDefinitionService.AUTO_GROUP_COLUMN_DEF;
  groupDefaultExpanded = 1;

  statusBar = BOM_TABLE_STATUS_BAR_CONFIG;
  components = BOM_TABLE_COMPONENTS;
  sideBar = this.sidebarService.SIDE_BAR_CONFIG;
  excelStyles = BOM_TABLE_EXCEL_STYLES;
  rowClassRules = BOM_ROW_CLASS_RULES;
  loadingOverlayComponent = 'customLoadingOverlay';
  noRowsOverlayComponent = 'customNoRowsOverlay';
  noRowsOverlayComponentParams: NoRowsParams = {
    getMessage: () => this.errorMessage || translate('shared.bom.noBom.text'),
  };

  private gridApi: GridApi;

  private readonly customColumnsOrderKey = 'customColumnsOrder';

  constructor(
    protected columnDefinitionService: ColumnDefinitionService,
    protected sidebarService: SidebarService,
    protected scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe,
    private readonly costShareService: CostShareService,
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.gridApi) {
      return;
    }

    if (changes.isLoading?.currentValue) {
      /**
       * timeout is necessary, so that the table can meanwhile check, if there is data to display or not
       * the table only shows overlays, if there is no data to display
       */
      setTimeout(() => this.gridApi.setGridOption('loading', true), 10);
    } else {
      this.gridApi.showNoRowsOverlay();
    }

    if (changes.rowData?.currentValue !== changes.rowData?.previousValue) {
      this.resetTable();
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    // !!(DSCDA-3228)
    const customColumnsState = this.loadCustomColumnsOrder(
      this.customColumnsOrderKey
    );

    if (customColumnsState) {
      this.gridApi.applyColumnState({
        state: customColumnsState,
        applyOrder: true,
      });
    } else {
      this.organizeColumns();
    }
    // (DSCDA-3228)!!

    params.api.addEventListener(
      'rowGroupOpened',
      this.onRowGroupOpened.bind(this)
    );

    this.gridReady.emit(params);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent): void {
    params.api.autoSizeAllColumns(true);
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
    this.gridApi.autoSizeColumns(['ag-Grid-AutoColumn']);
    this.gridApi.redrawRows();
  }

  onRowClicked(evt: RowClickedEvent): void {
    this.rowSelected.emit(evt.data);
    this.nonLevel2Children = [];
    this.currentSelectedRow = evt;
    this.updateNonLevel2Children(evt.node);
    this.gridApi.redrawRows();
  }

  onColumnMoved(evt: ColumnMovedEvent): void {
    this.saveCustomColumnsState(evt.api.getColumnState());
  }

  onColumnPinned(evt: ColumnPinnedEvent): void {
    this.saveCustomColumnsState(evt.api.getColumnState());
  }

  updateNonLevel2Children(node: IRowNode): void {
    // if node is not root and not level 1 child
    if (
      node.id !== this.currentSelectedRow.node.id &&
      node.parent.id !== this.currentSelectedRow.node.id
    ) {
      this.nonLevel2Children.push(node.id);
    }

    node.childrenAfterGroup.forEach((child: IRowNode) => {
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
      const totalCosts =
        params.node.parent.data.totalPricePerPc ||
        params.node.parent.data.costing.costAreaTotalValue;
      const costs =
        params.data.totalPricePerPc || params.data.costing.costAreaTotalValue;
      const costShare = costs / totalCosts;

      const costCategory =
        this.costShareService.getCostShareCategory(costShare);

      return `row-${costCategory}-cost-share`;
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

  private organizeColumns(): void {
    this.gridApi?.moveColumns(['procurement.plant'], 4);
  }

  private saveCustomColumnsState(columnState: ColumnState[]): void {
    const columnStateJSON = JSON.stringify(columnState);
    this.localStorage.setItem(this.customColumnsOrderKey, columnStateJSON);
  }

  private loadCustomColumnsOrder(key: string): any {
    return JSON.parse(this.localStorage.getItem(key));
  }
}
