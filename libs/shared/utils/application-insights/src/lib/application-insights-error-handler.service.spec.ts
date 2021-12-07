import { Injector } from '@angular/core';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from './application-insights.service';
import { ApplicationInsightsErrorHandlerService } from './application-insights-error-handler.service';

describe('ApplicationInsightsErrorHandlerService', () => {
  let service: ApplicationInsightsErrorHandlerService;
  let spectator: SpectatorService<ApplicationInsightsErrorHandlerService>;
  let injector: Injector;

  const createService = createServiceFactory({
    service: ApplicationInsightsErrorHandlerService,
    providers: [
      {
        provide: ApplicationInsightsService,
        useValue: {
          logException: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    injector = spectator.inject(Injector);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should log exception to application insight', () => {
      const applicationInsightsService =
        injector.get<ApplicationInsightsService>(ApplicationInsightsService);
      const error = new Error('Oops, an error occured');

      service.handleError(error);

      expect(applicationInsightsService.logException).toHaveBeenCalled();
    });
  });
});
