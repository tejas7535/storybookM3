import { DOCUMENT } from '@angular/common';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BasicEvent, CalculationTypeChangeEvent } from './event-types';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let spectator: SpectatorService<GoogleAnalyticsService>;
  let service: GoogleAnalyticsService;

  const document = {
    defaultView: {
      dataLayer: {
        push: jest.fn(),
      },
    },
  };

  const createService = createServiceFactory({
    service: GoogleAnalyticsService,
    providers: [
      {
        provide: DOCUMENT,
        useValue: document,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(GoogleAnalyticsService);

    document.defaultView.dataLayer.push.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should push the specified event to data layer', () => {
    const testEvent: BasicEvent = { action: 'This is the test event' };
    service.logEvent(testEvent as CalculationTypeChangeEvent);

    expect(document.defaultView.dataLayer.push).toHaveBeenCalledWith({
      event: 'Engineering-App',
      ...testEvent,
    });
  });
});
