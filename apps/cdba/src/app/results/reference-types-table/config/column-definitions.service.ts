/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import {
  columnDefinitionToReferenceTypeProp,
  ColumnUtilsService,
  currentYear,
  filterParamsForDecimalValues,
  formatLongValue,
  formatMaterialNumber,
  scrambleMaterialDesignation,
  valueGetterArray,
  valueGetterDate,
} from '@cdba/shared/components/table';
import { CurrencyService } from '@cdba/shared/services/currency/currency.service';
import { translate } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  constructor(
    private readonly columnUtilsService: ColumnUtilsService,
    private readonly currencyService: CurrencyService
  ) {}

  COLUMN_DEFINITIONS: ColDef[] = [
    {
      checkboxSelection: true,
      sortable: false,
      filter: false,
      resizable: false,
      enablePivot: false,
      enableRowGroup: false,
      filterParams: false,
      suppressMenu: true,
      width: 0,
      maxWidth: 50,
      pinned: 'left',
      suppressColumnsToolPanel: true,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true,
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialDesignation'),
      headerName: translate(
        'results.referenceTypesTable.headers.materialDesignation'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialDesignation'
      ),
      valueFormatter: scrambleMaterialDesignation,
      cellRenderer: 'materialDesignationCellRender',
      pinned: 'left',
      suppressColumnsToolPanel: true,
      suppressMovable: true,
      lockPosition: true,
      lockVisible: true,
    },
    {
      field: columnDefinitionToReferenceTypeProp('isPcmRow'),
      headerName: translate('results.referenceTypesTable.headers.pcmRow'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.pcmRow'),
      cellRenderer: 'pcmCellRenderer',
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialNumber'),
      headerName: translate(
        'results.referenceTypesTable.headers.materialNumber'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialNumber'
      ),
      valueFormatter: formatMaterialNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('pcmQuantity'),
      headerName: translate('results.referenceTypesTable.headers.pcmQuantity'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.pcmQuantity'
      ),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('pcmSqv'),
      headerName: translate('results.referenceTypesTable.headers.pcmSqv'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.pcmSqv'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
    },
    {
      field: columnDefinitionToReferenceTypeProp('budgetQuantityCurrentYear'),
      headerName: translate(
        'results.referenceTypesTable.headers.budgetQuantity',
        {
          year: currentYear,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.budgetQuantity',
        { year: currentYear }
      ),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('sqvSapLatestMonth'),
      headerName: translate(
        'results.referenceTypesTable.headers.sqvSapLatestMonth'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.sqvSapLatestMonth'
      ),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
    },
    {
      field: columnDefinitionToReferenceTypeProp('gpcLatestYear'),
      headerName: translate(
        'results.referenceTypesTable.headers.gpcLatestYear'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.gpcLatestYear',
        { year: currentYear - 1 }
      ),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
    },
    {
      colId: 'averagePrice',
      headerName: translate(
        'results.referenceTypesTable.headers.averagePrice',
        {
          year: currentYear - 1,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.averagePrice',
        {
          year: currentYear - 1,
        }
      ),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('averagePrices'),
          0
        ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('currency'),
      headerName: translate('results.referenceTypesTable.headers.currency'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.currency'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('puUm'),
      headerName: translate('results.referenceTypesTable.headers.puUm'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.puUm'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('procurementType'),
      headerName: translate(
        'results.referenceTypesTable.headers.procurementType'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.procurementType'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('plant'),
      headerName: translate('results.referenceTypesTable.headers.plant'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.plant'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('salesOrganization'),
      headerName: translate(
        'results.referenceTypesTable.headers.salesOrganization'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.salesOrganization'
      ),
      valueFormatter: formatLongValue,
    },
    {
      field: columnDefinitionToReferenceTypeProp('customerGroup'),
      headerName: translate(
        'results.referenceTypesTable.headers.customerGroup'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.customerGroup'
      ),
      valueFormatter: formatLongValue,
    },
    {
      colId: 'actualQuantityLastYear',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 1,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.actualQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          0
        ),
    },
    {
      colId: 'actualQuantityLastYearMinus1',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 2,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.actualQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          1
        ),
    },
    {
      colId: 'actualQuantityLastYearMinus2',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 3,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.actualQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          2
        ),
    },
    {
      colId: 'actualQuantityLastYearMinus3',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 4,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.actualQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          3
        ),
    },
    {
      colId: 'netSalesLastYear',
      filter: 'agNumberColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.netSales', {
        year: currentYear - 1,
      }),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.netSales',
        {
          year: currentYear - 1,
          currency: this.currencyService.getCurrency(),
        }
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('netSales'),
          0
        ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('budgetQuantitySoco'),
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.budgetQuantitySoco',
        { year: currentYear }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.budgetQuantitySoco',
        { year: currentYear }
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      colId: 'plannedQuantityCurrentYear',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.plannedQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          0
        ),
    },
    {
      colId: 'plannedQuantityCurrentYearPlus1',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 1,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.plannedQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          1
        ),
    },
    {
      colId: 'plannedQuantityCurrentYearPlus2',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 2,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.plannedQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          2
        ),
    },
    {
      colId: 'plannedQuantityCurrentYearPlus3',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 3,
        }
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.plannedQuantity'
      ),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          3
        ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('projectName'),
      headerName: translate('results.referenceTypesTable.headers.projectName'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.projectName'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('productDescription'),
      headerName: translate(
        'results.referenceTypesTable.headers.productDescription'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.productDescription'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialShortDescription'),
      headerName: translate(
        'results.referenceTypesTable.headers.materialShortDescription'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialShortDescription'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('productLine'),
      headerName: translate('results.referenceTypesTable.headers.productLine'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.productLine'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('inquiryType'),
      headerName: translate('results.referenceTypesTable.headers.inquiryType'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.inquiryType'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('length'),
      headerName: translate('results.referenceTypesTable.headers.length'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.length'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('width'),
      headerName: translate('results.referenceTypesTable.headers.width'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.width'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('height'),
      headerName: translate('results.referenceTypesTable.headers.height'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.height'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('unitOfDimension'),
      headerName: translate(
        'results.referenceTypesTable.headers.unitOfDimension'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.unitOfDimension'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('weight'),
      headerName: translate('results.referenceTypesTable.headers.weight'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.weight'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('weightUnit'),
      headerName: translate('results.referenceTypesTable.headers.weightUnit'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.weightUnit'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('volumeCubic'),
      headerName: translate('results.referenceTypesTable.headers.volumeCubic'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.volumeCubic'
      ),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('volumeUnit'),
      headerName: translate('results.referenceTypesTable.headers.volumeUnit'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.volumeUnit'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('customer'),
      headerName: translate('results.referenceTypesTable.headers.customer'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.customer'),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('rfq'),
      headerName: translate('results.referenceTypesTable.headers.rfq'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.rfq'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('quotationNumber'),
      headerName: translate(
        'results.referenceTypesTable.headers.quotationNumber'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.quotationNumber'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('toolingCost'),
      filter: 'agNumberColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.toolingCost'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.toolingCost'
      ),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
    },
    {
      colId: 'pcmCalculationDate',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.pcmCalculationDate'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.pcmCalculationDate'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('pcmCalculationDate')
        ),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      colId: 'gpcDate',
      filter: 'agDateColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.gpcDate'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.gpcDate'),
      valueGetter: (params) =>
        valueGetterDate(params, columnDefinitionToReferenceTypeProp('gpcDate')),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      colId: 'sqvDate',
      filter: 'agDateColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.sqvDate'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.sqvDate'),
      valueGetter: (params) =>
        valueGetterDate(params, columnDefinitionToReferenceTypeProp('sqvDate')),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      field: columnDefinitionToReferenceTypeProp('specialProcurement'),
      headerName: translate(
        'results.referenceTypesTable.headers.specialProcurement'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.specialProcurement'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('supplier'),
      headerName: translate('results.referenceTypesTable.headers.supplier'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.supplier'),
    },
    {
      colId: 'purchasePriceValidFrom',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.purchasePriceValidFrom'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.purchasePriceValidFrom'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('purchasePriceValidFrom')
        ),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      colId: 'purchasePriceValidUntil',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'results.referenceTypesTable.headers.purchasePriceValidUntil'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.purchasePriceValidUntil'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('purchasePriceValidUntil')
        ),
      valueFormatter: this.columnUtilsService.formatDate,
    },
  ];
  // eslint-disable-next-line max-lines
}
