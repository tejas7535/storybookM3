// tslint:disable:max-file-line-count
import { ColDef } from '@ag-grid-community/core';
import { translate } from '@ngneat/transloco';

import {
  currentYear,
  formatDate,
  formatNumber,
  valueGetterArray,
  valueGetterDate,
} from './column-utils';

export const COLUMN_DEFINITIONS: { [key: string]: ColDef } = {
  materialDesignation: {
    field: 'materialDesignation',
    headerName: translate(
      'search.referenceTypesTable.headers.materialDesignation'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.materialDesignation'
    ),
    checkboxSelection: true,
  },
  materialNumber: {
    field: 'materialNumber',
    headerName: translate('search.referenceTypesTable.headers.materialNumber'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.materialNumber'
    ),
  },
  pcmQuantity: {
    field: 'pcmQuantity',
    headerName: translate('search.referenceTypesTable.headers.pcmQuantity'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.pcmQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  pcmSqv: {
    field: 'pcmSqv',
    headerName: translate('search.referenceTypesTable.headers.pcmSqv'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.pcmSqv'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  budgetQuantityCurrentYear: {
    field: 'budgetQuantityCurrentYear',
    headerName: translate('search.referenceTypesTable.headers.budgetQuantity', {
      year: currentYear,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.budgetQuantity',
      { year: currentYear }
    ),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  sqvSapLatestMonth: {
    field: 'sqvSapLatestMonth',
    headerName: translate(
      'search.referenceTypesTable.headers.sqvSapLatestMonth'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.sqvSapLatestMonth'
    ),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  gpcLatestYear: {
    field: 'gpcLatestYear',
    headerName: translate('search.referenceTypesTable.headers.gpcLatestYear', {
      year: currentYear,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.gpcLatestYear',
      { year: currentYear - 1 }
    ),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  averagePrice: {
    headerName: translate('search.referenceTypesTable.headers.averagePrice', {
      year: currentYear - 1,
    }),
    headerTooltip: translate('search.referenceTypesTable.tooltips.volumeUnit', {
      year: currentYear - 1,
    }),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
    valueGetter: (params) => valueGetterArray(params, 'averagePrices', 0),
  },
  currency: {
    field: 'currency',
    headerName: translate('search.referenceTypesTable.headers.currency'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.currency'),
  },
  puUm: {
    field: 'puUm',
    headerName: translate('search.referenceTypesTable.headers.puUm'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.puUm'),
  },
  procurementType: {
    field: 'procurementType',
    headerName: translate('search.referenceTypesTable.headers.procurementType'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.procurementType'
    ),
  },
  plant: {
    field: 'plant',
    headerName: translate('search.referenceTypesTable.headers.plant'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.plant'),
  },
  salesOrganization: {
    field: 'salesOrganization',
    headerName: translate(
      'search.referenceTypesTable.headers.salesOrganization'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.salesOrganization'
    ),
  },
  customerGroup: {
    field: 'customerGroup',
    headerName: translate('search.referenceTypesTable.headers.customerGroup'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.customerGroup'
    ),
  },
  actualQuantityLastYear: {
    filter: 'agNumberColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.actualQuantity', {
      year: currentYear - 1,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.actualQuantity'
    ),
    valueGetter: (params) => valueGetterArray(params, 'actualQuantities', 0),
    valueFormatter: formatNumber,
  },
  actualQuantityLastYearMinus1: {
    filter: 'agNumberColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.actualQuantity', {
      year: currentYear - 2,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.actualQuantity'
    ),
    valueGetter: (params) => valueGetterArray(params, 'actualQuantities', 1),
    valueFormatter: formatNumber,
  },
  actualQuantityLastYearMinus2: {
    filter: 'agNumberColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.actualQuantity', {
      year: currentYear - 3,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.actualQuantity'
    ),
    valueGetter: (params) => valueGetterArray(params, 'actualQuantities', 2),
    valueFormatter: formatNumber,
  },
  actualQuantityLastYearMinus3: {
    filter: 'agNumberColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.actualQuantity', {
      year: currentYear - 4,
    }),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.actualQuantity'
    ),
    valueGetter: (params) => valueGetterArray(params, 'actualQuantities', 3),
    valueFormatter: formatNumber,
  },
  netSalesLastYear: {
    filter: 'agNumberColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.netSales', {
      year: currentYear - 1,
    }),
    headerTooltip: translate('search.referenceTypesTable.tooltips.netSales', {
      year: currentYear - 1,
    }),
    valueGetter: (params) => valueGetterArray(params, 'netSales', 0),
    valueFormatter: formatNumber,
  },

  netSalesLastYearMinus1: {
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
    headerName: translate('search.referenceTypesTable.headers.netSales', {
      year: currentYear - 2,
    }),
    headerTooltip: translate('search.referenceTypesTable.tooltips.netSales', {
      year: currentYear - 2,
    }),
    valueGetter: (params) => valueGetterArray(params, 'netSales', 1),
  },
  netSalesLastYearMinus2: {
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
    headerName: translate('search.referenceTypesTable.headers.netSales', {
      year: currentYear - 3,
    }),
    headerTooltip: translate('search.referenceTypesTable.tooltips.netSales', {
      year: currentYear - 3,
    }),
    valueGetter: (params) => valueGetterArray(params, 'netSales', 2),
  },
  netSalesLastYearMinus3: {
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
    headerName: translate('search.referenceTypesTable.headers.netSales', {
      year: currentYear - 4,
    }),
    headerTooltip: translate('search.referenceTypesTable.tooltips.netSales', {
      year: currentYear - 4,
    }),
    valueGetter: (params) => valueGetterArray(params, 'netSales', 3),
  },
  budgetQuantitySoco: {
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
    field: 'budgetQuantitySoco',
    headerName: translate(
      'search.referenceTypesTable.headers.budgetQuantitySoco',
      { year: currentYear }
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.budgetQuantitySoco',
      { year: currentYear }
    ),
  },
  plannedQuantityCurrentYear: {
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
    valueGetter: (params) => valueGetterArray(params, 'plannedQuantities', 0),
    valueFormatter: formatNumber,
  },
  plannedQuantityCurrentYearPlus1: {
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
    valueGetter: (params) => valueGetterArray(params, 'plannedQuantities', 1),
    valueFormatter: formatNumber,
  },
  plannedQuantityCurrentYearPlus2: {
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
    valueGetter: (params) => valueGetterArray(params, 'plannedQuantities', 2),
    valueFormatter: formatNumber,
  },
  plannedQuantityCurrentYearPlus3: {
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
    valueGetter: (params) => valueGetterArray(params, 'plannedQuantities', 3),
    valueFormatter: formatNumber,
  },
  projectName: {
    field: 'projectName',
    headerName: translate('search.referenceTypesTable.headers.projectName'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.projectName'),
  },
  productDescription: {
    field: 'productDescription',
    headerName: translate(
      'search.referenceTypesTable.headers.productDescription'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.productDescription'
    ),
  },
  msd: {
    field: 'materialShortDescription',
    headerName: translate(
      'search.referenceTypesTable.headers.materialShortDescription'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.materialShortDescription'
    ),
  },
  productLine: {
    field: 'productLine',
    headerName: translate('search.referenceTypesTable.headers.productLine'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.productLine'),
  },
  inquiryType: {
    field: 'inquiryType',
    headerName: translate('search.referenceTypesTable.headers.inquiryType'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.inquiryType'),
  },
  length: {
    field: 'length',
    headerName: translate('search.referenceTypesTable.headers.length'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.length'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  width: {
    field: 'width',
    headerName: translate('search.referenceTypesTable.headers.width'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.width'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  height: {
    field: 'height',
    headerName: translate('search.referenceTypesTable.headers.height'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.height'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  unitOfDimension: {
    field: 'unitOfDimension',
    headerName: translate('search.referenceTypesTable.headers.unitOfDimension'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.unitOfDimension'
    ),
  },
  weight: {
    field: 'weight',
    headerName: translate('search.referenceTypesTable.headers.weight'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.weight'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  weightUnit: {
    field: 'weightUnit',
    headerName: translate('search.referenceTypesTable.headers.weightUnit'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.weightUnit'),
  },
  volumeCubic: {
    field: 'volumeCubic',
    headerName: translate('search.referenceTypesTable.headers.volumeCubic'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.volumeCubic'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  volumeUnit: {
    field: 'volumeUnit',
    headerName: translate('search.referenceTypesTable.headers.volumeUnit'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.volumeUnit'),
  },
  customer: {
    field: 'customer',
    headerName: translate('search.referenceTypesTable.headers.customer'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.customer'),
  },
  rfq: {
    field: 'rfq',
    headerName: translate('search.referenceTypesTable.headers.rfq'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.rfq'),
  },
  quotationNumber: {
    field: 'quotationNumber',
    headerName: translate('search.referenceTypesTable.headers.quotationNumber'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.quotationNumber'
    ),
  },
  toolingCost: {
    field: 'toolingCost',
    headerName: translate('search.referenceTypesTable.headers.toolingCost'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.toolingCost'),
    filter: 'agNumberColumnFilter',
    valueFormatter: formatNumber,
  },
  pcmCalculationDate: {
    filter: 'agDateColumnFilter',
    headerName: translate(
      'search.referenceTypesTable.headers.pcmCalculationDate'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.pcmCalculationDate'
    ),
    valueGetter: (params) => valueGetterDate(params, 'pcmCalculationDate'),
    valueFormatter: formatDate,
  },
  saleableItem: {
    field: 'saleableItem',
    headerName: translate('search.referenceTypesTable.headers.saleableItem'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.saleableItem'
    ),
  },
  gpcDate: {
    filter: 'agDateColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.gpcDate'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.gpcDate', {
      year: currentYear,
    }),
    valueGetter: (params) => valueGetterDate(params, 'gpcDate'),
    valueFormatter: formatDate,
  },
  sqvDate: {
    filter: 'agDateColumnFilter',
    headerName: translate('search.referenceTypesTable.headers.sqvDate'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.sqvDate'),
    valueGetter: (params) => valueGetterDate(params, 'sqvDate'),
    valueFormatter: formatDate,
  },
  specialProcurement: {
    field: 'specialProcurement',
    headerName: translate(
      'search.referenceTypesTable.headers.specialProcurement'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.specialProcurement'
    ),
  },
  supplier: {
    field: 'supplier',
    headerName: translate('search.referenceTypesTable.headers.supplier'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.supplier'),
  },
  purchasePriceValidFrom: {
    filter: 'agDateColumnFilter',
    headerName: translate(
      'search.referenceTypesTable.headers.purchasePriceValidFrom'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.purchasePriceValidFrom'
    ),
    valueGetter: (params) => valueGetterDate(params, 'purchasePriceValidFrom'),
    valueFormatter: formatDate,
  },
  purchasePriceValidUntil: {
    filter: 'agDateColumnFilter',
    headerName: translate(
      'search.referenceTypesTable.headers.purchasePriceValidUntil'
    ),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.purchasePriceValidUntil'
    ),
    valueGetter: (params) => valueGetterDate(params, 'purchasePriceValidUntil'),
    valueFormatter: formatDate,
  },
};
