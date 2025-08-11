import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { SettingsFacade } from '@ga/core/store';
import { TRACKING_APP_STORE_LINK_CLICK } from '@ga/shared/constants';

import { HomeCardsService } from './services/home-cards.service';

@Component({
  selector: 'ga-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HomeComponent {
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly appInsightService = inject(ApplicationInsightsService);
  public readonly homeCardsService = inject(HomeCardsService);

  public appDelivery$ = this.settingsFacade.appDelivery$;
  public partnerVersion$ = this.settingsFacade.partnerVersion$;

  sendClickEvent(storeName: string) {
    this.appInsightService.logEvent(TRACKING_APP_STORE_LINK_CLICK, {
      page: 'home',
      storeName,
    });
  }
}
