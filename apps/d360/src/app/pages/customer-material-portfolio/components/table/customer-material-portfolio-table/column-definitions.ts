import { ColDef } from 'ag-grid-enterprise';

import { portfolioStatusValues } from '../../../../../feature/customer-material-portfolio/cmp-modal-types';
import {
  demandCharacteristicOptions,
  materialClassificationOptions,
} from '../../../../../feature/material-customer/model';
import { TrafficLightCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/traffic-light-cell-renderer/traffic-light-cell-renderer.component';
import {
  trafficLightValueFormatter,
  trafficLightValues,
} from '../../../../../shared/components/ag-grid/traffic-light-shared-functions';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import {
  demandCharacteristicValueFormatter,
  portfolioStatusValueFormatter,
} from './../../../../../shared/ag-grid/grid-value-formatter';
import { TrafficLightTooltipComponent } from './../../../../../shared/components/ag-grid/traffic-light-tooltip/traffic-light-tooltip.component';

export type colType = (ColDef & {
  visible: boolean;
  alwaysVisible: boolean;
})[];

export type CMPColId = colType[number]['colId'];

export function columnDefinitions(
  agGridLocalizationService: AgGridLocalizationService
): (ColDef & {
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  return [
    {
      colId: 'tlMessageType',
      visible: true,
      alwaysVisible: false,
      cellRenderer: TrafficLightCellRendererComponent,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: trafficLightValues,
        valueFormatter: trafficLightValueFormatter,
      },
      tooltipComponent: TrafficLightTooltipComponent,
      tooltipField: 'tlMessage',
    },
    {
      colId: 'portfolioStatus',
      visible: true,
      alwaysVisible: true,
      filter: 'agSetColumnFilter',
      valueFormatter: portfolioStatusValueFormatter(),
      filterParams: {
        values: portfolioStatusValues,
        valueFormatter: portfolioStatusValueFormatter(),
      },
    },
    {
      colId: 'materialDescription',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'customerMaterialNumber',
      visible: true,
      alwaysVisible: false,
      cellRenderer: 'customerMaterialNumberCellRenderer',
    },
    {
      colId: 'packagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'materialClassification',
      visible: true,
      alwaysVisible: false,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: materialClassificationOptions,
      },
    },
    {
      colId: 'stochasticType',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productionPlant',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productionSegment',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productionLine',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productLine',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'productLineText',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'demandCharacteristic',
      visible: true,
      alwaysVisible: true,
      valueFormatter: demandCharacteristicValueFormatter(),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: demandCharacteristicOptions,
        valueFormatter: demandCharacteristicValueFormatter(),
      },
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

    // Recommendation customer

    {
      colId: 'successorMaterial',
      visible: true,
      alwaysVisible: true,
    },
    {
      colId: 'successorMaterialDescription',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorCustomerMaterialNumber',
      visible: true,
      alwaysVisible: false,
      cellRenderer: 'customerMaterialNumberCellRenderer',
      cellRendererParams: {
        materialNumberField: 'successorMaterial',
        customerMaterialNumberField: 'successorCustomerMaterialNumber',
        matCountNumberField: 'successorCustomerMaterialNumberCount',
      },
    },
    {
      colId: 'successorMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'successorMaterialClassification',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorStochasticType',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorProductionPlant',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorProductionSegment',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorProductionLine',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorProductLine',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorProductLineText',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorSchaefflerMaterial',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorSchaefflerMaterialDescription',
      visible: true,
      alwaysVisible: false,
    },
    {
      colId: 'successorSchaefflerMaterialPackagingSize',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'deliveryQuantity18Months',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      colId: 'orderQuantity',
      visible: true,
      alwaysVisible: false,
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
  ];
}
