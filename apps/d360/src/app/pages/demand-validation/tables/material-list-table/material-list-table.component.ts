import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { CellClickedEvent, GetRowIdParams, IRowNode } from 'ag-grid-enterprise';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import {
  DemandValidationFilter,
  demandValidationFilterToStringFilter,
} from '../../../../feature/demand-validation/demand-validation-filters';
import { MaterialListEntry } from '../../../../feature/demand-validation/model';
import { GlobalSelectionUtils } from '../../../../feature/global-selection/global-selection.utils';
import { getDefaultColDef } from '../../../../shared/ag-grid/grid-defaults';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  AbstractBackendTableComponent,
  BackendTableComponent,
  BackendTableResponse,
  ExtendedColumnDefs,
  RequestParams,
  RequestType,
  TableCreator,
} from '../../../../shared/components/table';
import { getColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-material-list-table',
  imports: [BackendTableComponent],
  templateUrl: './material-list-table.component.html',
  styleUrl: './material-list-table.component.scss',
})
export class MaterialListTableComponent
  extends AbstractBackendTableComponent
  implements OnInit
{
  private readonly demandValidationService = inject(DemandValidationService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );

  public visible = input.required<boolean>();
  public selectedCustomerNumber = input.required<string>();
  public demandValidationFilters = input.required<DemandValidationFilter>();
  public confirmContinueAndLooseUnsavedChanges = input<() => boolean>();
  public selectedMaterialListEntryChange = output<MaterialListEntry>();
  public demandValidationFilterChange = output<DemandValidationFilter>();

  protected rowCount = signal<number>(0);

  protected selectedMaterialListEntry = signal<MaterialListEntry>(null);

  protected params = computed(() => ({
    selectedCustomerNumber: this.selectedCustomerNumber(),
    demandValidationFilters: this.demandValidationFilters(),
  }));

  public constructor() {
    super();

    effect(() => this.params() && this.reload$().next(true));
  }

  protected readonly getData$: (
    params: RequestParams,
    requestType: RequestType
  ) => Observable<BackendTableResponse> = (params: RequestParams) =>
    this.demandValidationService.getMaterialCustomerData(
      {
        ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
          this.globalSelectionStateService.getState()
        ),
        ...demandValidationFilterToStringFilter(this.demandValidationFilters()),
        customerNumber: [this.selectedCustomerNumber()],
      },
      params
    );

  protected setConfig(columnDefs: ExtendedColumnDefs[]): void {
    this.config.set(
      TableCreator.get({
        table: TableCreator.getTable({
          tableId: 'material-list-table',
          columnDefs,
          getRowId: ({ data }: GetRowIdParams) => data.materialNumber,
          sideBar: {},
          defaultColDef: { suppressMovable: true },
          autoSizeStrategy: { type: 'fitGridWidth' },
        }),
        hasTabView: false,
        renderFloatingFilter: false,
        callbacks: {
          onFirstDataRendered: this.onFirstDataRendered.bind(this),
          onCellClicked: this.onCellClicked.bind(this),
        },
        customOnResetFilters: this.onResetFilters.bind(this),
        customGetFilterCount: this.getFilterCount.bind(this),
      })
    );
  }

  protected setColumnDefinitions(): void {
    this.setConfig(
      getColumnDefinitions(this.agGridLocalizationService).map((def) => ({
        ...getDefaultColDef(this.translocoLocaleService.getLocale()),
        ...def,
        field: def.colId,
        headerName: translate(`material_customer.column.${def.colId}`, {}),
        headerTooltip: translate(`material_customer.column.${def.colId}`, {}),
        suppressHeaderMenuButton: true,
      }))
    );
  }

  public onFirstDataRendered(): void {
    this.dataFetchedEvent$
      .pipe(
        tap(() => {
          const nodes = this.gridApi.getRenderedNodes();

          if (nodes?.length) {
            this.gridApi.deselectAll();
            this.selectGridRow(nodes[0]);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onResetFilters(): void {
    this.demandValidationFilterChange.emit({
      productionLine: [],
      productLine: [],
      customerMaterialNumber: [],
      stochasticType: [],
      forecastMaintained: null,
    });
  }

  protected getFilterCount(): number {
    if (!this.selectedCustomerNumber() || !this.demandValidationFilters()) {
      return 0;
    }

    // eslint-disable-next-line unicorn/no-array-reduce
    return Object.values(this.demandValidationFilters()).reduce(
      (prev: number, current: SelectableValue[] | SelectableValue) => {
        if (!current) {
          return prev;
        }

        return prev + (Array.isArray(current) ? current.length : 1);
      },
      0
    );
  }

  protected onCellClicked($event: CellClickedEvent): void {
    if (!$event.data) {
      return;
    }
    if (
      $event.data.customerMaterialNumber &&
      $event.data.customerMaterialNumberCount > 1 &&
      $event.column.getColId() === 'customerMaterialNumber'
    ) {
      // When more than one customerMaterialNumbers exists and the user clicks the customerMaterialNumber column
      // we prevent the selection of the row to rather open the modal to show all customer material numbers
      return;
    }
    if (
      $event.data.materialNumber ===
        this.selectedMaterialListEntry()?.materialNumber ||
      !this.confirmContinueAndLooseUnsavedChanges()()
    ) {
      return;
    }

    this.selectGridRow($event.node);
  }

  private selectGridRow(selectedNode: IRowNode) {
    selectedNode?.setSelected(true, true);
    this.selectedMaterialListEntry.set(selectedNode.data);
    this.selectedMaterialListEntryChange.emit(selectedNode.data);
  }
}
