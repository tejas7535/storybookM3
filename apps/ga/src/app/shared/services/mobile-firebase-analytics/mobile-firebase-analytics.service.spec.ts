/* eslint-disable import/no-extraneous-dependencies */
import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';

import { InteractionEventType } from '../app-analytics-service/interaction-event-type.enum';
import { MobileFirebaseAnalyticsService } from './mobile-firebase-analytics.service';

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

jest.mock('@capacitor-community/firebase-analytics', () => ({
  FirebaseAnalytics: {
    logEvent: jest.fn(),
  },
}));

const logEventSpy = jest.spyOn(FirebaseAnalytics, 'logEvent');

describe('MobileFirebaseAnalyticsService', () => {
  let spectator: SpectatorService<MobileFirebaseAnalyticsService>;
  let service: MobileFirebaseAnalyticsService;

  const createService = createServiceFactory({
    service: MobileFirebaseAnalyticsService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(MobileFirebaseAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when app is delivered as mobile platform', () => {
    beforeAll(() => {
      isNativePlatformMock.mockReturnValue(true);
    });

    afterEach(() => {
      logEventSpy.mockReset();
    });

    describe('when logNavigationEvent is called with parameters url', () => {
      beforeEach(() => {
        const parametersUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`;
        service.logNavigationEvent(parametersUrl);
      });

      it('should log event about accessing main section', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'access_main_section',
          params: {
            content_type: 'navigation',
            content_id: 'Access Main Section',
          },
        });
      });
    });

    describe('when logNavigationEvent is called with result url', () => {
      beforeEach(() => {
        const resultUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`;
        service.logNavigationEvent(resultUrl);
      });

      it('should log event about accessing generated results', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'generate_results',
          params: {
            content_type: 'navigation',
            content_id: 'Generate Results',
          },
        });
      });
    });

    describe('when logNavigationEvent is called with not defined url', () => {
      beforeEach(() => {
        service.logNavigationEvent('/not_defined_url');
      });

      it('should not log unwanted event', () => {
        expect(logEventSpy).not.toBeCalled();
      });
    });

    describe('when logOpenExternalLinkEvent is called', () => {
      beforeEach(() => {
        service.logOpenExternalLinkEvent('some product name');
      });

      it('should log event about clicking external link', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'access_product_details',
          params: {
            content_type: 'externalLinkNavigation',
            content_id: 'Access Product Details',
            items: [{ name: 'some product name' }],
          },
        });
      });
    });

    describe('when logInteractionEvent is called with show all values type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ShowAllValues);
      });

      it('should log event about exapnding show all values section', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'show_all_product_values',
          params: {
            content_type: 'showAllValues',
            content_id: 'Show All Product Values',
          },
        });
      });
    });

    describe('when logInteractionEvent is called with show input type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ShowInput);
      });

      it('should log event about exapnding show input section', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'show_all_inputs',
          params: {
            content_type: 'showInput',
            content_id: 'Show All Inputs',
          },
        });
      });
    });

    describe('when logInteractionEvent is called with show error and warnings type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ErrorsAndWarnings);
      });

      it('should log event about exapnding show error and warnings section', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'open_errors_and_warnings_tab',
          params: {
            content_type: 'errorsAndWarnings',
            content_id: 'Open Errors And Warnings Tab',
          },
        });
      });
    });

    describe('when logInteractionEvent is called with undefined', () => {
      beforeEach(() => {
        service.logInteractionEvent(undefined);
      });

      it('should not log unwanted event', () => {
        expect(logEventSpy).not.toBeCalled();
      });
    });

    describe('when logRawInteractionEvent is called', () => {
      beforeEach(() => {
        service.logRawInteractionEvent('some_action', 'Some action Formatted');
      });

      it('should log event with raw action and action formatted', () => {
        expect(logEventSpy).toBeCalledWith({
          name: 'some_action',
          params: {
            content_type: 'grease_app_interaction',
            content_id: 'Some action Formatted',
          },
        });
      });
    });
  });

  describe('when app is not delivered as mobile', () => {
    beforeAll(() => {
      isNativePlatformMock.mockReturnValue(false);
    });

    describe('when all possible logging calls are made', () => {
      beforeEach(() => {
        const parametersUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`;
        service.logNavigationEvent(parametersUrl);

        const resultUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`;
        service.logNavigationEvent(resultUrl);
        service.logNavigationEvent('/not_defined_url');
        service.logInteractionEvent(InteractionEventType.ErrorsAndWarnings);
        service.logInteractionEvent(undefined);

        service.logOpenExternalLinkEvent('some product name');
        service.logRawInteractionEvent('some_action', 'Some action Formatted');
      });

      it('should not log any events', () => {
        expect(logEventSpy).not.toBeCalled();
      });
    });
  });

  describe('when isMobilePlatform called', () => {
    describe('when app is delivered as mobile', () => {
      beforeAll(() => {
        isNativePlatformMock.mockReturnValue(true);
      });

      it('should qualify app as mobile', () => {
        expect(service.isMobilePlatform()).toBe(true);
      });
    });
  });
});
