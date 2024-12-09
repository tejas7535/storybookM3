import { DOCUMENT } from '@angular/common';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BasicEvent, StepLoadEvent } from './event-types';
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

  it('should log step load event for valid step index', () => {
    const logEventSpy = jest.spyOn(spectator.service, 'logEvent');
    const stepIndex = 2;

    spectator.service.logStepLoadEvent(stepIndex);

    expect(logEventSpy).toHaveBeenCalledWith({
      event: 'lsa_related_interaction',
      action: 'Step Load',
      step: stepIndex,
      step_name: 'Lubricant',
    });
  });

  it('should not log step load event for step index greater than 3 like result', () => {
    const logEventSpy = jest.spyOn(spectator.service, 'logEvent');
    const resultPageIndex = 4;

    spectator.service.logStepLoadEvent(resultPageIndex);

    expect(logEventSpy).not.toHaveBeenCalled();
  });

  it('should push the specified event to data layer', () => {
    const testEvent: BasicEvent = {
      event: 'lsa_related_interaction',
      action: 'This is the test event',
    };
    service.logEvent(testEvent as StepLoadEvent);

    expect(document.defaultView.dataLayer.push).toHaveBeenCalledWith({
      event: 'lsa_related_interaction',
      ...testEvent,
    });
  });

  it('should not log event to dataLayer if not available', () => {
    const mockWindow: any = {};
    Object.defineProperty(spectator.service, 'window', { value: mockWindow });

    const event: BasicEvent = {
      event: 'lsa_related_interaction',
      action: 'This is the test event',
    };

    spectator.service.logEvent(event);

    expect(mockWindow.dataLayer).toBeUndefined();
  });
});
