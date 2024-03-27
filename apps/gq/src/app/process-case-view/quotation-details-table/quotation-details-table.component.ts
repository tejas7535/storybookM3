/* eslint-disable max-lines */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { combineLatest, map, Observable, Subject, take, takeUntil } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getColumnDefsForRoles } from '@gq/core/store/selectors';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { excelStyles } from '@gq/shared/ag-grid/custom-status-bar/export-to-excel-button/excel-styles.constants';
import { AgGridLocale } from '@gq/shared/ag-grid/models/ag-grid-locale.interface';
import {
  ColumnDefService,
  ColumnUtilityService,
} from '@gq/shared/ag-grid/services';
import { LocalizationService } from '@gq/shared/ag-grid/services/localization.service';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import {
  basicTableStyle,
  statusBarSimulation,
  statusBarWithBorderStyle,
} from '@gq/shared/constants';
import { Quotation } from '@gq/shared/models';
import { FilterState } from '@gq/shared/models/grid-state.model';
import {
  PriceSource,
  QuotationDetail,
  SapPriceCondition,
} from '@gq/shared/models/quotation-detail';
import { AgGridStateService } from '@gq/shared/services/ag-grid-state/ag-grid-state.service';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  calculateAffectedKPIs,
  calculateMargin,
  calculatePriceDiff,
  getPriceUnit,
  multiplyAndRoundValues,
} from '@gq/shared/utils/pricing.utils';
import { Store } from '@ngrx/store';
import {
  ColDef,
  ColumnState,
  ExcelStyle,
  FilterChangedEvent,
  FirstDataRenderedEvent,
  GetContextMenuItemsParams,
  GetMainMenuItemsParams,
  GridReadyEvent,
  MenuItemDef,
  RowDataUpdatedEvent,
  RowDoubleClickedEvent,
  RowNode,
  RowSelectedEvent,
  SideBarDef,
  SortChangedEvent,
  StatusPanelDef,
} from 'ag-grid-community';

import { AppRoutePath } from '../../app-route-path.enum';
import {
  COMPONENTS,
  DEFAULT_COLUMN_DEFS,
  SIDE_BAR,
  STATUS_BAR_CONFIG,
} from './config';
import { TableContext } from './config/tablecontext.model';

@Component({
  selector: 'gq-quotation-details-table',
  templateUrl: './quotation-details-table.component.html',
  styles: [basicTableStyle, statusBarSimulation, statusBarWithBorderStyle],
})
export class QuotationDetailsTableComponent implements OnInit, OnDestroy {
  sideBar: SideBarDef = SIDE_BAR;
  defaultColumnDefs: ColDef = DEFAULT_COLUMN_DEFS;
  statusBar: { statusPanels: StatusPanelDef[] } = STATUS_BAR_CONFIG;
  components = COMPONENTS;
  columnDefs$: Observable<ColDef[]>;
  rowSelection = 'multiple';
  excelStyles: ExcelStyle[] = excelStyles;
  localeText$: Observable<AgGridLocale>;
  rowData: QuotationDetail[];
  selectedRows: RowNode[] = [];
  tableContext: TableContext = {
    quotation: undefined,
    onMultipleMaterialSimulation: () => {},
    onPriceSourceSimulation: () => {},
  };

  simulatedField: ColumnFields;
  simulatedValue: number;
  isInputInvalid: boolean;
  simulatedPriceSource: PriceSourceOptions;

