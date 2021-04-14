import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PredictionRequest, StatisticalRequest } from '../models';
import { mockedStatisticalResult } from './../mock/mock.constants';
import { RestService } from './rest.service';

describe('RestService', () => {
  let myProvider: RestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService],
    });

    myProvider = TestBed.inject(RestService);
    httpMock = TestBed.inject(HttpTestingController);
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
      'fatigue_strength-1': 129.60351058284022,
      fatigue_strength0: 127.48671337634478,
      plot1: [
        [0, 0],
        [229.60351058284022, 229.60351058284022],
      ],
      plot2: [
        [0, 129.60351058284022],
        [127.48671337634478, 127.48671337634478],
      ],
    };

    it('should return an Observable<PredictionResult>', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 1)
        .subscribe((haighResult) => {
          expect(haighResult).toEqual(mockedHaighPrediction);
        });

      const req = httpMock.expectOne(
        `${myProvider.SERVER_URL_PREDICTION}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });

    it('should return PredictionResult for Woehler Chart', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 2)
        .subscribe((woehlerResult) => {
          expect(woehlerResult).toEqual(undefined);
        });

      const req = httpMock.expectOne(
        `${myProvider.SERVER_URL_PREDICTION}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });
  });

  describe('postLoadsData', () => {
    it('should return an Observable<any[]', () => {
      const mockedLoadsRequest = {
        conversionFactor: 1,
        repetitionFactor: 100,
        method: 'FKM',
        loads: [] as number[],
        fatigue_strength1: 1,
        fatigue_strength0: 2,
      };

      const mockedLoadsPrediction = {
        woehler: {},
      };

      myProvider.postLoadsData(mockedLoadsRequest).subscribe((loadsResult) => {
        expect(loadsResult).toEqual(mockedLoadsPrediction);
      });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL_LOADS}/score`);
      expect(req.request.method).toBe('POST');
      req.flush(mockedLoadsPrediction);
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
        .subscribe((loadsResult) => {
          expect(loadsResult).toEqual(statisticalResult);
        });

      const req = httpMock.expectOne(
        `${myProvider.SERVER_URL_STATISTICAL}/score`
      );
      expect(req.request.method).toBe('POST');
      req.flush(statisticalResult);
    });
  });
});
