import { of } from 'rxjs';

import { SettingsFacade } from '@ea/core/store';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  BasicEvent,
  GoogleAnalyticsService,
  LoadCaseEvent,
  StoreClickEvent,
} from '../google-analytics';
import { MobileFirebaseAnalyticsService } from '../mobile-frebase-analytics/mobile-firebase-analytics.service';
import { TrackingService } from './tracking.service';

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
  let firebaseService: MobileFirebaseAnalyticsService;
  let googleAnalyticsService: GoogleAnalyticsService;
  let applicationInsightsService: ApplicationInsightsService;

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
    ],
    mocks: [
      MobileFirebaseAnalyticsService,
      GoogleAnalyticsService,
      ApplicationInsightsService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(TrackingService);
    firebaseService = spectator.inject(MobileFirebaseAnalyticsService);
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
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

      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith(
        MOCK_LOAD_CASE_EVENT
      );
      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        MOCK_LOAD_CASE_EVENT.action,
        MOCK_LOAD_CASE_EVENT
      );

      expect(firebaseService.logEvent).toHaveBeenCalledWith(
        MOCK_LOAD_CASE_EVENT
      );
    });

    it('the general log event call should be redirect to both tracking services', () => {
      service['logEvent'](MOCK_BASIC_EVENT);

      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith(
        MOCK_BASIC_EVENT
      );
      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        MOCK_BASIC_EVENT.action,
        MOCK_BASIC_EVENT
      );

      expect(firebaseService.logEvent).toHaveBeenCalledWith(MOCK_BASIC_EVENT);
    });
  });

  it('should log app store click', () => {
    const storeName = 'App Store';
    const page = 'test-page';

    const expectedEvent: StoreClickEvent = {
      action: 'App Store Link Click',
      storeName,
      page,
    };

    service.logAppStoreClick(storeName, page);

    expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith(expectedEvent);
    expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
      'App Store Link Click',
      expectedEvent
    );
    expect(firebaseService.logEvent).toHaveBeenCalledWith(expectedEvent);
  });
});
