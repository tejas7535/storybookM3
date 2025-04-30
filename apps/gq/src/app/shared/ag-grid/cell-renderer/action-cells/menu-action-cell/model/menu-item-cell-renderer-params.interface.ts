import { ICellRendererParams } from 'ag-grid-enterprise';

import { MenuItem } from './menu-item.interface';

export interface MenuItemCellRendererParams extends ICellRendererParams {
  menuItems: MenuItem[];
  menuDisabled: boolean;
}
