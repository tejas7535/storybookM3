import { ColDef } from 'ag-grid-enterprise';

import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';

export function getColumnDefinitions(
  agGridLocalizationService: AgGridLocalizationService
): ColDef[] {
  return [
    {
      colId: 'materialNumber',
      filter: undefined,
      filterParams: undefined,
      width: 170,
    },
    {
      colId: 'materialDescription',
      width: 180,
    },
    {
      colId: 'customerMaterialNumber',
      cellRenderer: 'customerMaterialNumberCellRenderer',
      width: 160,
    },
    {
      colId: 'materialClassification',
      width: 80,
    },
    {
      colId: 'demandPlanValue',
      valueFormatter: agGridLocalizationService.numberFormatter,
      width: 120,
    },
  ];
}
