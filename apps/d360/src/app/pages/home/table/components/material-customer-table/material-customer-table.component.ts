import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { tap } from 'rxjs';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-enterprise';

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
import { DateFilterComponent } from '../../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';
import { TableToolbarComponent } from '../../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { columnDefinitions } from '../../column-definition';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { ColumnLayoutManagementModalComponent } from '../column-layout-management-modal/column-layout-management-modal.component';
import { LayoutId } from '../column-layout-management-modal/column-layout-management-modal.model';
import { ExportTableDialogComponent } from '../export-table-dialog/export-table-dialog.component';
import { TextTooltipComponent } from '../text-tooltip/text-tooltip.component';

@Component({
  selector: 'd360-material-customer-table',
  standalone: true,
  imports: [
    AgGridModule,
    TableToolbarComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    TranslocoDirective,
  ],
  providers: [MaterialCustomerTableService],
  templateUrl: './material-customer-table.component.html',
  styleUrl: './material-customer-table.component.scss',
})
export class MaterialCustomerTableComponent implements OnInit {
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly materialCustomerService = inject(MaterialCustomerService);
  private readonly dialog = inject(MatDialog);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly materialCustomerTableService = inject(
    MaterialCustomerTableService
  );
  private readonly translocoService = inject(TranslocoService);

  protected readonly agGridLocalizationService = inject(
    AgGridLocalizationService
  );

  public selectionFilter = input.required<GlobalSelectionState>();

  public totalRowCount = signal<number>(null);

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
  };

  public gridApi!: GridApi;

  public resetLayout: (layoutId: LayoutId) => any;
  public loadLayout: (layoutId: LayoutId) => any;
  public saveLayout: (layoutId: LayoutId) => any;
  public initialColumns: any;

  public filter: Record<string, any>;
  public criteriaData: CriteriaFields;

  protected readonly destroyRef = inject(DestroyRef);

  public constructor() {
    effect(() => this.setDataSource(this.selectionFilter()));
  }

  public gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
  };

  public defaultCol: ColDef = {
    menuTabs: ['filterMenuTab', 'generalMenuTab'],
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  };

  /**
   * The output event emitter to emit column filter changes to the parent.
   *
   * @memberof MaterialCustomerTableComponent
   */
  public onColumnFilterChange = output<any>();

  public ngOnInit() {
    this.materialCustomerService
      .getCriteriaData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.criteriaData = data;
        this.defaultColDef();
      });
    this.materialCustomerTableService
      .getDataFetchedEvent()
      .pipe(
        tap(({ totalRowCount }) => {
          this.totalRowCount.set(totalRowCount);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private readonly defaultColDef = () => {
    if (!this.initialColumns) {
      this.initialColumns = columnDefinitions(this.agGridLocalizationService);
    }

    const columnDefs = columnDefinitions(this.agGridLocalizationService).map(
      ({
        filter,
        colId,
        visible,
        alwaysVisible,
        valueGetter,
        valueFormatter,
        cellRenderer,
        filterParams,
        floatingFilterComponent,
      }: any) => ({
        ...getDefaultColDef(
          this.translocoLocaleService.getLocale(),
          filter,
          filterParams
        ),
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
        // filter,
        floatingFilterComponent,
        filter: getColFilter(colId, filter, this.criteriaData),
        cellRenderer,
        valueGetter,
        valueFormatter,
        lockPinned: true,
      })
    );

    this.gridApi?.setGridOption('columnDefs', columnDefs);
  };

  protected onGridReady = (event: GridReadyEvent) => {
    this.gridApi = event.api;

    const { resetLayout, loadLayout, saveLayout } =
      this.materialCustomerTableService.useMaterialCustomerColumnLayouts(
        this.gridApi
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

  private setDataSource(globalSelection?: GlobalSelectionState) {
    if (this.globalSelectionStateService.isEmpty()) {
      this.gridApi?.setFilterModel(null);
      this.gridApi?.setGridOption(
        'serverSideDatasource',
        this.materialCustomerTableService.createEmptyDatasource()
      );
    } else {
      this.gridApi?.setGridOption(
        'serverSideDatasource',
        this.materialCustomerTableService.createMaterialCustomerDatasource(
          GlobalSelectionUtils.globalSelectionCriteriaToFilter(globalSelection),
          []
        )
      );
    }
  }

  protected onFilterChange(event: FilterChangedEvent) {
    this.filter = formatFilterModelForBackend(event.api.getFilterModel());
    this.onColumnFilterChange.emit(this.filter);
  }

  protected getVisibilityBackground = (params: {
    data: { portfolioStatus: string } | undefined;
  }) => {
    if (params.data !== undefined && params.data.portfolioStatus === 'IA') {
      return { backgroundColor: '#F6F7F9', color: '#646464' };
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  };

  protected getIdForRow(row: any) {
    if (row.id === undefined && row.data.id === undefined) {
      throw new Error('Could not find id in row.');
    } else if (row.id != null) {
      return row.id as string;
    }

    return row.data.id as string;
  }

  protected onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.api.autoSizeAllColumns();
  }

  protected openColumnLayoutManagementModal(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.dialog.open(ColumnLayoutManagementModalComponent, {
      data: {
        resetLayout: this.resetLayout,
        saveLayout: this.saveLayout,
        loadLayout: this.loadLayout,
      },
      position: {
        top: `${rect.top + 30}px`,
        left: `${rect.left - 280}px`,
      },
    });
  }

  protected isExportDisabled(): boolean {
    return this.globalSelectionStateService.isEmpty();
  }

  protected openExport(): void {
    this.dialog.open(ExportTableDialogComponent, {
      data: {
        gridApi: this.gridApi,
        filter: GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.selectionFilter()
        ),
        backdrop: false,
      },
    });
  }
}
