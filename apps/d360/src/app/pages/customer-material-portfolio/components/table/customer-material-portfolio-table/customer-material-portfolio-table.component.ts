import {
  Component,
  computed,
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

import { filter, map, Observable, of, take, tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { GetRowIdParams, ICellRendererParams } from 'ag-grid-enterprise';

import { getBackendRoles } from '@schaeffler/azure-auth';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import {
  parsePortfolioStatusOrNull,
  PortfolioStatus,
} from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import {
  CMPEntry,
  CMPResponse,
} from '../../../../../feature/customer-material-portfolio/model';
/* eslint-disable max-lines */
import { GlobalSelectionUtils } from '../../../../../feature/global-selection/global-selection.utils';
import { CustomerEntry } from '../../../../../feature/global-selection/model';
import { CriteriaFields } from '../../../../../feature/material-customer/model';
import {
  getColFilter,
  getDefaultColDef,
} from '../../../../../shared/ag-grid/grid-defaults';
import { ActionsMenuCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import {
  GlobalSelectionState,
  GlobalSelectionStateService,
} from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  RequestType,
  TableCreator,
} from '../../../../../shared/components/table';
import {
  checkRoles,
  customerMaterialPortfolioChangeAllowedRoles,
} from '../../../../../shared/utils/auth/roles';
import { CMPAction, CMPModal, statusActions } from '../status-actions';
import { CMPColId, columnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-customer-material-portfolio-table',
  imports: [TranslocoDirective, MatSlideToggle, BackendTableComponent],
  templateUrl: './customer-material-portfolio-table.component.html',
})
export class CustomerMaterialPortfolioTableComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  private readonly store = inject(Store);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly cmpService = inject(CMPService);

  public selectedCustomer = input.required<CustomerEntry>();
  public globalSelection = input.required<GlobalSelectionState>();
  public refreshCounter: InputSignal<number> = input.required<number>();
  public openSingleDialog: InputSignal<
    (
      modal: CMPModal,
      data: CMPEntry | null,
      changeToStatus: PortfolioStatus
    ) => void
  > = input.required();
  protected toggleIsActive = input.required<boolean>();

  protected showChains = false;

  private readonly materialCache: Map<string, CMPEntry[]> = new Map();

  protected criteriaData: WritableSignal<CriteriaFields> =
    signal<CriteriaFields>(null);

  /** @inheritdoc */
  protected readonly getData$ = (
    params: RequestParams,
    requestType: RequestType
  ): Observable<BackendTableResponse> => {
    if (this.globalSelectionStateService.isEmpty()) {
      return of({ rows: [], rowCount: 0 });
    }

    let selectionFilters = {
      ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
        this.globalSelection()
      ),
      customerNumber: [this.selectedCustomer().customerNumber],
    };
    const requestParams = { ...params };

    if (requestType === RequestType.GroupClick) {
      const headMaterialNumber = params.groupKeys[0];
      if (this.materialCache.has(headMaterialNumber)) {
        const materials = this.materialCache.get(headMaterialNumber) ?? [];

        return of({ rows: materials, rowCount: materials.length });
      } else {
        selectionFilters = {
          customerNumber: [this.selectedCustomer().customerNumber],
          materialNumber: [headMaterialNumber],
        };
        requestParams.columnFilters = [];
      }
    }

    return this.cmpService.getCMPData(selectionFilters, requestParams).pipe(
      map((response: CMPResponse) => {
        const { childOfHeadMaterial, headMaterials } = response;
        for (const [key, value] of Object.entries(childOfHeadMaterial)) {
          this.materialCache.set(key, value);
        }

        return headMaterials;
      }),
      takeUntilDestroyed(this.destroyRef)
    );
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

  private readonly params = computed(() => ({
    selectedCustomer: this.selectedCustomer(),
    globalSelection: this.globalSelection(),
    criteriaData: this.criteriaData(),
  }));

  /**
   * Constructor for the CustomerMaterialPortfolioTableComponent.
   * It sets up effects to react to changes in selected customer, global selection, filter model, and refresh counter.
   * Also initializes AG-Grid options and fetches criteria data on component initialization.
   *
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  public constructor() {
    super();

    effect(() => this.params() && this.reload$().next(true));

    effect(() => (this.showChains = this.toggleIsActive()));

    effect(() => {
      if (this.refreshCounter() > 0) {
        this.materialCache.clear();

        this.gridApi?.refreshServerSide();

        [...this.materialCache.keys()].forEach((key: string) =>
          this.gridApi.refreshServerSide({ route: [key], purge: true })
        );
      }
    });
  }

  /** @inheritdoc */
  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'customer-material-portfolio',
          context: {
            isDisabled: () => !this.authorizedToChange(),
            getMenu: (params: ICellRendererParams<any, CMPEntry>) =>
              statusActions
                .filter((cmpAction: CMPAction) =>
                  cmpAction.isAllowed(
                    parsePortfolioStatusOrNull(
                      params.node.data.portfolioStatus
                    ),
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
          },
          columnDefs,
          getRowId: ({ data }: GetRowIdParams) =>
            `${data.customerNumber}-${data.materialNumber}`,
          serverSideAutoGroup: TableCreator.getServerSideAutoGroup({
            autoGroupColumnDef: {
              field: 'materialNumber',
              headerName: translate(`material_customer.column.materialNumber`),
              minWidth: 280,
              pinned: 'left',
              lockPinned: true,
            },
            isServerSideGroup: (data) => data.hasChildren,
            getServerSideGroupKey: (data) => data.materialNumber,
          }),
        }),
        isLoading$: this.selectableOptionsService.loading$,
        hasTabView: true,
        maxAllowedTabs: 5,
        callbacks: { onFirstDataRendered: () => this.handleDataFetchedEvent() },
      })
    );
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
      .pipe(
        take(1),
        tap((criteriaData: CriteriaFields) => {
          this.criteriaData.set(criteriaData);
          this.setColumnDefinitions();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /** @inheritdoc */
  protected setColumnDefinitions(): void {
    const mapColumnData = (def: any) => ({
      colId: def.colId,
      field: def.colId,
      lockVisible: def.alwaysVisible,
      hide: !def.visible,
      sortable: true,
      headerName: translate(
        `material_customer.column.${def.colId as CMPColId}`
      ),
      cellRenderer: def.cellRenderer,
      cellRendererParams: def.cellRendererParams,
      filter: getColFilter(def.colId, def.filter, this.criteriaData()),
      tooltipComponent: def.tooltipComponent,
      tooltipField: def.tooltipField,
      valueFormatter: def?.valueFormatter,
      visible: def.visible,
    });

    this.selectableOptionsService.loading$
      .pipe(
        filter((loading) => !loading),
        take(1),
        tap(() =>
          this.setConfig([
            ...columnDefinitions(
              this.agGridLocalizationService,
              this.selectableOptionsService
            ).map((def: any) => ({
              ...getDefaultColDef(
                this.translocoLocaleService.getLocale(),
                def.filter,
                def.filterParams
              ),
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
          ])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
   * Handle events related to data fetching, such as updating the row count and showing/hiding the no rows overlay
   *
   * @private
   * @memberof CustomerMaterialPortfolioTableComponent
   */
  private handleDataFetchedEvent(): void {
    this.dataFetchedEvent$
      .pipe(
        take(1),
        tap(() => this.showChains && this.gridApi?.expandAll()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
