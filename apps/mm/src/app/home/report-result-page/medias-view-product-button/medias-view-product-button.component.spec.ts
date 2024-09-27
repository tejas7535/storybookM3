import { provideRouter } from '@angular/router';

import { MobileFirebaseAnalyticsService } from '@mm/core/services/tracking/mobile-firebase-analytics/mobile-firebase-analytics.service';
import { MEDIASBEARING } from '@mm/core/services/tracking/tracking.constants';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MediasViewProductButtonComponent } from './medias-view-product-button.component';

describe('MediasViewProductButtonComponent', () => {
  let spectator: Spectator<MediasViewProductButtonComponent>;
  let component: MediasViewProductButtonComponent;

  const createComponent = createComponentFactory({
    component: MediasViewProductButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        MobileFirebaseAnalyticsService,
        useValue: {
          logOpenExternalLinkEvent: jest.fn(),
        },
      },
      provideRouter([]),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when product id is provided', () => {
    beforeEach(() => {
      spectator.setInput('productId', '123');
    });

    it('should return the product medias url', () => {
      expect(component.getProductMediasUrl()).toBe(
        'reportResult.mediasBaseUrl/p/123?utm_source=mounting-manager'
      );
    });

    describe('#trackBearingSelection', () => {
      it('should call the logEvent method', () => {
        const trackingSpy = jest.spyOn(
          component['applicationInsightsService'],
          'logEvent'
        );

        const mobileTrackingSpy = jest.spyOn(
          component['firebaseAnalyticsService'],
          'logOpenExternalLinkEvent'
        );

        component.trackBearingSelection();

        expect(trackingSpy).toHaveBeenCalledWith(MEDIASBEARING, {
          bearing: '123',
        });

        expect(mobileTrackingSpy).toHaveBeenCalledWith('123');
      });
    });
  });
});
