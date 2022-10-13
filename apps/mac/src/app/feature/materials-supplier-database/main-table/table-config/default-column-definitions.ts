import { ColDef } from 'ag-grid-enterprise';

import { HeaderTooltipComponent } from '../header-tooltip/header-tooltip.component';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
  enablePivot: false,
  headerClass: ['text-caption', 'leading-6', 'font-medium'],
  tooltipComponent: HeaderTooltipComponent,
};
