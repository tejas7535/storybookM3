import { Icon } from '@schaeffler/shared/ui-components';

import { SidebarElement } from './sidebar-element';

export const SIDEBAR_ELEMENTS_MOCK: SidebarElement[] = [
  {
    text: 'Menu point 1',
    icon: new Icon('menu-point-icon-1'),
    link: '/menu-point-1'
  },
  {
    text: 'Menu point 2',
    icon: new Icon('menu-point-icon-2'),
    link: '/menu-point-2'
  },
  {
    text: 'Menu point 3',
    icon: new Icon('menu-point-icon-3'),
    link: '/menu-point-3'
  }
];
