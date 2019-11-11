import { createAction, props, union } from '@ngrx/store';

import { SidebarMode } from '@schaeffler/shared/ui-components';

export const toggleSidebar = createAction(
  '[Sidebar] Toggle Sidebar',
  props<{ sidebarMode: SidebarMode }>()
);
export const setSidebarMode = createAction(
  '[Sidebar] Set Sidebar Mode',
  props<{ sidebarMode: SidebarMode }>()
);

const all = union({ toggleSidebar, setSidebarMode });

export type SidebarActions = typeof all;
