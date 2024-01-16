import { DOCUMENT } from '@angular/common';

import { of } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { EmbeddedGoogleAnalyticsService } from './embedded-google-analytics.service';

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

    it('should push logDownloadReport event to dataLayer', async () => {
      await service.logDownloadReport();
      expect(document.defaultView.dataLayer.push).toBeCalledWith({
        action: 'Download Report',
        event: 'Engineering-App',
      });
    });

    it('should push logShowReport to data layer', async () => {
      await service.logShowReport();
      expect(document.defaultView.dataLayer.push).toBeCalledWith({
        action: 'Show Report',
        event: 'Engineering-App',
      });
    });

    it('should push logCalculation to data layer', async () => {
      const payload = { a: { selected: true }, b: { selected: false } } as any;
      await service.logCalculation(payload, 15);
      expect(document.defaultView.dataLayer.push).toBeCalledWith({
        action: 'Calculate',
        status: 'successful',
        methods: { a: true, b: false },
        message: 'successful',
        version: service['version'],
        event: 'Engineering-App',
        numberOfLoadcases: 15,
      });
    });

    it('should push logCalculation to data layer on error', async () => {
      const payload = { a: { selected: true }, b: { selected: false } } as any;
      await service.logCalculation(payload, -1, 'A serious error');
      expect(document.defaultView.dataLayer.push).toBeCalledWith({
        action: 'Calculate',
        status: 'unsuccessful',
        methods: { a: true, b: false },
        message: 'A serious error',
        version: service['version'],
        event: 'Engineering-App',
        numberOfLoadcases: -1,
      });
    });

    it('should push logToggleCalculationType to data layer', async () => {
      const payload = { a: true, b: false };
      await service.logToggleCalculationType(true, payload);
      expect(document.defaultView.dataLayer.push).toBeCalledWith({
        action: 'Toggle Method',
        status: 'on',
        methods: payload,
        version: service['version'],
        event: 'Engineering-App',
      });
    });
  });

  describe('when app is not delivered as embedded', () => {
    beforeEach(() => {
      settingsFacadeMock.isStandalone$ = of(true);
    });

    it('should not interact with dataLayer when all possible logging calls are made', async () => {
      await service.logCalculation({} as any, -1);
      await service.logDownloadReport();
      await service.logShowReport();
      await service.logToggleCalculationType(true, {});

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
