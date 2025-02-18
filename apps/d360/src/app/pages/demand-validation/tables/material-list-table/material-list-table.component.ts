import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClickedEvent,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import {
  DemandValidationFilter,
  demandValidationFilterToStringFilter,
} from '../../../../feature/demand-validation/demand-validation-filters';
import { MaterialListEntry } from '../../../../feature/demand-validation/model';
import { GlobalSelectionUtils } from '../../../../feature/global-selection/global-selection.utils';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
} from '../../../../shared/ag-grid/grid-defaults';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { DateFilterComponent } from './../../../../shared/components/ag-grid/filters/mat-date-filter/date-filter.component';
import { getColumnDefinitions } from './column-definitions';

@Component({
  selector: 'd360-material-list-table',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    TableToolbarComponent,
    AgGridModule,
  ],
  templateUrl: './material-list-table.component.html',
  styleUrl: './material-list-table.component.scss',
})
export class MaterialListTableComponent {
  private readonly demandValidationService = inject(DemandValidationService);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly destroyRef = inject(DestroyRef);
  protected readonly agGridLocalizationService = inject(
    AgGridLocalizationService
  );

  public visible = input.required<boolean>();
  public selectedCustomerNumber = input.required<string>();
  public demandValidationFilters = input.required<DemandValidationFilter>();
  public confirmContinueAndLooseUnsavedChanges = input<() => boolean>();
  public selectedMaterialListEntryChange = output<MaterialListEntry>();
  public demandValidationFilterChange = output<DemandValidationFilter>();

  protected rowCount = signal<number>(0);
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    autoSizeStrategy: { type: 'fitGridWidth' },
  };

  protected selectedMaterialListEntry = signal<MaterialListEntry>(null);
  protected gridApi: GridApi;

  protected components: Record<string, any> = {
    agDateInput: DateFilterComponent,
  };

  public constructor() {
    effect(
      () => {
        this.refreshGridData(
          this.selectedCustomerNumber(),
          this.demandValidationFilters()
        );
      },
      { allowSignalWrites: true }
    );
  }

  protected onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;

    this.gridApi.sizeColumnsToFit();

    this.updateColumnDefs();

    this.setServerSideDatasource(
      this.selectedCustomerNumber(),
      this.demandValidationFilters()
    );

    this.demandValidationService
      .getDataFetchedEvent()
      .pipe(
        tap((value) => {
          this.rowCount.set(value.rowCount);
          if (this.rowCount() === 0) {
            this.gridApi.showNoRowsOverlay();
          } else {
            this.gridApi.hideOverlay();
          }

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

  protected onResetFilters(): () => void {
    return () =>
      this.demandValidationFilterChange.emit({
        productionLine: [],
        productLine: [],
        customerMaterialNumber: [],
        stochasticType: [],
      });
  }

  protected getFilterCount(): () => number {
    return () => {
      if (!this.selectedCustomerNumber() || !this.demandValidationFilters()) {
        return 0;
      }

      // eslint-disable-next-line unicorn/no-array-reduce
      return Object.values(this.demandValidationFilters()).reduce(
        (prev: number, current: SelectableValue[]) =>
          prev + (current || []).length,
        0
      );
    };
  }

  protected onCellClicked($event: CellClickedEvent) {
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
    selectedNode.setSelected(true, true);
    this.selectedMaterialListEntry.set(selectedNode.data);
    this.selectedMaterialListEntryChange.emit(selectedNode.data);
  }

  protected getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    params.data.materialNumber as string;

  protected defaultColDef: ColDef | undefined = {
    sortable: true,
    suppressMovable: true,
    lockVisible: true,
    menuTabs: [],
  };

  private updateColumnDefs(): void {
    this.gridApi?.setGridOption('columnDefs', [
      ...(getColumnDefinitions(this.agGridLocalizationService).map((def) => ({
        ...getDefaultColDef(this.translocoLocaleService.getLocale()),
        ...def,
        field: def.colId,
        headerName: translate(`material_customer.column.${def.colId}`, {}),
        headerTooltip: translate(`material_customer.column.${def.colId}`, {}),
        suppressHeaderMenuButton: true,
      })) as ColDef[]),
    ]);
  }

  private setServerSideDatasource(
    customerNumber: string,
    demandValidationFilters: DemandValidationFilter
  ) {
    this.rowCount.set(0);
    this.gridApi.setGridOption(
      'serverSideDatasource',
      this.demandValidationService.createDemandMaterialCustomerDatasource(
        this.getSelectionFilters(customerNumber, demandValidationFilters)
      )
    );
  }

  private getSelectionFilters(
    customerNumber: string,
    demandValidationFilters: DemandValidationFilter
  ) {
    return {
      ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
        this.globalSelectionStateService.getState()
      ),
      ...demandValidationFilterToStringFilter(demandValidationFilters),
      customerNumber: [customerNumber],
    };
  }

  private refreshGridData(
    customerNumber: string,
    demandValidationFilters: DemandValidationFilter
  ) {
    if (this.gridApi) {
      this.setServerSideDatasource(customerNumber, demandValidationFilters);
    }
  }
}
