import { ColDef } from 'ag-grid-enterprise';

import { replacementTypeValues } from '../../../../feature/internal-material-replacement/model';
import { replacementTypeValueFormatter } from '../../../../shared/ag-grid/grid-value-formatter';
import { TrafficLightCellRendererComponent } from '../../../../shared/components/ag-grid/cell-renderer/traffic-light-cell-renderer/traffic-light-cell-renderer.component';
import {
  trafficLightValueFormatter,
  trafficLightValues,
} from '../../../../shared/components/ag-grid/traffic-light-shared-functions';
import { TrafficLightTooltipComponent } from '../../../../shared/components/ag-grid/traffic-light-tooltip/traffic-light-tooltip.component';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';

export function getIMRColumnDefinitions(
  agGridLocalizationService: AgGridLocalizationService,
  selectableOptionsService: SelectableOptionsService
): (ColDef & {
  property: string;
})[] {
  return [
    {
      property: 'region',
      colId: 'material_customer.column.region',
    },
    {
      property: 'salesArea',
      colId: 'material_customer.column.salesArea',
      ...selectableOptionsService.getFilterColDef('salesArea'),
    },
    {
      property: 'salesOrg',
      colId: 'material_customer.column.salesOrg',
      ...selectableOptionsService.getFilterColDef(
        'salesOrg',
        DisplayFunctions.displayFnId,
        null
      ),
    },
    {
      property: 'customerNumber',
      colId: 'material_customer.column.customerNumber',
      filter: 'agTextColumnFilter',
    },
    {
      property: 'predecessorMaterial',
      colId: 'internal_material_replacement.column.predecessorMaterial',
      filter: 'agTextColumnFilter',
    },
    {
      property: 'successorMaterial',
      colId: 'internal_material_replacement.column.successorMaterial',
      filter: 'agTextColumnFilter',
    },
    {
      property: 'replacementDate',
      colId: 'internal_material_replacement.column.replacementDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      property: 'cutoverDate',
      colId: 'internal_material_replacement.column.cutoverDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      property: 'startOfProduction',
      colId: 'internal_material_replacement.column.startOfProduction',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      property: 'replacementType',
      colId: 'internal_material_replacement.column.replacementType',
      valueFormatter: replacementTypeValueFormatter(),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: replacementTypeValues,
        valueFormatter: replacementTypeValueFormatter(),
      },
    },
    {
      property: 'lastChangeDate',
      colId: 'internal_material_replacement.column.lastChangeDate',
      valueFormatter: agGridLocalizationService.dateFormatter,
      filter: 'agDateColumnFilter',
    },
    {
      property: 'lastChangeUser',
      colId: 'internal_material_replacement.column.lastChangeUser',
      filter: 'agTextColumnFilter',
    },
    {
      property: 'note',
      colId: 'internal_material_replacement.column.note',
      filter: 'agTextColumnFilter',
    },
    {
      property: 'tlMessageType',
      colId: 'internal_material_replacement.column.statusMasterData.rootString',
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
      property: 'countBCTotal',
      colId: 'internal_material_replacement.column.countBCTotal',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      property: 'countBCAutomaticAccepted',
      colId: 'internal_material_replacement.column.countBCAutomaticAccepted',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      property: 'countBCManualAccepted',
      colId: 'internal_material_replacement.column.countBCManualAccepted',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      property: 'countBCManualRejected',
      colId: 'internal_material_replacement.column.countBCManualRejected',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      property: 'countBCVeto',
      colId: 'internal_material_replacement.column.countBCVeto',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
    {
      property: 'countBCOpen',
      colId: 'internal_material_replacement.column.countBCOpen',
      valueFormatter: agGridLocalizationService.numberFormatter,
      filter: 'agNumberColumnFilter',
    },
  ] as const;
}
