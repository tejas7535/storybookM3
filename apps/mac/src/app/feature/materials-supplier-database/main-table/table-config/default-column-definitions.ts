import { ColDef } from 'ag-grid-community';

import { HeaderTooltipComponent } from '../components/header-tooltip/header-tooltip.component';

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: true,
  resizable: true,
  headerClass: ['text-caption', 'leading-6', 'font-medium'],
  tooltipComponent: HeaderTooltipComponent,
  tooltipComponentParams: {
    translate: true,
  },
};
