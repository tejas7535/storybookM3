import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { initialState } from '@ga/core/store/reducers/settings/settings.reducer';
import { AppLogoComponent } from '@ga/shared/components/app-logo/app-logo.component';
import { AppStoreButtonsComponent } from '@ga/shared/components/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';
import { TRACKING_APP_STORE_LINK_CLICK } from '@ga/shared/constants';
import { HOMEPAGE_CARD_MOCK } from '@ga/testing/mocks/models/homepage-card.mock';

import { HomepageCardComponent } from './components';
import { EasyCalcCardComponent } from './components/easy-calc-card/easy-calc-card.component';
import { HomeComponent } from './home.component';
import { HomeCardsService } from './services/home-cards.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [HomeComponent],
    imports: [
      MockComponent(AppLogoComponent),
      MockComponent(EasyCalcCardComponent),
      MockComponent(HomepageCardComponent),
      MockComponent(QuickBearingSelectionComponent),
      MockComponent(QualtricsInfoBannerComponent),
      MockComponent(AppStoreButtonsComponent),
      RouterTestingModule,
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          settings: {
            ...initialState,
          },
        },
      }),
      {
        provider: ActivatedRoute,
        useValue: {
          queryParamMap: of(convertToParamMap({ bearing: 'some bearing' })),
        },
      },
      mockProvider(HomeCardsService, {
        getHomeCards: () => [HOMEPAGE_CARD_MOCK, HOMEPAGE_CARD_MOCK],
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide given number of homepage cards', () => {
    expect(spectator.queryAll(HomepageCardComponent).length).toBe(2);
  });

  it('should send application insights events for store clicks', () => {
    const logEventSpy = jest.spyOn(component['appInsightService'], 'logEvent');
    component.sendClickEvent('play');
    expect(logEventSpy).toHaveBeenCalledWith(TRACKING_APP_STORE_LINK_CLICK, {
      page: 'home',
      storeName: 'play',
    });
  });

  it('should display qualtrics info banner', () => {
    expect(spectator.query('ga-qualtrics-info-banner')).toBeTruthy();
  });
});
