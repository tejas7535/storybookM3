import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { CalculationRequestPayload } from '@mm/shared/models/calculation-request/calculation-request.model';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { PROPERTIES } from '../../../shared/constants/tracking-names';
import { RestService } from '..';
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
      {
        rel: 'json',
        href: 'mockRefJson',
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
          getPdfReportRespone: jest.fn(() => of(true)),
          getJsonReportResponse: jest.fn(() => of(true)),
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
      const requestPaylod: CalculationRequestPayload = {
        IDCO_DESIGNATION: '123',
      } as Partial<CalculationRequestPayload> as CalculationRequestPayload;

      service.getResult(requestPaylod).subscribe((response) => {
        expect(trackPropertiesSpy).toHaveBeenCalledWith(requestPaylod);

        expect(response).toEqual({
          htmlReportUrl: 'mockRefBody',
          pdfReportUrl: 'mockRefPdf',
          jsonReportUrl: 'mockRefJson',
        });
        expect(
          service['restService'].getBearingCalculationResult
        ).toHaveBeenCalledWith(requestPaylod);
        done();
      });
    });
  });

  describe('#getPdfReportReady', () => {
    it('should getPdfReportResponse from rest service', (done) => {
      service.getPdfReportReady('testUrl').subscribe((response) => {
        expect(response).toBe(true);
        expect(service['restService'].getPdfReportRespone).toHaveBeenCalledWith(
          'testUrl'
        );
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

      expect(trackingSpy).toHaveBeenCalledWith(PROPERTIES, mockFormProperties);
    });
  });

  describe('#getJsonReport', () => {
    it('should getJsonReport from rest service', (done) => {
      service.getJsonReport('jsonURL').subscribe((response) => {
        expect(response).toBe(true);
        expect(
          service['restService'].getJsonReportResponse
        ).toHaveBeenCalledWith('jsonURL');
        done();
      });
    });
  });
});
