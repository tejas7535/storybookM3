import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { RestService } from '../../core/services';
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
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ResultPageService);
  });

  describe('#getResult', () => {
    it('should getBearingCalculation from restService', (done) => {
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
});
