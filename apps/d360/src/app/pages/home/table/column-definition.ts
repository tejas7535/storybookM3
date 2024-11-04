import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-community';

import { portfolioStatusValues } from '../../../feature/customer-material-portfolio/cmp-modal-types';
import {
  AbcxClassification,
  abcxClassifications,
  demandCharacteristics,
  materialClassifications,
} from '../../../feature/material-customer/model';
import {
  demandCharacteristicValueFormatter,
  portfolioStatusValueFormatter,
} from '../../../shared/ag-grid/grid-value-formatter';
import { AgGridLocalizationService } from '../../../shared/services/ag-grid-localization.service';

function translateAbcxClassificationValue(value?: string) {
  return translate(
    `field.abcxClassification.value.${(value as AbcxClassification) || '<empty>'}`,
    {}
  );
}

function translateForecastMaintainedValue(value?: boolean) {
  return value
    ? translate(`field.forecastMaintained.value.true`, {})
    : translate(`field.forecastMaintained.value.false`, {});
}

export function columnDefinitions(
  agGridLocalizationService: AgGridLocalizationService
): (ColDef & {
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  return [
    { colId: 'region', visible: true, alwaysVisible: false },
    { colId: 'salesArea', visible: true, alwaysVisible: false },
    { colId: 'salesOrg', visible: true, alwaysVisible: true },
    { colId: 'mainCustomerNumber', visible: true, alwaysVisible: true },
    { colId: 'mainCustomerName', visible: true, alwaysVisible: false },
    { colId: 'customerNumber', visible: true, alwaysVisible: true },
    { colId: 'customerName', visible: true, alwaysVisible: true },
    { colId: 'customerCountry', visible: true, alwaysVisible: true },
    { colId: 'sector', visible: true, alwaysVisible: true },
    { colId: 'sectorManagement', visible: true, alwaysVisible: true },
    {
      colId: 'customerClassification',
      visible: true,
      alwaysVisible: false,
    },
    { colId: 'deliveryPlant', visible: true, alwaysVisible: true },
    { colId: 'planningPlant', visible: true, alwaysVisible: true },
    { colId: 'materialNumber', visible: true, alwaysVisible: true },
    {
      colId: 'materialDescription',
      visible: true,
      alwaysVisible: true,
    },
    { colId: 'mrpGroup', visible: true, alwaysVisible: false },
    { colId: 'productionPlant', visible: true, alwaysVisible: false },
    {
      colId: 'productionPlantName',
      visible: true,
      alwaysVisible: false,
    },
    { colId: 'productionSegment', visible: true, alwaysVisible: false },
    { colId: 'productionLine', visible: true, alwaysVisible: false },
    {
      colId: 'packagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'customerMaterialNumber',
      visible: true,
      alwaysVisible: false,
      cellRenderer: 'customerMaterialNumberCellRenderer',
    },
    {
      colId: 'materialClassification',
      visible: true,
      alwaysVisible: true,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: materialClassifications,
      },
    },
    {
      colId: 'demandCharacteristic',
      valueFormatter: demandCharacteristicValueFormatter(),
      visible: true,
      alwaysVisible: true,
      filterParams: {
        values: demandCharacteristics,
        valueFormatter: demandCharacteristicValueFormatter(),
      },
    },
    {
      colId: 'currentRLTSchaeffler',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'currentRLTCustomer',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'portfolioStatus',
      visible: true,
      alwaysVisible: true,
      valueFormatter: portfolioStatusValueFormatter(),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: portfolioStatusValues,
        valueFormatter: portfolioStatusValueFormatter(),
      },
    },
    { colId: 'stochasticType', visible: true, alwaysVisible: false },
    {
      colId: 'successorSchaefflerMaterial',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'successorSchaefflerMaterialDescription',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'successorSchaefflerMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'successorMaterialCustomer',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'successorCustomerMaterialDescription',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'successorCustomerMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'pfStatusAutoSwitch',
      visible: true,
      alwaysVisible: true,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      colId: 'repDate',
      visible: true,
      alwaysVisible: true,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    { colId: 'accountOwner', visible: true, alwaysVisible: false },
    { colId: 'internalSales', visible: true, alwaysVisible: false },
    { colId: 'demandPlanner', visible: true, alwaysVisible: false },
    { colId: 'gkam', visible: true, alwaysVisible: false },
    { colId: 'kam', visible: true, alwaysVisible: false },
    { colId: 'gkamNumber', visible: true, alwaysVisible: false },
    { colId: 'gkamName', visible: true, alwaysVisible: false },
    { colId: 'subKeyAccount', visible: true, alwaysVisible: false },
    { colId: 'subKeyAccountName', visible: true, alwaysVisible: false },
    { colId: 'productLine', visible: true, alwaysVisible: false },
    { colId: 'productLineText', visible: true, alwaysVisible: false },
    {
      colId: 'forecastMaintained',
      visible: true,
      alwaysVisible: false,
      valueGetter: (params: any) =>
        translateForecastMaintainedValue(params.data.forecastMaintained),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [true, false] as const,
        valueFormatter: (params: any) =>
          translateForecastMaintainedValue(params.value),
      },
    },
    {
      colId: 'forecastValidated',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'forecastValidatedFrom',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      colId: 'forecastValidatedTo',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      colId: 'forecastValidatedAt',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      colId: 'forecastValidatedBy',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productCluster',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'materialNumberS4',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'abcxClassification',
      visible: true,
      alwaysVisible: false,
      valueGetter: (params: any) =>
        translateAbcxClassificationValue(params.data.abcxClassification),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: abcxClassifications,
        // FYI: here, '' value becomes null in agGrid :-(
        valueFormatter: (params: any) =>
          translateAbcxClassificationValue(params.value),
      },
    },
    { colId: 'gpsd', visible: true, alwaysVisible: false },
    { colId: 'gpsdName', visible: true, alwaysVisible: false },
  ] as const;
}

export type ColId = ReturnType<typeof columnDefinitions>[number]['colId'];
