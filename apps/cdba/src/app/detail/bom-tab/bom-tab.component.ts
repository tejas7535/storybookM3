import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColDef,
  ColumnApi,
  GridApi,
  IStatusPanelParams,
  RowNode,
} from '@ag-grid-community/core';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { translate } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';

import { DetailState } from '../../core/store/reducers/detail/detail.reducer';
import { BomItem } from '../../core/store/reducers/detail/models';
import { getBomItems } from '../../core/store/selectors/details/detail.selector';

@Component({
  selector: 'cdba-bom-tab',
  templateUrl: './bom-tab.component.html',
  styleUrls: ['./bom-tab.component.scss'],
})
export class BomTabComponent implements OnInit {
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  bomItems$: Observable<BomItem[]>;

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
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
    },
    {
      field: 'currency',
      headerName: translate('detail.bom.headers.currency'),
    },
    {
      field: 'materialNumber',
      headerName: translate('detail.bom.headers.materialNumber'),
    },
    {
      field: 'plant',
      headerName: translate('detail.bom.headers.plant'),
    },
    {
      field: 'lotsize',
      headerName: translate('detail.bom.headers.lotsize'),
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
      headerName: translate('detail.bom.headers.costCenter'),
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

  public constructor(private readonly store: Store<DetailState>) {}

  ngOnInit(): void {
    this.bomItems$ = this.store.pipe(select(getBomItems));
  }

  onGridReady(params: IStatusPanelParams): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.addEventListener(
      'rowGroupOpened',
      this.onRowGroupOpened.bind(this)
    );
  }

  getDataPath(data: BomItem): string[] {
    return data.predecessorsInTree;
  }

  onRowGroupOpened(): void {
    this.gridColumnApi.autoSizeColumn('ag-Grid-AutoColumn');
    this.gridApi.redrawRows();
  }

  onRowClicked(evt: any): any {
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
