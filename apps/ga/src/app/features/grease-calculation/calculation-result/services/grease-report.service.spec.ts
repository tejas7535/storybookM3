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

import {
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFacade } from '@ga/core/store/facades';
import {
  getEnvironmentTemperatures,
  getGreaseApplication,
  getMotionType,
} from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { Movement } from '@ga/shared/models';
import { AppAnalyticsService } from '@ga/shared/services/app-analytics-service/app-analytics-service';
import { InteractionEventType } from '@ga/shared/services/app-analytics-service/interaction-event-type.enum';
import {
  GREASE_COMPLETE_RESULT_MOCK,
  GREASE_RESULT_SUBORDINATES_MOCK,
} from '@ga/testing/mocks';

import { CalculationParametersService } from '../../calculation-parameters/services';
import { WARNINGSOPENED } from '../constants';
import { GreaseReportSubordinate } from '../models';
import { GreaseMiscibilityService } from './grease-miscibility/grease-miscibility.service';
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
        provide: GreaseMiscibilityService,
        useValue: {
          getGreaseMiscibility: jest.fn(),
          markMixableGreases: jest
            .fn()
            .mockImplementation((subordinates) => subordinates),
        },
      },
      {
        provide: GreaseResultDataSourceService,
        useValue: mockGreaseResultDataSourceService,
      },

      mockProvider(TranslocoLocaleService, { localizeNumber }),
      mockProvider(CalculationParametersService),
      mockProvider(GreaseRecommendationService),
      mockProvider(ApplicationInsightsService, {
        logEvent: jest.fn(),
      }),
      mockProvider(AppAnalyticsService, {
        logInteractionEvent: jest.fn(),
      }),
      mockProvider(TranslocoLocaleService, {
        getLocale: jest.fn(() => 'de-DE'),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    (service['translocoService'].getLocale as jest.Mock).mockReturnValue(
      'de-DE'
    );
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
      service['sortKappaValues'] = jest.fn((input) => input);
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
        service['sortKappaValues'] = jest.fn((input) => input);
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

  it('sortKappa should prioritize entries with the best kappa values', () => {
    const MOCK_SUBORDINATES: GreaseReportSubordinate[] = [
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '2.5' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '10,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '1.0' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '10,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '4.5' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '10,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '2.5' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '8,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '0.5' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '10,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
      {
        greaseResult: {
          dataSource: [
            { title: 'viscosityRatio', values: '3.5' },
            {
              title: 'relubricationQuantityPer1000OperatingHours',
              values: '10,0 cm³',
            },
          ],
        },
      } as GreaseReportSubordinate,
    ];
    const result = service['sortKappaValues'](MOCK_SUBORDINATES);
    expect(result).toMatchSnapshot();
  });
});
