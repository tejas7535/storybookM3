import { Component, OnInit } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Icon } from '@schaeffler/icons';
import { FooterLink, openBanner } from '@schaeffler/shared/ui-components';
import { SidebarElement } from '@schaeffler/sidebar';

@Component({
  selector: 'schaeffler-steel-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public isSidebarExpanded = false;
  public sidebarWidthExpanded = '960px';
  public sidebarWidthExpandedTablet = 'calc(100% - 60px)';
  public sidebarWidthExpandedMobile = '100%';
  public sidebarWidth = '400px';

  public platformTitle = translate('general.appName');

  public sidebarElements: SidebarElement[] = [
    {
      text: translate('navigation.home'),
      icon: new Icon('icon-house'),
      link: '/home',
    },
  ];
  public footerLinks: FooterLink[] = [
    {
      link:
        'https://sconnect.schaeffler.com/community/global-technology/strategic-information-technology/digital-platform/ai-solutions',
      title: 'Custom Apps & AI @ sConnect',
      external: true,
    },
  ];

  constructor(private readonly store: Store<any>) {}

  public ngOnInit(): void {
    this.openBanner();
  }

  public openBanner(): void {
    this.store.dispatch(
      openBanner({
        text: translate('banner.bannerText'),
        buttonText: translate('banner.buttonText'),
        icon: 'info',
        truncateSize: 0,
      })
    );
  }
}
