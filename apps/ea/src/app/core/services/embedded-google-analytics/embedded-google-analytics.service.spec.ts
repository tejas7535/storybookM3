import { DOCUMENT } from '@angular/common';

import { of } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmbeddedGoogleAnalyticsService } from './embedded-google-analytics.service';
import { BasicEvent, CalculationTypeChangeEvent } from './event-types';

describe('EmbeddedGoogleAnalyticsService', () => {
  let spectator: SpectatorService<EmbeddedGoogleAnalyticsService>;
  let service: EmbeddedGoogleAnalyticsService;

  const document = {
    defaultView: {
      dataLayer: {
        push: jest.fn(),
      },
    },
  };

  const settingsFacadeMock = {
    isStandalone$: of(false),
  };

  const createService = createServiceFactory({
    service: EmbeddedGoogleAnalyticsService,
    providers: [
      {
        provide: DOCUMENT,
        useValue: document,
      },
      {
        provide: SettingsFacade,
        useValue: settingsFacadeMock,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(EmbeddedGoogleAnalyticsService);

    document.defaultView.dataLayer.push.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when app is delivered as embedded', () => {
    beforeEach(() => {
      settingsFacadeMock.isStandalone$ = of(false);
    });

    it('should push the specified event to data layer', async () => {
      const testEvent: BasicEvent = { action: 'This is the test event' };
      await service.logEvent(testEvent as CalculationTypeChangeEvent);

      expect(document.defaultView.dataLayer.push).toHaveBeenCalledWith({
        event: 'Engineering-App',
        ...testEvent,
      });
    });
  });

  describe('when app is not delivered as embedded', () => {
    beforeEach(() => {
      settingsFacadeMock.isStandalone$ = of(true);
    });

    it('should not interact with dataLayer when all possible logging calls are made', async () => {
      await service.logEvent({} as any);
      expect(document.defaultView.dataLayer.push).not.toHaveBeenCalled();
    });
  });

  describe('isAppEmbedded()', () => {
    beforeEach(async () => {
      settingsFacadeMock.isStandalone$ = of(false);
    });

    it('should qualify app as embedded', async () => {
      expect(await service['isAppEmbedded']()).toBe(true);
    });
  });
});
