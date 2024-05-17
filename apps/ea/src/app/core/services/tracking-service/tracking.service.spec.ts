import { of } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  BasicEvent,
  GoogleAnalyticsService,
  LoadCaseEvent,
} from '../google-analytics';
import { TrackingService } from './tracking.service';

const GA_SERVICE_MOCK: Partial<GoogleAnalyticsService> = {
  logEvent: jest.fn(),
};

const AI_SERVICE_MOCK: Partial<ApplicationInsightsService> = {
  logEvent: jest.fn(),
};

const MOCK_BASIC_EVENT: BasicEvent = {
  action: 'Mockable Event',
};

const MOCK_LOAD_CASE_EVENT: LoadCaseEvent = {
  action: 'Load Case Changed',
  event: 'Added',
  numberOfLoadcases: 3,
};

describe('TrackingService', () => {
  let spectator: SpectatorService<TrackingService>;
  let service: TrackingService;

  const settingsFacadeMock = {
    isStandalone$: of(false),
  };

  const createService = createServiceFactory({
    service: TrackingService,
    providers: [
      {
        provide: SettingsFacade,
        useValue: settingsFacadeMock,
      },
      {
        provide: GoogleAnalyticsService,
        useValue: GA_SERVICE_MOCK,
      },
      {
        provide: ApplicationInsightsService,
        useValue: AI_SERVICE_MOCK,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(TrackingService);
    jest.resetAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the tracking service is called', () => {
    it('every log call should be redirected to both implemented tracking services', () => {
      service.logLoadcaseEvent(
        MOCK_LOAD_CASE_EVENT.event,
        MOCK_LOAD_CASE_EVENT.numberOfLoadcases
      );

      expect(service['gaService'].logEvent).toHaveBeenCalledWith(
        MOCK_LOAD_CASE_EVENT
      );
      expect(service['aiService'].logEvent).toHaveBeenCalledWith(
        MOCK_LOAD_CASE_EVENT.action,
        MOCK_LOAD_CASE_EVENT
      );
    });

    it('the general log event call should be redirect to both tracking services', () => {
      service['logEvent'](MOCK_BASIC_EVENT);

      expect(service['gaService'].logEvent).toHaveBeenCalledWith(
        MOCK_BASIC_EVENT
      );
      expect(service['aiService'].logEvent).toHaveBeenCalledWith(
        MOCK_BASIC_EVENT.action,
        MOCK_BASIC_EVENT
      );
    });
  });
});
