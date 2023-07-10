import { Component } from '@angular/core';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { SettingsFacade } from '@ga/core/store';
import { TRACKING_APP_STORE_LINK_CLICK } from '@ga/shared/constants';

import { homepageCards } from './constants';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public homepageCards = homepageCards;
  public appDelivery$ = this.settingsFacade.appDelivery$;

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly appInsightService: ApplicationInsightsService
  ) {}

  sendClickEvent(storeName: string) {
    this.appInsightService.logEvent(TRACKING_APP_STORE_LINK_CLICK, {
      page: 'home',
      storeName,
    });
  }
}
