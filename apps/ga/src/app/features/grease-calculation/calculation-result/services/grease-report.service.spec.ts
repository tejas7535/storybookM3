import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

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

import { CalculationParametersFacade } from '@ga/core/store/facades';
import {
  getEnvironmentTemperatures,
  getGreaseApplication,
  getMotionType,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { Movement } from '@ga/shared/models';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';
import {
  GREASE_COMPLETE_RESULT_MOCK,
  GREASE_RESULT_SUBORDINATES_MOCK,
} from '@ga/testing/mocks';

import { CalculationParametersService } from '../../calculation-parameters/services';
import { WARNINGSOPENED } from '../constants';
import { GreaseRecommendationService } from './grease-recommendation.service';
import { GreaseReportService } from './grease-report.service';
import { GreaseResultDataSourceService } from './grease-result-data-source.service';

describe('GreaseReportService', () => {
  let spectator: SpectatorService<GreaseReportService>;
  let service: GreaseReportService;
  const localizeNumber = jest.fn();

  const isVerticalAxisOrientation$ = new BehaviorSubject<boolean>(false);

  const mockGreaseResultDataSourceService = new Proxy(
    {},
    {
      get: (target: Record<string, any>, prop: string | symbol) => {
        if (typeof prop === 'string') {
          return jest
            .fn()
            .mockReturnValue(`responseOf:${prop.charAt(0) + prop.slice(1)}`);
        }

        return target[prop as unknown as keyof typeof target];
      },
    }
  );

  const createService = createServiceFactory({
    service: GreaseReportService,
    imports: [
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
      provideRouter([]),
      {
        provide: CalculationParametersFacade,
        useValue: {
          isVerticalAxisOrientation$: isVerticalAxisOrientation$.asObservable(),
        },
      },
      {
        provide: GreaseRecommendationService,
        useValue: {
          processGreaseRecommendation: jest.fn(),
        },
      },
      {
        provide: GreaseResultDataSourceService,
        useValue: mockGreaseResultDataSourceService,
      },

      mockProvider(TranslocoLocaleService, { localizeNumber }),
      mockProvider(CalculationParametersService),
      mockProvider(GreaseRecommendationService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('getResultAmount', () => {
    it('return a number describing the length of the greases', () => {
      const result = service.getResultAmount(GREASE_RESULT_SUBORDINATES_MOCK);

      expect(result).toStrictEqual(3);
    });
  });

  describe('format grease report', () => {
    it('should gracefully return empty object if empty array provided', (done) => {
      service.formatGreaseReport([]).then((result) => {
        expect(result).toMatchSnapshot();
        done();
      });
    });

    it('should format result when data provided', (done) => {
      service
        .formatGreaseReport(GREASE_COMPLETE_RESULT_MOCK.subordinates)
        .then((result) => {
          expect(result).toMatchSnapshot();
          done();
        });
    });

    describe('when vertical axis is selected', () => {
      beforeEach(() => {
        isVerticalAxisOrientation$.next(true);
      });

      it('should format result when data provided', (done) => {
        service
          .formatGreaseReport(GREASE_COMPLETE_RESULT_MOCK.subordinates)
          .then((result) => {
            expect(result).toMatchSnapshot();
            done();
          });
      });
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
