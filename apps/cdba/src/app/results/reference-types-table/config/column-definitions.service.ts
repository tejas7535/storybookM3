/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import {
  columnDefinitionToReferenceTypeProp,
  ColumnUtilsService,
  currentYear,
  filterParamsForDecimalValues,
  formatLongValue,
  formatMaterialNumber,
  scrambleMaterialDesignation,
  valueGetterDate,
  valueGetterFromArray,
  valueGetterFromArrayOfObjects,
} from '@cdba/shared/components/table';
import { PcmCalculation, ReferenceType } from '@cdba/shared/models';
import { SalesOrganizationDetail } from '@cdba/shared/models/reference-type.model';
import { CurrencyService } from '@cdba/shared/services/currency/currency.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  COLUMN_DEFINITIONS: ColDef[] = [
    {
      field: 'materialDesignation',
      headerName: translate(
        'results.referenceTypesTable.headers.materialDesignation'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialDesignation'
      ),
      valueFormatter: scrambleMaterialDesignation,
      cellRenderer: 'materialDesignationCellRender',
      suppressColumnsToolPanel: true,
      suppressMovable: true,
      pinned: 'left',
      lockPosition: 'left',
      lockPinned: true,
      lockVisible: true,
    },
    {
      field: 'isPcmRow',
      headerName: translate('results.referenceTypesTable.headers.pcmRow'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.pcmRow'),
      cellRenderer: 'pcmCellRenderer',
    },
    {
      field: 'materialNumber',
      headerName: translate(
        'results.referenceTypesTable.headers.materialNumber'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialNumber'
      ),
      valueFormatter: formatMaterialNumber,
    },
    {
      colId: 'pcmQuantity',
      headerName: translate('results.referenceTypesTable.headers.pcmQuantity'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.pcmQuantity'
      ),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'quantity'
        ),
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'pcmSqv',
      headerName: translate('results.referenceTypesTable.headers.pcmSqv'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.pcmSqv'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'cost'
        ),
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
    },
    {
      field: 'budgetQuantityCurrentYear',
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
      field: 'sqvSapLatestMonth',
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
      field: 'gpcLatestYear',
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
        valueGetterFromArray<ReferenceType>(params, 'averagePrices', 0),
    },
    {
      field: 'currency',
      headerName: translate('results.referenceTypesTable.headers.currency'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.currency'),
    },
    {
      field: 'puUm',
      headerName: translate('results.referenceTypesTable.headers.puUm'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.puUm'),
    },
    {
      field: 'procurementType',
      headerName: translate(
        'results.referenceTypesTable.headers.procurementType'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.procurementType'
      ),
    },
    {
      field: 'plant',
      headerName: translate('results.referenceTypesTable.headers.plant'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.plant'),
    },
    {
      field: 'salesOrganizations',
      headerName: translate(
        'results.referenceTypesTable.headers.salesOrganization'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.salesOrganization'
      ),
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, SalesOrganizationDetail>(
          params,
          'salesOrganizationDetails',
          'salesOrganizations'
        ),
      valueFormatter: formatLongValue,
    },
    {
      field: 'customerGroups',
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantityLastYear'),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantityLastYearMinus1'),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantityLastYearMinus2'),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp('actualQuantityLastYearMinus3'),
          3
        ),
    },
    {
      colId: 'netSales',
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
        valueGetterFromArray<ReferenceType>(params, 'netSales', 0),
    },
    {
      field: 'budgetQuantitySoco',
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp('plannedQuantityCurrentYear'),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp(
            'plannedQuantityCurrentYearPlus1'
          ),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp(
            'plannedQuantityCurrentYearPlus2'
          ),
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
        valueGetterFromArray(
          params,
          columnDefinitionToReferenceTypeProp(
            'plannedQuantityCurrentYearPlus3'
          ),
          3
        ),
    },
    {
      colId: 'projectName',
      headerName: translate('results.referenceTypesTable.headers.projectName'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.projectName'
      ),
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'projectName'
        ),
    },
    {
      field: 'productDescription',
      headerName: translate(
        'results.referenceTypesTable.headers.productDescription'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.productDescription'
      ),
    },
    {
      field: 'materialShortDescription',
      headerName: translate(
        'results.referenceTypesTable.headers.materialShortDescription'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialShortDescription'
      ),
    },
    {
      field: 'productLine',
      headerName: translate('results.referenceTypesTable.headers.productLine'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.productLine'
      ),
    },
    {
      field: 'materialClass',
      headerName: translate(
        'results.referenceTypesTable.headers.materialClass'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialClass'
      ),
    },
    {
      field: 'materialClassDescription',
      headerName: translate(
        'results.referenceTypesTable.headers.materialClassDescription'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.materialClassDescription'
      ),
    },
    {
      field: 'inquiryType',
      headerName: translate('results.referenceTypesTable.headers.inquiryType'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.inquiryType'
      ),
    },
    {
      field: 'length',
      headerName: translate('results.referenceTypesTable.headers.length'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.length'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'width',
      headerName: translate('results.referenceTypesTable.headers.width'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.width'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'height',
      headerName: translate('results.referenceTypesTable.headers.height'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.height'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'unitOfDimension',
      headerName: translate(
        'results.referenceTypesTable.headers.unitOfDimension'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.unitOfDimension'
      ),
    },
    {
      field: 'weight',
      headerName: translate('results.referenceTypesTable.headers.weight'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.weight'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'weightUnit',
      headerName: translate('results.referenceTypesTable.headers.weightUnit'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.weightUnit'
      ),
    },
    {
      field: 'volumeCubic',
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
      field: 'volumeUnit',
      headerName: translate('results.referenceTypesTable.headers.volumeUnit'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.volumeUnit'
      ),
    },
    {
      field: 'customers',
      headerName: translate('results.referenceTypesTable.headers.customers'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.customers'
      ),
    },
    {
      colId: 'rfq',
      headerName: translate('results.referenceTypesTable.headers.rfq'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.rfq'),
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'rfq'
        ),
    },
    {
      field: 'quotationNumber',
      headerName: translate(
        'results.referenceTypesTable.headers.quotationNumber'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.quotationNumber'
      ),
    },
    {
      colId: 'toolingCost',
      filter: 'agNumberColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.toolingCost'),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.toolingCost'
      ),
      type: 'numericColumn',
      valueGetter: (params) =>
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'toolingCost'
        ),
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
        valueGetterFromArrayOfObjects<ReferenceType, PcmCalculation>(
          params,
          'pcmCalculations',
          'date'
        ),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      colId: 'gpcDate',
      filter: 'agDateColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.gpcDate'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.gpcDate'),
      valueGetter: (params) =>
        valueGetterDate<ReferenceType>(params, 'gpcDate'),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      colId: 'sqvDate',
      filter: 'agDateColumnFilter',
      headerName: translate('results.referenceTypesTable.headers.sqvDate'),
      headerTooltip: translate('results.referenceTypesTable.tooltips.sqvDate'),
      valueGetter: (params) =>
        valueGetterDate<ReferenceType>(params, 'sqvDate'),
      valueFormatter: this.columnUtilsService.formatDate,
    },
    {
      field: 'specialProcurement',
      headerName: translate(
        'results.referenceTypesTable.headers.specialProcurement'
      ),
      headerTooltip: translate(
        'results.referenceTypesTable.tooltips.specialProcurement'
      ),
    },
    {
      field: 'supplier',
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
        valueGetterDate<ReferenceType>(params, 'purchasePriceValidFrom'),
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
        valueGetterDate<ReferenceType>(params, 'purchasePriceValidUntil'),
      valueFormatter: this.columnUtilsService.formatDate,
    },
  ];

  constructor(
    private readonly columnUtilsService: ColumnUtilsService,
    private readonly currencyService: CurrencyService
  ) {}
  // eslint-disable-next-line max-lines
}
