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
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClassParams,
  CellClickedEvent,
  ColDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  NewColumnsLoadedEvent,
} from 'ag-grid-community';

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
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { disableColor } from '../../../../shared/styles/colors';
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
  private readonly globalSelectionStateService = inject(
    GlobalSelectionStateService
  );
  private readonly destoryRef = inject(DestroyRef);
  protected readonly agGridLocalizationService = inject(
    AgGridLocalizationService
  );

  public visible = input.required<boolean>();
  public selectedCustomerNumber = input.required<string>();
  public demandValidationFilters = input.required<DemandValidationFilter>();
  public confirmContinueAndLooseUnsavedChanges = input<() => boolean>();
  public selectedMaterialListEntryChange = output<MaterialListEntry>();

  protected rowCount = signal<number>(0);
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    onFirstDataRendered: (event: FirstDataRenderedEvent) =>
      event.columnApi.autoSizeAllColumns(true),
    onNewColumnsLoaded: (event: NewColumnsLoadedEvent) =>
      event.columnApi.autoSizeAllColumns(true),
  };

  protected selectedMaterialListEntry = signal<MaterialListEntry>(null);
  protected gridApi: GridApi;

  constructor() {
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

    if (this.gridApi) {
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
          takeUntilDestroyed(this.destoryRef)
        )
        .subscribe();
    }
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

  protected columnDefs = getColumnDefinitions(
    this.agGridLocalizationService
  ).map((def) => ({
    ...getDefaultColDef(),
    ...def,
    field: def.colId,
    headerName: translate(`material_customer.column.${def.colId}`, {}),
    headerTooltip: translate(`material_customer.column.${def.colId}`, {}),
    suppressMenu: true,
    cellStyle: (cellParams: CellClassParams) => {
      if (cellParams.data.materialClassification === 'OP') {
        return { backgroundColor: `${disableColor}` };
      }

      return {};
    },
  }));

  private setServerSideDatasource(
    customerNumber: string,
    demandValidationFilters: DemandValidationFilter
  ) {
    this.rowCount.set(0);
    this.gridApi.setServerSideDatasource(
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
