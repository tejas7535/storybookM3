import { Pages } from '@lsa/shared/constants/pages.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { GoogleAnalyticsService } from './google-analytics';
import { LsaAppService } from './lsa-app.service';

describe('LsaAppService', () => {
  let spectator: SpectatorService<LsaAppService>;
  let service: LsaAppService;
  let googleAnalyticsService: GoogleAnalyticsService;

  const createService = createServiceFactory({
    service: LsaAppService,
    providers: [
      {
        provide: GoogleAnalyticsService,
        useValue: {
          logStepLoadEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log intial step event', () => {
    expect(googleAnalyticsService.logStepLoadEvent).toHaveBeenCalledWith(1);
  });

  it('should return pages', () => {
    expect(service.getPages()).toMatchSnapshot();
  });

  describe('when selected page is not set', () => {
    it('should return undefined', () => {
      expect(service.getSelectedPage()).toBeUndefined();
    });
  });

  describe('when selected page is set', () => {
    beforeEach(() => {
      service.setSelectedPage(1);
    });

    it('should return selected page', () => {
      expect(service.getSelectedPage()).toBe(Pages.Lubricant);
    });

    it('should log step event', () => {
      expect(googleAnalyticsService.logStepLoadEvent).toHaveBeenCalledWith(2);
    });
  });

  describe('when step is not completed', () => {
    it('should return false', () => {
      expect(service.getPages()[0].completed).toBe(false);
    });
  });

  describe('when step is completed', () => {
    beforeEach(() => {
      service.setCompletedStep(0);
    });

    it('should return true', () => {
      expect(service.getPages()[0].completed).toBe(true);
    });
  });
});
