import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AgGridEvent,
  ColDef,
  ColumnApi,
  ExcelStyle,
  FirstDataRenderedEvent,
  GridReadyEvent,
  RowNode,
  RowSelectedEvent,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import {
  addSimulatedQuotation,
  getColumnDefsForRoles,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
} from '../../core/store';
import { ColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { excelStyles } from '../../shared/ag-grid/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { ColumnDefService } from '../../shared/ag-grid/services/column-def.service';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import { KpiValue } from '../../shared/components/modal/editing-modal/kpi-value.model';
import { basicTableStyle, statusBarStlye } from '../../shared/constants';
import { Quotation } from '../../shared/models';
import { QuotationDetail } from '../../shared/models/quotation-detail';
import { AgGridStateService } from '../../shared/services/ag-grid-state.service/ag-grid-state.service';
import { PriceService } from '../../shared/services/price-service/price.service';
import {
  COMPONENTS,
  DEFAULT_COLUMN_DEFS,
  MODULES,
  SIDE_BAR,
  STATUS_BAR_CONFIG,
} from './config';
import { TableContext } from './config/tablecontext.model';

@Component({
  selector: 'gq-quotation-details-table',
  templateUrl: './quotation-details-table.component.html',
  styles: [basicTableStyle, statusBarStlye],
})
export class QuotationDetailsTableComponent implements OnInit {
  @Input() set quotation(quotation: Quotation) {
    this.rowData = quotation?.quotationDetails;
    this.tableContext.quotation = quotation;
  }

  private readonly TABLE_KEY = 'processCase';

  public sideBar: SideBarDef = SIDE_BAR;
  public modules: any[] = MODULES;
  public defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;
  public statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;
  public components = COMPONENTS;
  public columnDefs$: Observable<ColDef[]>;
  public rowSelection = 'multiple';
  public excelStyles: ExcelStyle[] = excelStyles;
  public localeText$: Observable<AgGridLocale>;
  public rowData: QuotationDetail[];
  public selectedRows: RowNode[] = [];
  public tableContext: TableContext = {
    quotation: undefined,
    onMultipleMaterialSimulation: () => {},
  };

  simulatedField: ColumnFields;
  simulatedValue: number;

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService,
    private readonly localizationService: LocalizationService
  ) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.select(
      getColumnDefsForRoles(this.columnDefinitionService.COLUMN_DEFS)
    );
    this.localeText$ = this.localizationService.locale$;
    this.tableContext.onMultipleMaterialSimulation =
      this.onMultipleMaterialSimulation.bind(this);
  }

  public onColumnChange(event: SortChangedEvent): void {
    this.updateColumnData(event);

    this.agGridStateService.setColumnState(
      this.TABLE_KEY,
      event.columnApi.getColumnState()
    );
  }

  public onRowDataChanged(event: AgGridEvent): void {
    this.updateColumnData(event);

    if (this.selectedRows) {
      this.selectedRows.forEach((node: RowNode) => {
        event.api.selectIndex(node.rowIndex, true, true);
      });
    }
  }

  public updateColumnData(event: AgGridEvent): void {
    const columnData = this.buildColumnData(event);

    this.agGridStateService.setColumnData(
      this.tableContext.quotation.gqId.toString(),
      columnData
    );
  }

  public onGridReady(event: GridReadyEvent): void {
    const quotationId = this.tableContext.quotation.gqId.toString();
    if (!this.agGridStateService.getColumnData(quotationId)) {
      const columnData = this.buildColumnData(event);
      this.agGridStateService.setColumnData(quotationId, columnData);
    }

    const state = this.agGridStateService.getColumnState(this.TABLE_KEY);
    if (state) {
      event.columnApi.setColumnState(state);
    }
  }

  private readonly buildColumnData = (event: AgGridEvent) => {
    const columnData: QuotationDetail[] = [];
    event.api.forEachNodeAfterFilterAndSort((node: RowNode) => {
      columnData.push(node.data);
    });

    return columnData;
  };

  public onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const gridColumnApi: ColumnApi = event.columnApi;
    gridColumnApi.autoSizeAllColumns(false);
  }

  public onRowSelected(event: RowSelectedEvent): void {
    this.selectedRows = event.api.getSelectedNodes();

    if (
      this.selectedRows.length > 0 &&
      this.simulatedField &&
      this.simulatedValue
    ) {
      if (event.node.isSelected()) {
        this.simulateMaterial(this.simulatedField, this.simulatedValue);
      } else {
        this.store.dispatch(
          removeSimulatedQuotationDetail({
            gqPositionId: event.node.data.gqPositionId,
          })
        );
      }
    } else if (this.selectedRows.length === 0) {
      this.simulatedField = undefined;
      this.simulatedValue = undefined;

      this.store.dispatch(resetSimulatedQuotation());
    }
  }

  public onMultipleMaterialSimulation(valId: ColumnFields, value: number) {
    this.simulatedField = valId;
    this.simulatedValue = value;

    this.simulateMaterial(valId, value);
  }

  private simulateMaterial(field: ColumnFields, value: number) {
    const simulatedRows = this.selectedRows.map((row: RowNode) => {
      if (!this.shouldSimulate(field, row.data)) {
        return row.data;
      }

      const affectedKpis = PriceService.calculateAffectedKPIs(
        value,
        field,
        row.data
      );
      const simulatedPrice = this.getAffectedKpi(affectedKpis, 'price');

      const simulatedRow: QuotationDetail = {
        ...row.data,
        price: simulatedPrice,
        netValue: PriceService.calculateNetValue(
          simulatedPrice,
          row.data.orderQuantity
        ),
        gpi:
          field === ColumnFields.GPI
            ? value
            : this.getAffectedKpi(affectedKpis, ColumnFields.GPI),
        gpm:
          field === ColumnFields.GPM
            ? value
            : this.getAffectedKpi(affectedKpis, ColumnFields.GPM),
        discount:
          field === ColumnFields.DISCOUNT
            ? value
            : this.getAffectedKpi(affectedKpis, ColumnFields.DISCOUNT),
        priceDiff: PriceService.calculatepriceDiff({
          ...row.data,
          price: simulatedPrice,
        }),
        rlm: PriceService.calculateMargin(
          simulatedPrice,
          row.data.relocationCost
        ),
      };

      return simulatedRow;
    });

    this.store.dispatch(
      addSimulatedQuotation({
        gqId: this.tableContext.quotation.gqId,
        quotationDetails: simulatedRows,
      })
    );
  }

  private shouldSimulate(
    field: ColumnFields,
    detail: QuotationDetail
  ): boolean {
    switch (field) {
      case ColumnFields.DISCOUNT: {
        return detail.sapGrossPrice && detail.sapGrossPrice > 0;
      }
      case ColumnFields.GPI: {
        return detail.gpc && detail.gpc > 0;
      }
      case ColumnFields.GPM: {
        return detail.sqv && detail.sqv > 0;
      }
      default:
        return true;
    }
  }
  private getAffectedKpi(
    kpis: KpiValue[],
    kpiName: string
  ): number | undefined {
    return kpis.find((kpi: KpiValue) => kpi.key === kpiName)?.value;
  }
}
