import { DOCUMENT } from '@angular/common';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { detectAppDelivery } from '@ga/core/helpers/settings-helpers';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';

import { EmbeddedGoogleAnalyticsService } from './embedded-google-analytics.service';
import { InteractionEventType } from './interaction-event-type.enum';

jest.mock('@ga/core/helpers/settings-helpers');
const appDeliveryMock = jest.mocked(detectAppDelivery);

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

  const createService = createServiceFactory({
    service: EmbeddedGoogleAnalyticsService,
    providers: [
      {
        provide: DOCUMENT,
        useValue: document,
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
    beforeAll(() => {
      appDeliveryMock.mockReturnValue('embedded');
    });

    describe('when logNavigationEvent is called with parameters url', () => {
      beforeEach(() => {
        const parametersUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`;
        service.logNavigationEvent(parametersUrl);
      });

      it('should push event about accessing main section to dataLayer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'access_main_section',
          action_formatted: 'Access Main Section',
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
        });
      });
    });

    describe('when logNavigationEvent is called with result url', () => {
      beforeEach(() => {
        const resultUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`;
        service.logNavigationEvent(resultUrl);
      });

      it('should push event about accessing generated results to dataLayer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'generate_results',
          action_formatted: 'Generate Results',
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
        });
      });
    });

    describe('when logNavigationEvent is called with not defined url', () => {
      beforeEach(() => {
        service.logNavigationEvent('/not_defined_url');
      });

      it('should not push unwanted event to dataLayer', () => {
        expect(document.defaultView.dataLayer.push).not.toBeCalled();
      });
    });

    describe('when logOpenExternalLinkEvent is called', () => {
      beforeEach(() => {
        service.logOpenExternalLinkEvent('some product name');
      });

      it('should push event about clicking external link to dataLayer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'access_product_details',
          action_formatted: 'Access Product Details',
          event: 'grease_app_interaction',
          raw_action: 'link_click',
          raw_action_formatted: 'Link Click',
          name: 'some product name',
        });
      });
    });

    describe('when logInteractionEvent is called with show all values type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ShowAllValues);
      });

      it('should push event about exapnding show all values section to data layer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'show_all_product_values',
          action_formatted: 'Show All Product Values',
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
        });
      });
    });

    describe('when logInteractionEvent is called with show input type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ShowInput);
      });

      it('should push event about exapnding show input section to data layer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'show_all_inputs',
          action_formatted: 'Show All Inputs',
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
        });
      });
    });

    describe('when logInteractionEvent is called with show error and warnings type', () => {
      beforeEach(() => {
        service.logInteractionEvent(InteractionEventType.ErrorsAndWarnings);
      });

      it('should push event about exapnding show error and warnings section to data layer', () => {
        expect(document.defaultView.dataLayer.push).toBeCalledWith({
          action: 'open_errors_and_warnings_tab',
          action_formatted: 'Open Errors And Warnings Tab',
          event: 'grease_app_interaction',
          raw_action: 'click',
          raw_action_formatted: 'Click',
        });
      });
    });
  });

  describe('when app is not delivered as embedded', () => {
    beforeAll(() => {
      appDeliveryMock.mockReturnValue('standalone');
    });

    describe('when all possible logging calls are made', () => {
      beforeEach(() => {
        const parametersUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`;
        service.logNavigationEvent(parametersUrl);

        const resultUrl = `/${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ResultPath}`;
        service.logNavigationEvent(resultUrl);
        service.logNavigationEvent('/not_defined_url');

        service.logOpenExternalLinkEvent('some product name');

        service.logShowAllValuesEvent();
      });

      it('should not interact with dataLayer', () => {
        expect(document.defaultView.dataLayer.push).not.toHaveBeenCalled();
      });
    });
  });

  describe('when isApplicationOfEmbeddedVersion called', () => {
    describe('when app is delivered as embedded', () => {
      beforeAll(() => {
        appDeliveryMock.mockReturnValue('embedded');
      });

      it('should qualify app as embedded', () => {
        expect(service.isApplicationOfEmbeddedVersion()).toBe(true);
      });
    });
  });
});
