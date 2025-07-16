import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { of, Subject } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { LSACartService } from './core/services/add-to-cart.service';
import { PriceAvailabilityService } from './core/services/price-availability.service';
import { RestService } from './core/services/rest.service';
import { StaticStorageService } from './core/services/static-storage';
import { UserTier } from './shared/constants/user-tier.enum';
import { AvailabilityRequestEvent } from './shared/models/price-availibility.model';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let restService: RestService;
  let translocoService: TranslocoService;
  const localStorageMock = {
    setItem: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      MockModule(MatDividerModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: LOCAL_STORAGE,
        useValue: localStorageMock,
      },
      {
        provide: RestService,
        useValue: {
          getGreases: jest.fn(),
        },
      },
      {
        provide: PriceAvailabilityService,
        useValue: {
          priceAndAvailabilityRequest$: of({} as AvailabilityRequestEvent),
        },
      },
      {
        provide: LSACartService,
        useValue: {
          addToCartEvent$: of({}),
          setUserTier: jest.fn(),
        },
      },
      {
        provide: StaticStorageService,
        useValue: {
          displayMaintenanceMessages: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    component = spectator.debugElement.componentInstance;

    restService = spectator.inject(RestService);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    spectator.detectChanges();
    const title = spectator.query('h1').textContent.trim();
    expect(title).toContain('appTitle');
  });

  it('should render app-banner', () => {
    spectator.detectChanges();
    const banner = spectator.query('schaeffler-banner');
    expect(banner).toBeTruthy();
  });

  it('should display maintenance messages', () => {
    const displayMaintenanceMessagesSpy = jest.spyOn(
      spectator.inject(StaticStorageService),
      'displayMaintenanceMessages'
    );

    component.ngOnInit();

    expect(displayMaintenanceMessagesSpy).toHaveBeenCalled();
  });

  describe('when userTier changes', () => {
    it('should set userTier', () => {
      spectator.setInput('userTier', UserTier.Business);

      expect(spectator.inject(LSACartService).setUserTier).toHaveBeenCalledWith(
        UserTier.Business
      );
    });
  });

  describe('when language changes', () => {
    it('should set language in localStorage', () => {
      const language = 'en';
      const languageSelectionSpy = jest.spyOn(
        translocoService,
        'setActiveLang'
      );

      spectator.setInput('language', language);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'language',
        language
      );

      expect(languageSelectionSpy).toHaveBeenCalledWith(language);
    });
  });

  describe('fetchGreases', () => {
    it('should call fetchGreases', () => {
      component.fetchGreases();

      expect(restService.getGreases).toHaveBeenCalled();
    });
  });

  describe('listenForPriceAndAvailabilityRequests', () => {
    it('should subscribe to priceAndAvailabilityRequest$ and emit availabilityRequest event', () => {
      const emitSpy = jest.spyOn(component.availabilityRequest, 'emit');
      spectator.detectChanges();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  it('should complete destroyed$ subject on ngOnDestroy', () => {
    const destroyed$ = (component as any).destroyed$ as Subject<void>;
    const completeSpy = jest.spyOn(destroyed$, 'complete');

    component.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });
});
