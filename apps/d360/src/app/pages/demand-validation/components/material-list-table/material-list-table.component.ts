import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  CellClassParams,
  CellClickedEvent,
  ColDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { MaterialListEntry } from '../../../../feature/demand-validation/model';
import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { GlobalSelectionUtils } from '../../../../feature/global-selection/global-selection.utils';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import {
  getDefaultColDef,
  serverSideTableDefaultProps,
} from '../../../../shared/ag-grid/grid-defaults';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { StyledGridSectionComponent } from '../../../../shared/components/styled-grid-section/styled-grid-section.component';
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
    StyledGridSectionComponent,
    AgGridModule,
  ],
  templateUrl: './material-list-table.component.html',
  styleUrl: './material-list-table.component.scss',
})
export class MaterialListTableComponent {
  @Input({ required: true }) visible: boolean;
  @Input({ required: true }) selectedCustomer: CustomerEntry;
  // TODO handle selectedMaterialListEntry when new data is loading or filtered. Always select the first entry
  // when clicked on a new entry select that entry.
  @Output() selectedMaterialListEntryChange =
    new EventEmitter<MaterialListEntry>();

  gridApi: GridApi;

  constructor(
    private readonly demandValidationService: DemandValidationService,
    private readonly globalSelectionService: GlobalSelectionHelperService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {}

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    this.setServerSideDatasource();
    if (this.gridApi) {
      this.demandValidationService.getDataFetchedEvent().subscribe((value) => {
        this.rowCount = value.rowCount;
        if (this.rowCount === 0) {
          this.gridApi.showNoRowsOverlay();
        } else {
          this.gridApi.hideOverlay();
        }

        const nodes = this.gridApi.getRenderedNodes();

        if (nodes?.length) {
          this.gridApi.deselectAll();
          nodes[0].setExpanded(true);
          this.selectedMaterialListEntryChange.emit(nodes[0].data);
        }
      });
    }
  }

  onCellClicked(_: CellClickedEvent) {
    // TODO implement
    // if (!$event.data) {
    //   return;
    // }
    // if (
    //   $event.data.customerMaterialNumber &&
    //   $event.data.customerMaterialNumberCount > 1 &&
    //   $event.column.getColId() === 'customerMaterialNumber'
    // ) {
    //   // we cannot prevent clicking on a column, so we handle it here. The customerMaterialNumber column
    //   // opens a pop up to show all material numbers.
    //   // Maybe, in the future a check is required to prevent the click if more than one number exists only.
    //   return;
    // }
    // if (
    //   $event.data.materialNumber === props.selectedMaterialListEntry?.materialNumber ||
    //   !props.confirmContinueAndLooseUnsavedChanges()
    // ) {
    //   return;
    // }
    // $event.node.setSelected(true, true);
    // props.setSelectedMaterialListEntry($event.data);
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
  protected rowCount = 0;
  protected gridOptions: GridOptions = { ...serverSideTableDefaultProps };

  private setServerSideDatasource() {
    this.rowCount = 0;
    this.gridApi.setServerSideDatasource(
      this.demandValidationService.createDemandMaterialCustomerDatasource(
        this.getSelectionFilters()
      )
    );
  }

  private getSelectionFilters() {
    return {
      ...GlobalSelectionUtils.globalSelectionCriteriaToFilter(
        this.globalSelectionService.getGlobalSelection()
      ),
      // TODO add demandvalidationfilter from action bar
      customerNumber: [this.selectedCustomer.customerNumber],
    };
  }
}
