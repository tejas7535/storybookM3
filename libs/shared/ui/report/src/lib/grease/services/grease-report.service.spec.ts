import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { formattedGreaseJson } from '../../../mocks';
import { WARNINGSOPENED } from '../../models';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseReportService } from './grease-report.service';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

describe('GreaseReportService', () => {
  let httpMock: HttpTestingController;
  let spectator: SpectatorService<GreaseReportService>;
  let service: GreaseReportService;
  const localizeNumber = jest.fn();

  const createService = createServiceFactory({
    service: GreaseReportService,
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      GreaseResultDataSourceService,
      UndefinedValuePipe,
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // describe('formatGreaseReport', () => {
  //   it('should format a grease report', () => {
  //     const mockGreaseReport = greaseReport.subordinates;
  //
  //     const result = service.formatGreaseReport(mockGreaseReport);
  //
  //     expect(result).toMatchObject(formattedGreaseJson);
  //   });
  // });

  describe('getResultAmount', () => {
    it('return a number describing the length of the greases', () => {
      const result = service.getResultAmount(formattedGreaseJson);

      expect(result).toStrictEqual(3);
    });
  });

  describe('#trackWarningsOpenend', () => {
    it('should call the logEvent method', () => {
      const trackingSpy = jest.spyOn(
        service['applicationInsightsService'],
        'logEvent'
      );

      service.trackWarningsOpened();

      expect(trackingSpy).toHaveBeenCalledWith(WARNINGSOPENED);
    });
  });
});
