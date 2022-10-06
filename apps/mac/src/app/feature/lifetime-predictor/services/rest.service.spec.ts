import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { PredictionRequest, StatisticalRequest } from '../models';
import { environment } from './../../../../environments/environment';
import { mockedStatisticalResult } from './../mock/mock.constants';
import { RestService } from './rest.service';

describe('RestService', () => {
  let spectator: SpectatorService<RestService>;
  let myProvider: RestService;
  let httpMock: HttpTestingController;
  let applicationInsightsService: ApplicationInsightsService;

  const createService = createServiceFactory({
    service: RestService,
    imports: [HttpClientTestingModule],
    providers: [
      RestService,
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
    myProvider = spectator.inject(RestService);
    httpMock = spectator.inject(HttpTestingController);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(myProvider).toBeTruthy();
  });

  describe('postPrediction', () => {
    const mockedPredictionRequest: PredictionRequest = {
      prediction: 0,
      mpa: 400,
      v90: 0,
      hv: 180,
      hv_lower: 180,
      hv_upper: 180,
      rrelation: -1,
      burdeningType: 0,
      model: 5,
      spreading: 0,
      rArea: 5,
      es: 200,
      rz: 0,
      hv_core: 500,
      a90: 100,
      gradient: 1,
      multiaxiality: 0,
    };

    const mockedHaighPrediction = {
      'fatigue_strength-1': 129.603_510_582_840_22,
      fatigue_strength0: 127.486_713_376_344_78,
      plot1: [
        [0, 0],
        [229.603_510_582_840_22, 229.603_510_582_840_22],
      ],
      plot2: [
        [0, 129.603_510_582_840_22],
        [127.486_713_376_344_78, 127.486_713_376_344_78],
      ],
    };

    it('should return an Observable<PredictionResult>', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 1)
        .subscribe((haighResult: any) => {
          expect(applicationInsightsService.logEvent).toHaveBeenCalled();
          expect(haighResult).toEqual(mockedHaighPrediction);
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${myProvider.SERVER_URL_PREDICTION}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });

    it('should return PredictionResult for Woehler Chart', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 2)
        .subscribe((woehlerResult: any) => {
          expect(applicationInsightsService.logEvent).toHaveBeenCalled();
          expect(woehlerResult).toEqual(undefined);
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${myProvider.SERVER_URL_PREDICTION}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });
  });

  describe('postStatisticalService', () => {
    it('should return an Observable<StatisticalRequest>', () => {
      const mockedStatisticalRequest: StatisticalRequest = {
        es: 0,
        hardness: 400,
        loadingType: 0,
        r: 0,
        rArea: 1,
        rz: 0,
        v90: 1,
      };

      const statisticalResult = mockedStatisticalResult;

      myProvider
        .postStatisticalService(mockedStatisticalRequest)
        .subscribe((loadsResult: any) => {
          expect(applicationInsightsService.logEvent).toHaveBeenCalled();
          expect(loadsResult).toEqual(statisticalResult);
        });

      const req = httpMock.expectOne(
        `${environment.baseUrl}/${myProvider.SERVER_URL_STATISTICAL}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(statisticalResult);
    });
  });
});
