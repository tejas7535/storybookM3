import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

import {
  columnDefinitionToReferenceTypeProp,
  currentYear,
  formatDate,
  formatLongValue,
  formatMaterialNumber,
  formatNumber,
  valueGetterArray,
  valueGetterDate,
} from '@cdba/shared/components/table';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  COLUMN_DEFINITIONS: ColDef[] = [
    {
      suppressMovable: true,
      checkboxSelection: true,
      sortable: false,
      filter: false,
      resizable: false,
      enablePivot: false,
      enableRowGroup: false,
      filterParams: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      width: 0,
      maxWidth: 50,
      pinned: 'left',
    },
    {
      field: columnDefinitionToReferenceTypeProp('isPcmRow'),
      headerName: translate('search.referenceTypesTable.headers.pcmRow'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.pcmRow'),
      cellRenderer: 'pcmCellRenderer',
      pinned: 'left',
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialDesignation'),
      headerName: translate(
        'search.referenceTypesTable.headers.materialDesignation'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.materialDesignation'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialNumber'),
      headerName: translate(
        'search.referenceTypesTable.headers.materialNumber'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.materialNumber'
      ),
      valueFormatter: formatMaterialNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('pcmQuantity'),
      headerName: translate('search.referenceTypesTable.headers.pcmQuantity'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.pcmQuantity'
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('pcmSqv'),
      headerName: translate('search.referenceTypesTable.headers.pcmSqv'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.pcmSqv'),
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => formatNumber(params, '1.3-3'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('budgetQuantityCurrentYear'),
      headerName: translate(
        'search.referenceTypesTable.headers.budgetQuantity',
        {
          year: currentYear,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.budgetQuantity',
        { year: currentYear }
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('sqvSapLatestMonth'),
      headerName: translate(
        'search.referenceTypesTable.headers.sqvSapLatestMonth'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.sqvSapLatestMonth'
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => formatNumber(params, '1.3-3'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('gpcLatestYear'),
      headerName: translate('search.referenceTypesTable.headers.gpcLatestYear'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.gpcLatestYear',
        { year: currentYear - 1 }
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => formatNumber(params, '1.3-3'),
    },
    {
      colId: 'averagePrice',
      headerName: translate('search.referenceTypesTable.headers.averagePrice', {
        year: currentYear - 1,
      }),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.volumeUnit',
        {
          year: currentYear - 1,
        }
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => formatNumber(params, '1.3-3'),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('averagePrices'),
          0
        ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('currency'),
      headerName: translate('search.referenceTypesTable.headers.currency'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.currency'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('puUm'),
      headerName: translate('search.referenceTypesTable.headers.puUm'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.puUm'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('procurementType'),
      headerName: translate(
        'search.referenceTypesTable.headers.procurementType'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.procurementType'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('plant'),
      headerName: translate('search.referenceTypesTable.headers.plant'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.plant'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('salesOrganization'),
      headerName: translate(
        'search.referenceTypesTable.headers.salesOrganization'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.salesOrganization'
      ),
      valueFormatter: formatLongValue,
    },
    {
      field: columnDefinitionToReferenceTypeProp('customerGroup'),
      headerName: translate('search.referenceTypesTable.headers.customerGroup'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.customerGroup'
      ),
      valueFormatter: formatLongValue,
    },
    {
      colId: 'actualQuantityLastYear',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 1,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.actualQuantity'
      ),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          0
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'actualQuantityLastYearMinus1',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 2,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.actualQuantity'
      ),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          1
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'actualQuantityLastYearMinus2',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 3,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.actualQuantity'
      ),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          2
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'actualQuantityLastYearMinus3',
      filter: 'agNumberColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.actualQuantity',
        {
          year: currentYear - 4,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.actualQuantity'
      ),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantities'),
          3
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'netSalesLastYear',
      filter: 'agNumberColumnFilter',
      headerName: translate('search.referenceTypesTable.headers.netSales', {
        year: currentYear - 1,
      }),
      headerTooltip: translate('search.referenceTypesTable.tooltips.netSales', {
        year: currentYear - 1,
      }),
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('netSales'),
          0
        ),
      valueFormatter: formatNumber,
    },
    {
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
      field: columnDefinitionToReferenceTypeProp('budgetQuantitySoco'),
      headerName: translate(
        'search.referenceTypesTable.headers.budgetQuantitySoco',
        { year: currentYear }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.budgetQuantitySoco',
        { year: currentYear }
      ),
    },
    {
      colId: 'plannedQuantityCurrentYear',
      headerName: translate(
        'search.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.plannedQuantity'
      ),
      filter: 'agNumberColumnFilter',
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          0
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'plannedQuantityCurrentYearPlus1',
      headerName: translate(
        'search.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 1,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.plannedQuantity'
      ),
      filter: 'agNumberColumnFilter',
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          1
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'plannedQuantityCurrentYearPlus2',
      headerName: translate(
        'search.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 2,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.plannedQuantity'
      ),
      filter: 'agNumberColumnFilter',
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          2
        ),
      valueFormatter: formatNumber,
    },
    {
      colId: 'plannedQuantityCurrentYearPlus3',
      headerName: translate(
        'search.referenceTypesTable.headers.plannedQuantity',
        {
          year: currentYear + 3,
        }
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.plannedQuantity'
      ),
      filter: 'agNumberColumnFilter',
      valueGetter: (params) =>
        valueGetterArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantities'),
          3
        ),
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('projectName'),
      headerName: translate('search.referenceTypesTable.headers.projectName'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.projectName'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('productDescription'),
      headerName: translate(
        'search.referenceTypesTable.headers.productDescription'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.productDescription'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('materialShortDescription'),
      headerName: translate(
        'search.referenceTypesTable.headers.materialShortDescription'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.materialShortDescription'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('productLine'),
      headerName: translate('search.referenceTypesTable.headers.productLine'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.productLine'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('inquiryType'),
      headerName: translate('search.referenceTypesTable.headers.inquiryType'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.inquiryType'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('length'),
      headerName: translate('search.referenceTypesTable.headers.length'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.length'),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('width'),
      headerName: translate('search.referenceTypesTable.headers.width'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.width'),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('height'),
      headerName: translate('search.referenceTypesTable.headers.height'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.height'),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('unitOfDimension'),
      headerName: translate(
        'search.referenceTypesTable.headers.unitOfDimension'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.unitOfDimension'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('weight'),
      headerName: translate('search.referenceTypesTable.headers.weight'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.weight'),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('weightUnit'),
      headerName: translate('search.referenceTypesTable.headers.weightUnit'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.weightUnit'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('volumeCubic'),
      headerName: translate('search.referenceTypesTable.headers.volumeCubic'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.volumeCubic'
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      field: columnDefinitionToReferenceTypeProp('volumeUnit'),
      headerName: translate('search.referenceTypesTable.headers.volumeUnit'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.volumeUnit'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('customer'),
      headerName: translate('search.referenceTypesTable.headers.customer'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.customer'),
      valueFormatter: formatLongValue,
    },
    {
      field: columnDefinitionToReferenceTypeProp('rfq'),
      headerName: translate('search.referenceTypesTable.headers.rfq'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.rfq'),
    },
    {
      field: columnDefinitionToReferenceTypeProp('quotationNumber'),
      headerName: translate(
        'search.referenceTypesTable.headers.quotationNumber'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.quotationNumber'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('toolingCost'),
      headerName: translate('search.referenceTypesTable.headers.toolingCost'),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.toolingCost'
      ),
      filter: 'agNumberColumnFilter',
      valueFormatter: formatNumber,
    },
    {
      colId: 'pcmCalculationDate',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.pcmCalculationDate'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.pcmCalculationDate'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('pcmCalculationDate')
        ),
      valueFormatter: formatDate,
    },
    {
      colId: 'gpcDate',
      filter: 'agDateColumnFilter',
      headerName: translate('search.referenceTypesTable.headers.gpcDate'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.gpcDate'),
      valueGetter: (params) =>
        valueGetterDate(params, columnDefinitionToReferenceTypeProp('gpcDate')),
      valueFormatter: formatDate,
    },
    {
      colId: 'sqvDate',
      filter: 'agDateColumnFilter',
      headerName: translate('search.referenceTypesTable.headers.sqvDate'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.sqvDate'),
      valueGetter: (params) =>
        valueGetterDate(params, columnDefinitionToReferenceTypeProp('sqvDate')),
      valueFormatter: formatDate,
    },
    {
      field: columnDefinitionToReferenceTypeProp('specialProcurement'),
      headerName: translate(
        'search.referenceTypesTable.headers.specialProcurement'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.specialProcurement'
      ),
    },
    {
      field: columnDefinitionToReferenceTypeProp('supplier'),
      headerName: translate('search.referenceTypesTable.headers.supplier'),
      headerTooltip: translate('search.referenceTypesTable.tooltips.supplier'),
    },
    {
      colId: 'purchasePriceValidFrom',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.purchasePriceValidFrom'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.purchasePriceValidFrom'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('purchasePriceValidFrom')
        ),
      valueFormatter: formatDate,
    },
    {
      colId: 'purchasePriceValidUntil',
      filter: 'agDateColumnFilter',
      headerName: translate(
        'search.referenceTypesTable.headers.purchasePriceValidUntil'
      ),
      headerTooltip: translate(
        'search.referenceTypesTable.tooltips.purchasePriceValidUntil'
      ),
      valueGetter: (params) =>
        valueGetterDate(
          params,
          columnDefinitionToReferenceTypeProp('purchasePriceValidUntil')
        ),
      valueFormatter: formatDate,
    },
    {
      colId: 'identificationHash',
      field: columnDefinitionToReferenceTypeProp('identificationHash'),
      hide: true,
      suppressColumnsToolPanel: true,
    },
  ];
  // eslint-disable-next-line max-lines
}
