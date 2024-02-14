import { MatIconTestingModule } from '@angular/material/icon/testing';
import { Meta, Title } from '@angular/platform-browser';

import { of } from 'rxjs';

import { HomeCardsService } from '@ea/core/services/home/home-cards.service';
import { ProductSelectionFacade, SettingsFacade } from '@ea/core/store/facades';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QuickBearingSelectionComponent } from '../quick-bearing-selection';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let spectator: Spectator<HomePageComponent>;

  const createComponent = createComponentFactory({
    component: HomePageComponent,
    imports: [
      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(QuickBearingSelectionComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: HomeCardsService,
        useValue: {
          homeCards$: of([]),
          sustainabilityCard$: of({}),
        },
      },
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          bearingDesignationResultList$: of([]),
          dispatch: jest.fn(),
        },
      },
      {
        provide: SettingsFacade,
        useValue: {
          isStandalone$: of(true),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have a title in the template', () => {
    spectator.detectChanges();
    expect(spectator.query('h1')).toBeTruthy();
  });

  it('should have QualtricsInfoBanner', () => {
    spectator.detectChanges();
    const banner = spectator.query(QualtricsInfoBannerComponent);
    expect(banner).toBeTruthy();
    expect(banner.bearingDesingation).toBe(undefined);
  });

  it('should update the meta tags on load', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component['titleService'].setTitle).toHaveBeenCalled();
    expect(spectator.component['metaService'].updateTag).toHaveBeenCalled();
  });
});