  selectedQuotationIds: string[] = [];

  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly agGridStateService: AgGridStateService,
    private readonly columnDefinitionService: ColumnDefService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router,
    private readonly activeCaseFacade: ActiveCaseFacade,
    private readonly featureToggleService: FeatureToggleConfigService
  ) {}

  @Input() set quotation(quotation: Quotation) {
    this.rowData = quotation?.quotationDetails;
    this.tableContext.quotation = quotation;
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.next(true);
      this.unsubscribe$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.columnDefs$ = combineLatest([
      this.store.pipe(
        getColumnDefsForRoles(
          this.featureToggleService.isEnabled('fPricing')
            ? this.columnDefinitionService.COLUMN_DEFS
            : this.columnDefinitionService.COLUMN_DEFS_WITHOUT_PRICING_ASSISTANT
        )
      ),
      this.activeCaseFacade.quotationHasFNumberMaterials$,
      this.activeCaseFacade.quotationHasRfqMaterials$,
    ]).pipe(
      map(([columnDefs, hasFNumberMaterials, hasRfqMaterials]) => {
        let columnDef = ColumnUtilityService.filterSAPColumns(
          columnDefs,
          this.tableContext.quotation
        );

        columnDef = hasFNumberMaterials
          ? columnDef
          : ColumnUtilityService.filterPricingAssistantColumns(columnDef);

        return hasRfqMaterials
          ? columnDef
          : ColumnUtilityService.filterRfqColumns(columnDef);
      })
    );

    this.localeText$ = this.localizationService.locale$;
    this.tableContext.onMultipleMaterialSimulation =
      this.onMultipleMaterialSimulation.bind(this);
    this.tableContext.onPriceSourceSimulation =
      this.onPriceSourceSimulation.bind(this);

    this.store
      .select(activeCaseFeature.selectSelectedQuotationDetails)
      .pipe(take(1))
      .subscribe((val) => {
        this.selectedQuotationIds = val;
      });
  }

  onColumnChange(event: SortChangedEvent): void {
    this.updateColumnData(event);

    const viewId = this.agGridStateService.getCurrentViewId();

    if (viewId !== this.agGridStateService.DEFAULT_VIEW_ID) {
      this.agGridStateService.setColumnStateForCurrentView(
        event.columnApi.getColumnState()
      );
    }
  }

  onFilterChanged(event: FilterChangedEvent): void {
    const viewId = this.agGridStateService.getCurrentViewId();

    if (viewId !== this.agGridStateService.DEFAULT_VIEW_ID) {
      const filterModels = event.api.getFilterModel();

      this.agGridStateService.setColumnFilterForCurrentView(
        this.tableContext.quotation.gqId.toString(),
        filterModels
      );
    }
  }

  onRowDataUpdated(event: RowDataUpdatedEvent): void {
    this.updateColumnData(event);

    if (this.selectedRows) {
      this.selectedRows.forEach((node: RowNode) => {
        event.api.selectIndex(node.rowIndex, true, true);
      });
    }
  }

  updateColumnData(
    event: FilterChangedEvent | SortChangedEvent | RowDataUpdatedEvent
  ): void {
    const columnData = this.buildColumnData(event);

    this.agGridStateService.setColumnData(
      this.tableContext.quotation.gqId.toString(),
      columnData
    );
  }

  onGridReady(event: GridReadyEvent): void {
    const quotationId = this.tableContext.quotation.gqId.toString();
    if (!this.agGridStateService.getColumnData(quotationId)) {
      const columnData = this.buildColumnData(event);
      this.agGridStateService.setColumnData(quotationId, columnData);
    }

    event.api.forEachNode((node) => {
      if (this.selectedQuotationIds.includes(node.data.gqPositionId)) {
        node.setSelected(true);
      }
    });

    this.agGridStateService.columnState
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((colState: ColumnState[]) => {
        if (colState?.length === 0) {
          event?.columnApi?.resetColumnState();
        } else {
          event?.columnApi?.applyColumnState({
            state: colState,
            applyOrder: true,
          });
        }
      });

    this.agGridStateService.filterState
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((filterState: FilterState[]) => {
        const curFilter = filterState.find(
          (filter) => filter.actionItemId === quotationId
        );
        event?.api?.setFilterModel?.(curFilter?.filterModels || {});
      });
  }

  onFirstDataRendered(event: FirstDataRenderedEvent): void {
    const columnIds = event.columnApi
      .getAllGridColumns()
      .map((col) => col.getColId())
      .filter(
        (s) =>
          ![
            ColumnFields.RECOMMENDED_PRICE,
            ColumnFields.SAP_PRICE,
            ColumnFields.PRICE_DIFF,
          ].includes(s as ColumnFields)
      );
    columnIds.forEach((colId) => event.columnApi.autoSizeColumn(colId, false));
  }

  onRowSelected(event: RowSelectedEvent): void {
    if (event.node.isSelected()) {
      this.store.dispatch(
        ActiveCaseActions.selectQuotationDetail({
          gqPositionId: event.node.data.gqPositionId,
        })
      );
    } else {
      this.store.dispatch(
        ActiveCaseActions.deselectQuotationDetail({
          gqPositionId: event.node.data.gqPositionId,
        })
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
        this.simulateMaterial(
          this.simulatedField,
          this.simulatedValue,
          this.isInputInvalid
        );
      } else {
        this.store.dispatch(
          ActiveCaseActions.removeSimulatedQuotationDetail({
            gqPositionId: event.node.data.gqPositionId,
          })
        );
      }
    } else if (this.selectedRows.length === 0) {
      this.simulatedField = undefined;
      this.simulatedValue = undefined;
      this.simulatedPriceSource = undefined;

      this.store.dispatch(ActiveCaseActions.resetSimulatedQuotation());
    }
  }

  onMultipleMaterialSimulation(
    valId: ColumnFields,
    value: number,
    isInvalid: boolean
  ) {
    this.simulatedField = valId;
    this.simulatedValue = value;
    this.isInputInvalid = isInvalid;
    this.tableContext.simulatedField = this.simulatedField;
    this.tableContext.simulatedValue = this.simulatedValue;

    this.simulateMaterial(valId, value, isInvalid);
  }

  onPriceSourceSimulation(priceSourceOption: PriceSourceOptions) {
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
         * 5. Target Price is targetPriceSource but no Target Price is available
         */
        if (
          detail.priceSource === targetPriceSource ||
          (targetPriceSource === PriceSource.GQ && !detail.recommendedPrice) ||
          (targetPriceSource === PriceSource.STRATEGIC &&
            !detail.strategicPrice) ||
          (targetPriceSource !== PriceSource.GQ &&
            targetPriceSource !== PriceSource.TARGET_PRICE &&
            !detail.sapPriceCondition) ||
          (targetPriceSource === PriceSource.TARGET_PRICE &&
            !detail.targetPrice)
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
        const affectedKpis = calculateAffectedKPIs(
          newPrice,
          ColumnFields.PRICE,
          row.data,
          false
        );

        const priceUnit = getPriceUnit(row.data);
        const simulatedPrice = this.getAffectedKpi(affectedKpis, 'price');

        const simulatedRow: QuotationDetail = {
          ...row.data,
          price: simulatedPrice,
          priceSource: newPriceSource,
          // to correctly calculate the new netValue, the orderQuantity has to be divided by the old priceUnit, since the priceUnit might be > 1 but isn't part of the simulated data
          netValue: multiplyAndRoundValues(
            simulatedPrice,
            row.data.orderQuantity / priceUnit
          ),
          gpi: this.getAffectedKpi(affectedKpis, ColumnFields.GPI),
          gpm: this.getAffectedKpi(affectedKpis, ColumnFields.GPM),
          discount: this.getAffectedKpi(affectedKpis, ColumnFields.DISCOUNT),
          priceDiff: calculatePriceDiff(
            row.data.lastCustomerPrice,
            simulatedPrice
          ),
          rlm: calculateMargin(simulatedPrice, row.data.relocationCost),
        };

        return simulatedRow;
      })
      .filter(Boolean);

    this.store.dispatch(
      ActiveCaseActions.addSimulatedQuotation({
        gqId: this.tableContext.quotation.gqId,
        quotationDetails: simulatedRows,
      })
    );
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    this.router.navigate([AppRoutePath.DetailViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        gqPositionId: event.data.gqPositionId,
      },
    });
  }

  getMainMenuItems(params: GetMainMenuItemsParams): (string | MenuItemDef)[] {
    const menuItems: (MenuItemDef | string)[] = [...params.defaultItems];
    menuItems.push(
      ColumnUtilityService.getResetAllFilteredColumnsMenuItem(params)
    );

    return menuItems;
  }

  getContextMenuItems(
    params: GetContextMenuItemsParams
  ): (string | MenuItemDef)[] {
    let hyperlinkMenuItems: (string | MenuItemDef)[] = [];
    const HYPERLINK_COLUMNS: string[] = [
      ColumnFields.QUOTATION_ITEM_ID,
      ColumnFields.RECOMMENDED_PRICE,
      ColumnFields.SAP_PRICE,
    ];

    if (HYPERLINK_COLUMNS.includes(params.column.getColId()) && params.value) {
      hyperlinkMenuItems = [
        ColumnUtilityService.getOpenInNewTabContextMenuItem(params),
        ColumnUtilityService.getOpenInNewWindowContextMenuItem(params),
      ];
    }

    return [
      ColumnUtilityService.getCopyCellContentContextMenuItem(params),
      ...hyperlinkMenuItems,
    ];
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
    if (targetPriceSource === PriceSource.TARGET_PRICE) {
      return detail.targetPrice;
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

    if (priceSourceOption === PriceSourceOptions.TARGET_PRICE) {
      return PriceSource.TARGET_PRICE;
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
    if (
      [
        PriceSource.GQ,
        PriceSource.STRATEGIC,
        PriceSource.TARGET_PRICE,
      ].includes(targetPriceSource)
    ) {
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

  private getSimulatedRow(
    field: ColumnFields,
    value: number,
    row: RowNode
  ): QuotationDetail {
    if (!this.shouldSimulate(field, row.data)) {
      return row.data;
    }

    const affectedKpis = calculateAffectedKPIs(value, field, row.data);
    const priceUnit = getPriceUnit(row.data);
    const simulatedPrice = this.getAffectedKpi(affectedKpis, 'price');

    const simulatedRow: QuotationDetail = {
      ...row.data,
      price: simulatedPrice,
      priceSource: PriceSource.MANUAL,
      // to correctly calculate the new netValue, the orderQuantity has to be divided by the old priceUnit, since the priceUnit might be > 1 but isn't part of the simulated data
      netValue: multiplyAndRoundValues(
        simulatedPrice,
        row.data.orderQuantity / priceUnit
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
      priceDiff: calculatePriceDiff(row.data.lastCustomerPrice, simulatedPrice),
      rlm: calculateMargin(simulatedPrice, row.data.relocationCost),
    };

    return simulatedRow;
  }

  private simulateMaterial(
    field: ColumnFields,
    value: number,
    isInvalid: boolean
  ) {
    const simulatedRows = isInvalid
      ? []
      : this.selectedRows.map((row: RowNode) =>
          this.getSimulatedRow(field, value, row)
        );

    this.store.dispatch(
      ActiveCaseActions.addSimulatedQuotation({
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
      default: {
        return true;
      }
    }
  }

  private getAffectedKpi(
    kpis: KpiValue[],
    kpiName: string
  ): number | undefined {
    return kpis.find((kpi: KpiValue) => kpi.key === kpiName)?.value;
  }

  private readonly buildColumnData = (event: RowDataUpdatedEvent) => {
    const columnData: QuotationDetail[] = [];
    event.api.forEachNodeAfterFilterAndSort((node: RowNode) => {
      columnData.push(node.data);
    });

    return columnData;
  };
}
