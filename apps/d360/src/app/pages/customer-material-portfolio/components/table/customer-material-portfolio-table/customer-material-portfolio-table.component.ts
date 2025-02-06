import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';

import { translate } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
} from 'ag-grid-enterprise';

import { getBackendRoles } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import {
  parsePortfolioStatusOrNull,
  PortfolioStatus,
} from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import { CMPEntry } from '../../../../../feature/customer-material-portfolio/model';
import { CustomerEntry } from '../../../../../feature/global-selection/model';
import { CriteriaFields } from '../../../../../feature/material-customer/model';
import {
  getColFilter,
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { TableToolbarComponent } from '../../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionState } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import {
  checkRoles,
  customerMaterialPortfolioChangeAllowedRoles,
} from '../../../../../shared/utils/auth/roles';
import { CMPAction, CMPModal, statusActions } from '../status-actions';
import { CMPColId, columnDefinitions } from './column-definitions';

export interface FilterModel {
  [key: string]: any;
}

@Component({
  selector: 'd360-customer-material-portfolio-table',
  standalone: true,
  imports: [
    CommonModule,
    TableToolbarComponent,
    SharedTranslocoModule,
    MatSlideToggle,
    AgGridModule,
  ],
  templateUrl: './customer-material-portfolio-table.component.html',
})
export class CustomerMaterialPortfolioTableComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public selectedCustomer = input.required<CustomerEntry>();
  public globalSelection = input.required<GlobalSelectionState>();
  public filterModel = input.required<FilterModel>();

  public refreshCounter: InputSignal<number> = input.required<number>();
  public openSingleDialog: InputSignal<
    (
      modal: CMPModal,
      data: CMPEntry | null,
      changeToStatus: PortfolioStatus
    ) => void
  > = input.required();

  protected showChains = false;

  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
  };
  protected childMaterialsCache: Map<string, CMPEntry[]> = new Map();
  protected rowCount = signal<number>(0);

  protected criteriaData: WritableSignal<CriteriaFields> =
    signal<CriteriaFields>(null);

  protected gridApi: GridApi | null = null;

  protected getRowIdFn: GetRowIdFunc = (params: GetRowIdParams) =>
    `${params.data.customerNumber}-${params.data.materialNumber}`;

  protected autoGroupColumnDef: ColDef | undefined = {
    field: 'materialNumber',
    headerName: translate(`material_customer.column.materialNumber`),
    minWidth: 280,
    pinned: 'left',
    lockPinned: true,
  };

  private readonly backendRoles = toSignal(this.store.select(getBackendRoles));

  protected authorizedToChange = computed(() =>
    this.backendRoles()
      ? checkRoles(
          this.backendRoles(),
          customerMaterialPortfolioChangeAllowedRoles
        )
      : false
  );

  protected context: Record<string, any> = {
    isDisabled: () => !this.authorizedToChange(),
    getMenu: (params: ICellRendererParams<any, CMPEntry>) =>
      statusActions
        .filter((cmpAction: CMPAction) =>
          cmpAction.isAllowed(
            parsePortfolioStatusOrNull(params.node.data.portfolioStatus),
            !!params.node.data.successorSchaefflerMaterial &&
              params.node.data.successorSchaefflerMaterial
          )
        )
        .map((cmpAction: CMPAction) => ({
          text: translate(
            `customer.material_portfolio.modal.action.${cmpAction.name}`
          ),
          onClick: () =>
            this.openSingleDialog()(
              cmpAction.modal,
              params.node.data,
              cmpAction.changeToStatus
            ),
        })),
  };

  protected getServerSideGroup: IsServerSideGroup | undefined = (data) =>
    data.hasChildren;

  protected getServerSideGroupOpenByDefault:
    | ((params: IsServerSideGroupOpenByDefaultParams) => boolean)
    | undefined = () => false;

  protected getServerSideGroupKey: GetServerSideGroupKey | undefined = (data) =>
    data.materialNumber;

  /**
   * Constructor for the CustomerMaterialPortfolioTableComponent.
   * It sets up effects to react to changes in selected customer, global selection, filter model, and refresh counter.
   * Also initializes AG-Grid options and fetches criteria data on component initialization.
   *
   * @param {CMPService} cmpService
   * @param {AgGridLocalizationService} agGridLocalizationService
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  public constructor(
    private readonly cmpService: CMPService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    effect(
      () => {
        if (this.selectedCustomer() || this.globalSelection()) {
          this.setServerSideDatasource();
        }
      },
      {
        allowSignalWrites: true,
      }
    );

    effect(() => {
      if (this.criteriaData()) {
        this.initializeColumnDefs();
      }
    });

    effect(() => {
      if (this.refreshCounter() > 0) {
        const groupIds = [...this.childMaterialsCache.keys()];
        this.childMaterialsCache.clear();

        this.gridApi?.refreshServerSide();

        groupIds.forEach((key: string) =>
          this.gridApi.refreshServerSide({ route: [key], purge: true })
        );
      }
    });
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    this.fetchCriteriaData();
  }

  /**
   * Fetch criteria data from the backend using CMPService and update the component state
   *
   * @private
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  private fetchCriteriaData(): void {
    this.cmpService
      .getCMPCriteriaData()
      .subscribe((criteriaData) => this.criteriaData.set(criteriaData));
  }

  /**
   * Initialize column definitions for AG-Grid based on fetched criteria data
   *
   * @private
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  private initializeColumnDefs(): void {
    const mapColumnData = (def: any) => ({
      field: def.colId,
      lockVisible: def.alwaysVisible,
      hide: !def.visible,
      sortable: true,
      headerName: translate(
        `material_customer.column.${def.colId as CMPColId}`,
        {}
      ),
      cellRenderer: def.cellRenderer,
      cellRendererParams: def.cellRendererParams,
      filter: getColFilter(def.colId, def.filter, this.criteriaData()),
      tooltipComponent: def.tooltipComponent,
      tooltipField: def.tooltipField,
      valueFormatter: def?.valueFormatter,
    });

    this.gridApi?.setGridOption('columnDefs', [
      ...columnDefinitions(this.agGridLocalizationService).map((def: any) => ({
        ...getDefaultColDef(def.filter, def.filterParams),
        ...mapColumnData(def),
      })),
      {
        cellClass: ['fixed-action-column'],
        field: 'menu',
        headerName: '',
        cellRenderer: ActionsMenuCellRendererComponent,
        lockVisible: true,
        pinned: 'right',
        lockPinned: true,
        suppressHeaderMenuButton: true,
        maxWidth: 64,
        suppressSizeToFit: true,
      },
    ] as ColDef[]);
  }

  /**
   * Handle changes to the 'expand all' toggle in the table toolbar
   *
   * @protected
   * @param {MatSlideToggleChange} [$event]
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  protected handleExpandAllChange($event?: MatSlideToggleChange): void {
    this.showChains = $event.checked;
    if (this.showChains) {
      this.gridApi?.expandAll();
    } else {
      this.gridApi?.collapseAll();
    }
  }
  /**
   * Handle AG-Grid's gridReady event, set up data source and handle events
   *
   * @protected
   * @param {GridReadyEvent} event
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  protected onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.setServerSideDatasource();
    this.handleDataFetchedEvents();
  }

  /**
   * Set up a server-side datasource for AG-Grid based on selected customer and global selection state
   *
   * @private
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  private setServerSideDatasource(): void {
    this.rowCount.set(0);
    this.gridApi?.setGridOption(
      'serverSideDatasource',
      this.cmpService.createCustomerMaterialPortfolioDatasource(
        this.selectedCustomer(),
        this.globalSelection(),
        this.childMaterialsCache,
        this.gridApi
      )
    );
  }

  /**
   * Handle events related to data fetching, such as updating the row count and showing/hiding the no rows overlay
   *
   * @private
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  private handleDataFetchedEvents(): void {
    this.cmpService
      .getDataFetchedEvent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.rowCount.set(value.headMaterials.rowCount);
        if (this.rowCount() === 0) {
          this.gridApi?.showNoRowsOverlay();
        } else {
          this.gridApi?.hideOverlay();

          // if the rows are expanded, we need to expand the reloaded data too.
          if (this.showChains) {
            this.gridApi?.expandAll();
          }
        }
      });
  }

  /**
   * Handle AG-Grid's firstDataRendered event, typically used for auto-resizing columns
   *
   * @protected
   * @param {FirstDataRenderedEvent} $event
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  protected onFirstDataRendered($event: FirstDataRenderedEvent): void {
    $event.api.autoSizeAllColumns();
  }
}
