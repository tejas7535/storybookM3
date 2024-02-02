import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { SettingsFacade } from '@ga/core/store';
import { TRACKING_APP_STORE_LINK_CLICK } from '@ga/shared/constants';

import { HomeCardsService } from './services/home-cards.service';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public appDelivery$ = this.settingsFacade.appDelivery$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly appInsightService: ApplicationInsightsService,
    public readonly homeCardsService: HomeCardsService
  ) {}

  sendClickEvent(storeName: string) {
    this.appInsightService.logEvent(TRACKING_APP_STORE_LINK_CLICK, {
      page: 'home',
      storeName,
    });
  }
}
