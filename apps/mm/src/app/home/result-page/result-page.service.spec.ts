import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { RestService } from '../../core/services';
import { PROPERTIES } from '../../shared/constants/tracking-names';
import { ResultPageService } from './result-page.service';

describe('ResultPageService testing', () => {
  let spectator: SpectatorService<ResultPageService>;
  let service: ResultPageService;

  const mockResponse = {
    _links: [
      {
        rel: 'self',
        href: 'mockRefSelf',
      },
      {
        rel: 'pdf',
        href: 'mockRefPdf',
      },
      {
        rel: 'html',
        href: 'mockRefHtml',
      },
      {
        rel: 'body',
        href: 'mockRefBody',
      },
    ],
  };

  const createService = createServiceFactory({
    service: ResultPageService,
    providers: [
      {
        provide: RestService,
        useValue: {
          getBearingCalculationResult: jest.fn(() => of(mockResponse)),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn(() => 'some text'),
        },
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ResultPageService);
  });

  describe('#getResult', () => {
    it('should getBearingCalculation from restService', (done) => {
      const trackPropertiesSpy = jest.spyOn(service, 'trackProperties');

      const mockFormProperties = {
        data: {},
        state: false,
        _links: [
          {
            rel: 'body',
            href: 'bodyLink',
          },
          {
            rel: 'pdf',
            href: 'pdfLink',
          },
        ],
      };

      spectator.service.getResult(mockFormProperties).subscribe((response) => {
        expect(trackPropertiesSpy).toHaveBeenCalledWith(mockFormProperties);

        expect(response).toEqual({
          htmlReportUrl: 'mockRefBody',
          pdfReportUrl: 'mockRefPdf',
        });
        expect(
          service['restService'].getBearingCalculationResult
        ).toHaveBeenCalledWith(mockFormProperties);
        done();
      });
    });
  });

  describe('#trackProperties', () => {
    it('should call the logEvent method', () => {
      const mockFormProperties = {
        nice: 'properties',
      };

      const trackingSpy = jest.spyOn(
        service['applicationInsightsService'],
        'logEvent'
      );

      service.trackProperties(mockFormProperties);

      expect(trackingSpy).toHaveBeenCalledWith(PROPERTIES, {
        properties: mockFormProperties,
      });
    });
  });
});
