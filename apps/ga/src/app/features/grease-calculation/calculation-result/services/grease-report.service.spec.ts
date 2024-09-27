import { provideHttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OneTrustModule } from '@altack/ngx-onetrust';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getEnvironmentTemperatures,
  getGreaseApplication,
  getMotionType,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { Movement } from '@ga/shared/models';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';
import { GREASE_RESULT_SUBORDINATES_MOCK } from '@ga/testing/mocks';

import { CalculationParametersService } from '../../calculation-parameters/services';
import { WARNINGSOPENED } from '../constants';
import { UndefinedValuePipe } from '../pipes/undefined-value.pipe';
import { GreaseReportService } from './grease-report.service';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

describe('GreaseReportService', () => {
  let spectator: SpectatorService<GreaseReportService>;
  let service: GreaseReportService;
  const localizeNumber = jest.fn();

  const createService = createServiceFactory({
    service: GreaseReportService,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      provideHttpClient(),
      provideMockStore({
        initialState: {},
        selectors: [
          { selector: getGreaseApplication, value: undefined },
          { selector: getMotionType, value: Movement.rotating },
          {
            selector: getEnvironmentTemperatures,
            value: { operatingTemperature: 90 },
          },
        ],
      }),
      mockProvider(TranslocoLocaleService, { localizeNumber }),
      GreaseResultDataSourceService,
      UndefinedValuePipe,
      mockProvider(CalculationParametersService),
    ],
  });

  beforeEach(waitForAsync(() => {
    spectator = createService();
    service = spectator.service;
  }));

  it('should create the service', () => {
    expect(service).toBeTruthy();
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

      const aiTrackingSpy = jest.spyOn(
        service['applicationInsightsService'],
        'logEvent'
      );
      service.trackWarningsOpened();

      expect(trackingSpy).toHaveBeenCalledWith(
        InteractionEventType.ErrorsAndWarnings
      );
      expect(aiTrackingSpy).toHaveBeenCalled();
    });
  });
});
