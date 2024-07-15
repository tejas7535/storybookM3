import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';
import { GREASE_RESULT_SUBORDINATES_MOCK } from '@ga/testing/mocks';

import { CalculationParametersService } from '../../calculation-parameters/services';
import { WARNINGSOPENED } from '../constants';
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
      mockProvider(CalculationParametersService),
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

  describe('getResultAmount', () => {
    it('return a number describing the length of the greases', () => {
      const result = service.getResultAmount(GREASE_RESULT_SUBORDINATES_MOCK);

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

    it('should call the logInteractionEvent method', () => {
      const trackingSpy = jest.spyOn(
        service['appAnalyticsService'],
        'logInteractionEvent'
      );

      service.trackWarningsOpened();

      expect(trackingSpy).toHaveBeenCalledWith(
        InteractionEventType.ErrorsAndWarnings
      );
    });
  });
});
