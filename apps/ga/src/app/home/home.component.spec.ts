import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { initialState } from '@ga/core/store/reducers/settings/settings.reducer';
import { AppLogoModule } from '@ga/shared/components/app-logo';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';
import { TRACKING_APP_STORE_LINK_CLICK } from '@ga/shared/constants';

import { HomepageCardModule } from './components';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let spectator: Spectator<HomeComponent>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    declarations: [HomeComponent],
    imports: [
      MockModule(HomepageCardModule),
      MockModule(AppLogoModule),
      MockComponent(QuickBearingSelectionComponent),
      MockComponent(QualtricsInfoBannerComponent),
      RouterTestingModule,
      PushPipe,
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
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide homepage cards', () => {
    expect(component.homepageCards).toHaveLength(8);
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
