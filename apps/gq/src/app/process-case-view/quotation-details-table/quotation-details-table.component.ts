/* eslint-disable max-lines */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, take } from 'rxjs';

import {
  AgGridEvent,
  ColDef,
  ColumnApi,
  ExcelStyle,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  RowDoubleClickedEvent,
  RowNode,
  RowSelectedEvent,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from '@ag-grid-community/all-modules';
import { Store } from '@ngrx/store';

import { AppRoutePath } from '../../app-route-path.enum';
import {
  addSimulatedQuotation,
  deselectQuotationDetail,
  getColumnDefsForRoles,
  getSelectedQuotationDetailIds,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
  selectQuotationDetail,
} from '../../core/store';
import { PriceSourceOptions } from '../../shared/ag-grid/column-headers/editable-column-header/models/price-source-options.enum';
import { ColumnFields } from '../../shared/ag-grid/constants/column-fields.enum';
import { excelStyles } from '../../shared/ag-grid/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { AgGridLocale } from '../../shared/ag-grid/models/ag-grid-locale.interface';
import { ColumnDefService } from '../../shared/ag-grid/services/column-def.service';
import { LocalizationService } from '../../shared/ag-grid/services/localization.service';
import { KpiValue } from '../../shared/components/modal/editing-modal/kpi-value.model';
import { basicTableStyle, statusBarStlye } from '../../shared/constants';
import { Quotation } from '../../shared/models';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '../../shared/models/quotation-detail';
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
    onPriceSourceSimulation: () => {},
  };

  simulatedField: ColumnFields;
  simulatedValue: number;
  simulatedPriceSource: PriceSourceOptions;

  selectedQuotationIds: string[] = [];

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.columnDefs$ = this.store.pipe(
      getColumnDefsForRoles(this.columnDefinitionService.COLUMN_DEFS)
    );
    this.localeText$ = this.localizationService.locale$;
    this.tableContext.onMultipleMaterialSimulation =
      this.onMultipleMaterialSimulation.bind(this);
    this.tableContext.onPriceSourceSimulation =
      this.onPriceSourceSimulation.bind(this);

    this.store
      .select(getSelectedQuotationDetailIds)
      .pipe(take(1))
      .subscribe((val) => {
        this.selectedQuotationIds = val;
      });
  }

  public onColumnChange(event: FilterChangedEvent | SortChangedEvent): void {
    this.updateColumnData(event);

    this.agGridStateService.setColumnState(
      this.TABLE_KEY,
      event.columnApi.getColumnState()
    );

    const filterModels = event.api.getFilterModel();
    this.agGridStateService.setColumnFilters(
      this.tableContext.quotation.gqId.toString(),
      filterModels
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

    const filterModel = this.agGridStateService.getColumnFilters(quotationId);
    if (filterModel) {
      event.api.setFilterModel(filterModel);
    }

    event.api.forEachNode((node) => {
      if (this.selectedQuotationIds.includes(node.data.gqPositionId)) {
        node.setSelected(true);
      }
    });
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
    if (event.node.isSelected()) {
      this.store.dispatch(
        selectQuotationDetail({ gqPositionId: event.node.data.gqPositionId })
      );
    } else {
      this.store.dispatch(
        deselectQuotationDetail({ gqPositionId: event.node.data.gqPositionId })
      );
    }

    this.selectedRows = event.api.getSelectedNodes();
    if (this.simulatedPriceSource) {
      this.onPriceSourceSimulation(this.simulatedPriceSource);
    }
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
      this.simulatedPriceSource = undefined;

      this.store.dispatch(resetSimulatedQuotation());
    }
  }

  public onMultipleMaterialSimulation(valId: ColumnFields, value: number) {
    this.simulatedField = valId;
    this.simulatedValue = value;
    this.tableContext.simulatedField = this.simulatedField;
    this.tableContext.simulatedValue = this.simulatedValue;

    this.simulateMaterial(valId, value);
  }

  public onPriceSourceSimulation(priceSourceOption: PriceSourceOptions) {
    this.simulatedPriceSource = priceSourceOption;

    const simulatedRows = this.selectedRows
      .map((row: RowNode) => {
        const detail: QuotationDetail = row.data;

        const targetPriceSource = this.getTargetPriceSource(
          detail,
          priceSourceOption
        );

        /**
         * Do not simulate if
         * 1. priceSource is already correct
         * 2. GQ Price is targetPriceSource but no GQ Price is available
         * 3. StrategicPrice is targetPriceSource but no strategic Price is available
         * 4. SAP Price is targetPriceSource but not SAP Price is available
         */
        if (
          detail.priceSource === targetPriceSource ||
          (targetPriceSource === PriceSource.GQ && !detail.recommendedPrice) ||
          (targetPriceSource === PriceSource.STRATEGIC &&
            !detail.strategicPrice) ||
          (targetPriceSource !== PriceSource.GQ && !detail.sapPriceCondition)
        ) {
          return undefined as any;
        }
        // set new price according to targetPriceSource and available data of the position
        const newPrice = this.getPriceByTargetPriceSource(
          targetPriceSource,
          detail
        );
        // set new price source according to targetPriceSource and available data of the position
        const newPriceSource = this.getPriceSource(targetPriceSource, detail);
        const affectedKpis = PriceService.calculateAffectedKPIs(
          newPrice,
          ColumnFields.PRICE,
          row.data,
          false
        );
        const simulatedPrice = this.getAffectedKpi(affectedKpis, 'price');

        const simulatedRow: QuotationDetail = {
          ...row.data,
          price: simulatedPrice,
          priceSource: newPriceSource,
          netValue: PriceService.calculateNetValue(
            simulatedPrice,
            row.data.orderQuantity
          ),
          gpi: this.getAffectedKpi(affectedKpis, ColumnFields.GPI),
          gpm: this.getAffectedKpi(affectedKpis, ColumnFields.GPM),
          discount: this.getAffectedKpi(affectedKpis, ColumnFields.DISCOUNT),
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
      })
      .filter(Boolean);

    this.store.dispatch(
      addSimulatedQuotation({
        gqId: this.tableContext.quotation.gqId,
        quotationDetails: simulatedRows,
      })
    );
  }

  private getPriceByTargetPriceSource(
    targetPriceSource: PriceSource,
    detail: QuotationDetail
  ) {
    if (targetPriceSource === PriceSource.GQ) {
      return detail.recommendedPrice;
    }
    if (targetPriceSource === PriceSource.STRATEGIC) {
      return detail.strategicPrice;
    }

    return detail.sapPrice;
  }
  private getTargetPriceSource(
    detail: QuotationDetail,
    priceSourceOption: PriceSourceOptions
  ) {
    if (priceSourceOption === PriceSourceOptions.GQ) {
      return detail.recommendedPrice ? PriceSource.GQ : PriceSource.STRATEGIC;
    }

    if (detail.sapPriceCondition === SapPriceCondition.STANDARD) {
      return PriceSource.SAP_STANDARD;
    }

    if (detail.sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
  }

  private getPriceSource(
    targetPriceSource: PriceSource,
    detail: QuotationDetail
  ) {
    if ([PriceSource.GQ, PriceSource.STRATEGIC].includes(targetPriceSource)) {
      return targetPriceSource;
    }

    if (detail.sapPriceCondition === SapPriceCondition.STANDARD) {
      return PriceSource.SAP_STANDARD;
    }

    if (detail.sapPriceCondition === SapPriceCondition.CAP_PRICE) {
      return PriceSource.CAP_PRICE;
    }

    return PriceSource.SAP_SPECIAL;
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
        priceSource: PriceSource.MANUAL,
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

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId: event.data.gqPositionId,
      },
    });
  }
}
