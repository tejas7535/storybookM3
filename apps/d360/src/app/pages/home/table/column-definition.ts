import { translate } from '@jsverse/transloco';
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterFunc,
  ValueGetterFunc,
} from 'ag-grid-community';

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

type CustomerMaterialColumnDefinitionExt<COL_ID extends string> =
  ColDef<COL_ID> & {
    /**
     * NOT affects the value copied from cell values to clipboard
     * Does NOT affect the valus in (set) filters
     */
    cellRenderer?: string | ((params: ICellRendererParams) => any);
    /**
     * also affects the value copied from cell values to clipboard
     * Does NOT affect the valus in (set) filters
     */
    valueGetter?: string | ValueGetterFunc;
    /**
     * NOT affects the value copied from cell values to clipboard
     * Does NOT affect the valus in (set) filters
     */
    valueFormatter?: string | ValueFormatterFunc;
    visible?: boolean;
    alwaysVisible?: boolean;
    filter?: string;
    filterParams?: {
      valueFormatter?: string | ValueFormatterFunc;
      values?: Readonly<any[]>;
    };
  };

export type CustomerMaterialColumnDefinition =
  CustomerMaterialColumnDefinitionExt<ColId>;

/**
 * avoids recursive ColId definition and still allows type-checking the column definitions.
 * Use-case: Inform developer if e.g. some agGrid column definition is used that is not mapped to agGrid invocation
 */
function colDef<COL_ID extends string>(
  def: CustomerMaterialColumnDefinitionExt<COL_ID>
) {
  return def;
}

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
) {
  return [
    colDef({ colId: 'region', visible: true, alwaysVisible: false }),
    colDef({ colId: 'salesArea', visible: true, alwaysVisible: false }),
    colDef({ colId: 'salesOrg', visible: true, alwaysVisible: true }),
    colDef({ colId: 'mainCustomerNumber', visible: true, alwaysVisible: true }),
    colDef({ colId: 'mainCustomerName', visible: true, alwaysVisible: false }),
    colDef({ colId: 'customerNumber', visible: true, alwaysVisible: true }),
    colDef({ colId: 'customerName', visible: true, alwaysVisible: true }),
    colDef({ colId: 'customerCountry', visible: true, alwaysVisible: true }),
    colDef({ colId: 'sector', visible: true, alwaysVisible: true }),
    colDef({ colId: 'sectorManagement', visible: true, alwaysVisible: true }),
    colDef({
      colId: 'customerClassification',
      visible: true,
      alwaysVisible: false,
    }),
    colDef({ colId: 'deliveryPlant', visible: true, alwaysVisible: true }),
    colDef({ colId: 'planningPlant', visible: true, alwaysVisible: true }),
    colDef({ colId: 'materialNumber', visible: true, alwaysVisible: true }),
    colDef({
      colId: 'materialDescription',
      visible: true,
      alwaysVisible: true,
    }),
    colDef({ colId: 'mrpGroup', visible: true, alwaysVisible: false }),
    colDef({ colId: 'productionPlant', visible: true, alwaysVisible: false }),
    colDef({
      colId: 'productionPlantName',
      visible: true,
      alwaysVisible: false,
    }),
    colDef({ colId: 'productionSegment', visible: true, alwaysVisible: false }),
    colDef({ colId: 'productionLine', visible: true, alwaysVisible: false }),
    colDef({
      colId: 'packagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'customerMaterialNumber',
      visible: true,
      alwaysVisible: false,
      cellRenderer: 'customerMaterialNumberCellRenderer',
    }),
    colDef({
      colId: 'materialClassification',
      visible: true,
      alwaysVisible: true,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: materialClassifications,
      },
    }),
    colDef({
      colId: 'demandCharacteristic',
      valueFormatter: demandCharacteristicValueFormatter(),
      visible: true,
      alwaysVisible: true,
      filterParams: {
        values: demandCharacteristics,
        valueFormatter: demandCharacteristicValueFormatter(),
      },
    }),
    colDef({
      colId: 'currentRLTSchaeffler',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'currentRLTCustomer',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'portfolioStatus',
      visible: true,
      alwaysVisible: true,
      valueFormatter: portfolioStatusValueFormatter(),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: portfolioStatusValues,
        valueFormatter: portfolioStatusValueFormatter(),
      },
    }),
    colDef({ colId: 'stochasticType', visible: true, alwaysVisible: false }),
    colDef({
      colId: 'successorSchaefflerMaterial',
      visible: true,
      alwaysVisible: true,
    }),
    colDef({
      colId: 'successorSchaefflerMaterialDescription',
      visible: true,
      alwaysVisible: true,
    }),
    colDef({
      colId: 'successorSchaefflerMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'successorMaterialCustomer',
      visible: true,
      alwaysVisible: true,
    }),
    colDef({
      colId: 'successorCustomerMaterialDescription',
      visible: true,
      alwaysVisible: true,
    }),
    colDef({
      colId: 'successorCustomerMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'pfStatusAutoSwitch',
      visible: true,
      alwaysVisible: true,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    }),
    colDef({
      colId: 'repDate',
      visible: true,
      alwaysVisible: true,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    }),
    colDef({ colId: 'accountOwner', visible: true, alwaysVisible: false }),
    colDef({ colId: 'internalSales', visible: true, alwaysVisible: false }),
    colDef({ colId: 'demandPlanner', visible: true, alwaysVisible: false }),
    colDef({ colId: 'gkam', visible: true, alwaysVisible: false }),
    colDef({ colId: 'kam', visible: true, alwaysVisible: false }),
    colDef({ colId: 'gkamNumber', visible: true, alwaysVisible: false }),
    colDef({ colId: 'gkamName', visible: true, alwaysVisible: false }),
    colDef({ colId: 'subKeyAccount', visible: true, alwaysVisible: false }),
    colDef({ colId: 'subKeyAccountName', visible: true, alwaysVisible: false }),
    colDef({ colId: 'productLine', visible: true, alwaysVisible: false }),
    colDef({ colId: 'productLineText', visible: true, alwaysVisible: false }),
    colDef({
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
    }),
    colDef({
      colId: 'forecastValidated',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    }),
    colDef({
      colId: 'forecastValidatedFrom',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    }),
    colDef({
      colId: 'forecastValidatedTo',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    }),
    colDef({
      colId: 'forecastValidatedAt',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    }),
    colDef({
      colId: 'forecastValidatedBy',
      visible: true,
      alwaysVisible: false,
    }),
    colDef({
      colId: 'productCluster',
      visible: true,
      alwaysVisible: false,
    }),
    colDef({
      colId: 'materialNumberS4',
      visible: true,
      alwaysVisible: false,
    }),
    colDef({
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
    }),
    colDef({ colId: 'gpsd', visible: true, alwaysVisible: false }),
    colDef({ colId: 'gpsdName', visible: true, alwaysVisible: false }),
  ] as const;
}

export type ColId = ReturnType<typeof columnDefinitions>[number]['colId'];
