import { Component, Input, OnInit, output, ViewChild } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  ColumnApi,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import { GlobalSelectionUtils } from '../../../../../feature/global-selection/global-selection.utils';
import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { CriteriaFields } from '../../../../../feature/material-customer/model';
import {
  getColFilter,
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../../shared/ag-grid/grid-defaults';
import {
  formatFilterModelForAgGrid,
  formatFilterModelForBackend,
} from '../../../../../shared/ag-grid/grid-filter-model';
import { GlobalSelectionState } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import {
  createEmptyDatasource,
  DATA_FETCHED_EVENT,
} from '../../../../../shared/utils/datasources';
import { columnDefinitions } from '../../column-definition';
import { MaterialCustomerColumnLayoutsService } from '../../services/material-customer-column-layout.service';
import {
  HomeTableToolbarComponent,
  LayoutId,
} from '../home-table-toolbar/home-table-toolbar.component';
import { TextTooltipComponent } from '../text-tooltip/text-tooltip.component';

@Component({
  selector: 'app-material-customer-table',
  standalone: true,
  imports: [AgGridModule, HomeTableToolbarComponent],
  templateUrl: './material-customer-table.component.html',
  styleUrl: './material-customer-table.component.scss',
})
export class MaterialCustomerTableComponent implements OnInit {
  @ViewChild('materialCustomerGrid') grid!: AgGridAngular;

  public api!: GridApi;
  public columnApi!: ColumnApi;

  public resetLayout: (layoutId: LayoutId) => any;
  public loadLayout: (layoutId: LayoutId) => any;
  public saveLayout: (layoutId: LayoutId) => any;
  public currentLayoutId: any;
  public initialColumns: any;

  public filter: Record<string, any>;
  public criteriaData: CriteriaFields;

  public rowCount: number;

  public gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
  };

  public defaultCol: any = {
    menuTabs: ['filterMenuTab', 'generalMenuTab'],
    suppressHeaderMenuButton: true,
  };

  public sidebar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivotMode: true,
        },
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
  };

  /**
   * The output event emitter to emit column filter changes to the parent.
   *
   * @memberof MaterialCustomerTableComponent
   */
  public onColumnFilterChange = output<any>();

  private _selectionFilter: GlobalSelectionState;
  @Input() set selectionFilter(value: GlobalSelectionState) {
    this._selectionFilter = value;
    this.setDataSource();
  }

  get selectionFilter() {
    return this._selectionFilter;
  }

  constructor(
    private readonly materialCustomerLayoutService: MaterialCustomerColumnLayoutsService,
    private readonly materialCustomerService: MaterialCustomerService,
    private readonly translocoService: TranslocoService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {}

  ngOnInit() {
    this.materialCustomerService.getCriteriaData().subscribe((data) => {
      this.criteriaData = data;
      this.defaultColDef();
    });
  }

  defaultColDef = () => {
    if (!this.initialColumns) {
      this.initialColumns = columnDefinitions(this.agGridLocalizationService);
    }

    const colDef = columnDefinitions(this.agGridLocalizationService).map(
      ({
        filter,
        colId,
        visible,
        alwaysVisible,
        valueGetter,
        valueFormatter,
        cellRenderer,
        filterParams,
      }: any) => ({
        ...getDefaultColDef(filter, filterParams),
        key: colId,
        colId,
        field: colId,
        lockVisible: alwaysVisible,
        hide: !visible,
        headerName: this.translocoService.translate(
          `material_customer.column.${colId}`,
          {}
        ),
        sortable: this.criteriaData?.sortableFields.includes(colId),
        tooltipField: colId,
        tooltipComponent: TextTooltipComponent,
        filter: getColFilter(colId, filter, this.criteriaData),
        cellRenderer,
        valueGetter,
        valueFormatter,
        lockPinned: true,
      })
    );

    this.api.setColumnDefs(colDef);
    this.setDataSource();
  };

  onGridReady = (event: GridReadyEvent) => {
    this.api = event.api;
    this.columnApi = event.columnApi;

    const {
      resetLayout,
      loadLayout,
      saveLayout,
      currentLayoutId,
      initialColumns,
    } = this.materialCustomerLayoutService.useMaterialCustomerColumnLayouts(
      this.api,
      this.columnApi
    );

    this.resetLayout = resetLayout.bind(this.materialCustomerLayoutService);
    this.loadLayout = loadLayout.bind(this.materialCustomerLayoutService);
    this.saveLayout = saveLayout.bind(this.materialCustomerLayoutService);
    this.currentLayoutId = currentLayoutId;
    this.initialColumns = initialColumns;

    this.defaultColDef();

    const fetchListener = () => {
      const storeState = this.api.getServerSideGroupLevelState()[0];
      this.rowCount = storeState.rowCount;
    };

    const columnFilterListener = () => {
      this.api.setFilterModel(formatFilterModelForAgGrid(this.filter));
    };

    this.api.addEventListener(DATA_FETCHED_EVENT, fetchListener);
    this.api.addEventListener('columnEverythingChanged', columnFilterListener);

    this.defaultColDef();
  };

  setDataSource() {
    if (this.selectionFilter) {
      this.grid?.api.setServerSideDatasource(
        this.materialCustomerService.createMaterialCustomerDatasource(
          GlobalSelectionUtils.globalSelectionCriteriaToFilter(
            this.selectionFilter
          ),
          [],
          this.materialCustomerService
        )
      );
    } else {
      this.grid?.api.setServerSideDatasource(createEmptyDatasource());
    }
  }

  onFilterChange(event: FilterChangedEvent) {
    this.filter = formatFilterModelForBackend(event.api.getFilterModel());
    this.onColumnFilterChange.emit(this.filter);
  }

  getRowCount() {
    return this.grid ? this.grid.api.getDisplayedRowCount() : null;
  }

  getVisibilityBackground = (params: {
    data: { portfolioStatus: string } | undefined;
  }) => {
    if (params.data !== undefined && params.data.portfolioStatus === 'IA') {
      return { backgroundColor: '#F6F7F9', color: '#646464' };
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  };

  getIdForRow(row: any) {
    if (row.id === undefined && row.data.id === undefined) {
      throw new Error('Could not find id in row.');
    } else if (row.id != null) {
      return row.id as string;
    }

    return row.data.id as string;
  }

  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.columnApi.autoSizeAllColumns();
  }
}
