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
      minWidth: 180,
      maxWidth: 180,
    },
    { colId: 'materialDescription', flex: 1 },
    {
      colId: 'customerMaterialNumber',
      cellRenderer: 'customerMaterialNumberCellRenderer',
      flex: 1,
    },
    {
      colId: 'materialClassification',
      minWidth: 80,
      maxWidth: 80,
    },
    {
      colId: 'demandPlanValue',
      valueFormatter: agGridLocalizationService.numberFormatter,
      minWidth: 120,
      flex: 1,
    },
  ];
}
