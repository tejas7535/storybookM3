import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
} from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import { CMPEntry } from '../../../../../feature/customer-material-portfolio/model';
import { CustomerEntry } from '../../../../../feature/global-selection/model';
import { CriteriaFields } from '../../../../../feature/material-customer/model';
import {
  getColFilter,
  getDefaultColDef,
  serverSideTableDefaultProps,
  sideBar,
} from '../../../../../shared/ag-grid/grid-defaults';
import { TableToolbarComponent } from '../../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { GlobalSelectionState } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { StyledGridSectionComponent } from '../../../../../shared/components/styled-grid-section/styled-grid-section.component';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { CustomerMaterialPortfolioTableRowMenuButtonComponent } from '../customer-material-portfolio-table-row-menu-button/customer-material-portfolio-table-row-menu-button.component';
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
    StyledGridSectionComponent,
    AgGridModule,
  ],
  templateUrl: './customer-material-portfolio-table.component.html',
  styleUrl: './customer-material-portfolio-table.component.scss',
})
export class CustomerMaterialPortfolioTableComponent {
  selectedCustomer = input.required<CustomerEntry>();
  globalSelection = input.required<GlobalSelectionState>();
  filterModel = input.required<FilterModel>();
  showChains: boolean;
  protected gridOptions: GridOptions = {
    ...serverSideTableDefaultProps,
    sideBar,
    components: {
      ...serverSideTableDefaultProps.components,
      cmpMenuRenderer: CustomerMaterialPortfolioTableRowMenuButtonComponent,
    },
  };
  protected childMaterialsCache: Map<string, CMPEntry[]> = new Map();
  protected rowCount = 0;

  protected criteriaData = signal<CriteriaFields>(null);

  gridApi: GridApi;

  constructor(
    private readonly cmpService: CMPService,
    protected readonly agGridLocalizationService: AgGridLocalizationService
  ) {
    this.cmpService.getCMPCriteriaData().subscribe((criteriaData) => {
      this.criteriaData.set(criteriaData);
    });

    effect(() => {
      if (this.selectedCustomer() || this.globalSelection()) {
        this.setServerSideDatasource();
      }
    });

    effect(() => {
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

      this.columnDefs = [
        ...columnDefinitions(this.agGridLocalizationService).map(
          (def: any) => ({
            ...getDefaultColDef(def.filter, def.filterParams),
            ...mapColumnData(def),
          })
        ),
        {
          field: 'menu',
          headerName: '',
          cellRenderer: 'cmpMenuRenderer',
          lockVisible: true,
          pinned: 'right',
          lockPinned: true,
          // TODO implement
          // cellRendererParams: {
          //   handleModalChange,
          // },
          suppressMenu: true,
          maxWidth: 64,
          suppressSizeToFit: true,
        },
      ] as ColDef[];
    });
  }

  protected getRowIdFn: GetRowIdFunc = (params: GetRowIdParams) =>
    `${params.data.successor}-${params.data.materialNumber}`;
  columnDefs: (ColGroupDef | ColDef)[] | null | undefined;
  autoGroupColumnDef: ColDef | undefined = {
    field: 'materialNumber',
    headerName: translate(`material_customer.column.materialNumber`, {}),
    minWidth: 280,
    pinned: 'left',
    lockPinned: true,
  };
  getServerSideGroup: IsServerSideGroup | undefined = (data) =>
    data.hasChildren;
  getServerSideGroupOpenByDefault:
    | ((params: IsServerSideGroupOpenByDefaultParams) => boolean)
    | undefined = () => false;
  getServerSideGroupKey: GetServerSideGroupKey | undefined = (data) =>
    data.materialNumber;

  handleExpandAllChange($event?: MatSlideToggleChange) {
    this.showChains = $event.checked;
    if (this.showChains) {
      this.gridApi.expandAll();
    } else {
      this.gridApi.collapseAll();
    }
  }

  onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
    this.setServerSideDatasource();
    if (this.gridApi) {
      this.cmpService.getDataFetchedEvent().subscribe((value) => {
        this.rowCount = value.headMaterials.rowCount;
        if (this.rowCount === 0) {
          this.gridApi.showNoRowsOverlay();
        } else {
          this.gridApi.hideOverlay();
        }
      });
    }
  }

  private setServerSideDatasource() {
    this.rowCount = 0;
    this.gridApi.setServerSideDatasource(
      this.cmpService.createCustomerMaterialPortfolioDatasource(
        this.selectedCustomer(),
        this.globalSelection(),
        this.childMaterialsCache
      )
    );
  }

  onFirstDataRendered($event: FirstDataRenderedEvent) {
    $event.columnApi.autoSizeAllColumns();
  }
}
