import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { Icon } from '@schaeffler/shared/icons';
import {
  SidebarElement,
  UserMenuEntry
} from '@schaeffler/shared/ui-components';

@Component({
  selector: 'schaeffler-frontend-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public username = 'Test User';
  public userMenuEntries = [
    new UserMenuEntry('logout', translate('general.logout'))
  ];

  public platformTitle = translate('general.appName');

  public sidebarElements: SidebarElement[] = [
    {
      text: translate('navigation.home'),
      icon: new Icon('icon-house'),
      link: '/home'
    },
    {
      text: translate('navigation.notFound'),
      icon: new Icon('icon-house'),
      link: '/second'
    }
  ];

  public settingsSidebarOpen = false;

  /**
   * User Menu Entry Clicked.
   */
  public userMenuClicked(key: string): void {
    console.log(`You clicked the following the menu entry: ${key}`);
  }

  public onChangeSettingsSidebar(open: boolean): void {
    console.log(open);
  }
}
