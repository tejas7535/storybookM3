import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslocoService } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
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
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { columnDefinitions } from '../../column-definition';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { LayoutId } from '../column-layout-management-modal/column-layout-management-modal.model';
import { HomeTableToolbarComponent } from '../home-table-toolbar/home-table-toolbar.component';
import { TextTooltipComponent } from '../text-tooltip/text-tooltip.component';

@Component({
  selector: 'd360-material-customer-table',
  standalone: true,
  imports: [AgGridModule, HomeTableToolbarComponent],
  providers: [MaterialCustomerTableService],
  templateUrl: './material-customer-table.component.html',
  styleUrl: './material-customer-table.component.scss',
})
export class MaterialCustomerTableComponent implements OnInit {
  selectionFilter = input.required<GlobalSelectionState>();

  protected globalSelectionStateService = inject(GlobalSelectionStateService);
  protected materialCustomerTableService = inject(MaterialCustomerTableService);
  private readonly materialCustomerService = inject(MaterialCustomerService);
  protected readonly agGridLocalizationService = inject(
    AgGridLocalizationService
  );
  protected readonly translocoService = inject(TranslocoService);

  public gridApi!: GridApi;
  public columnApi!: ColumnApi;

  public resetLayout: (layoutId: LayoutId) => any;
  public loadLayout: (layoutId: LayoutId) => any;
  public saveLayout: (layoutId: LayoutId) => any;
  public initialColumns: any;

  public filter: Record<string, any>;
  public criteriaData: CriteriaFields;

  protected readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(
      () => {
        this.setDataSource(this.selectionFilter());
      },
      {
        allowSignalWrites: true,
      }
    );
  }

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

  ngOnInit() {
    this.materialCustomerService
      .getCriteriaData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
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

    this.gridApi?.setColumnDefs(colDef);
  };

  onGridReady = (event: GridReadyEvent) => {
    this.gridApi = event.api;
    this.columnApi = event.columnApi;

    const { resetLayout, loadLayout, saveLayout } =
      this.materialCustomerTableService.useMaterialCustomerColumnLayouts(
        this.columnApi
      );

    this.resetLayout = resetLayout.bind(this.materialCustomerTableService);
    this.loadLayout = loadLayout.bind(this.materialCustomerTableService);
    this.saveLayout = saveLayout.bind(this.materialCustomerTableService);

    this.defaultColDef();
    this.setDataSource(this.selectionFilter());

    const columnFilterListener = () => {
      this.gridApi.setFilterModel(formatFilterModelForAgGrid(this.filter));
    };

    this.gridApi.addEventListener(
      'columnEverythingChanged',
      columnFilterListener
    );

    this.defaultColDef();
  };

  setDataSource(globalSelection?: GlobalSelectionState) {
    if (this.globalSelectionStateService.isEmpty()) {
      this.gridApi?.setServerSideDatasource(
        this.materialCustomerTableService.createEmptyDatasource()
      );
    } else {
      this.gridApi?.setServerSideDatasource(
        this.materialCustomerTableService.createMaterialCustomerDatasource(
          GlobalSelectionUtils.globalSelectionCriteriaToFilter(globalSelection),
          []
        )
      );
    }
  }

  onFilterChange(event: FilterChangedEvent) {
    this.filter = formatFilterModelForBackend(event.api.getFilterModel());
    this.onColumnFilterChange.emit(this.filter);
  }

  getRowCount() {
    return this.gridApi ? this.gridApi.getDisplayedRowCount() : null;
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
