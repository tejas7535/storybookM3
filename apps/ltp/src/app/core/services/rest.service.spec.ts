import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { RestService } from './rest.service';

import { mockedMaterials } from '../../mocks/mock.constants';
import {
  BurdeningType,
  Model,
  Prediction,
  PredictionRequest
} from '../../shared/models';

describe('RestService', () => {
  let myProvider: RestService;
  let httpMock: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService]
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

  describe('getModels', () => {
    it('should return an Observable<Model[]>', () => {
      const mockedModels: Model[] = [
        { id: 0, name: 'WOEHLER_CURVE' },
        { id: 1, name: 'HAIGH_CURVE' }
      ];

      myProvider.getModels().subscribe(models => {
        expect(models.length).toBe(2);
        expect(models).toEqual(mockedModels);
      });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/getModels`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedModels);
    });
  });

  describe('getPredictions', () => {
    it('should return an Observable<Model[]>', () => {
      const mockedPredictions: Prediction[] = [
        { id: 0, name: 'Arnold Strong' },
        { id: 1, name: 'Silvester Stallone' }
      ];

      myProvider.getPredictions().subscribe(models => {
        expect(models.length).toBe(2);
        expect(models).toEqual(mockedPredictions);
      });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/getPredictions`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedPredictions);
    });
  });

  describe('getBurdeningTypes', () => {
    it('should return an Observable<Model[]>', () => {
      const mockedBurdeningTypes: BurdeningType[] = [
        { id: 0, name: 'Jet Lee' },
        { id: 1, name: 'Tyson Fury' }
      ];

      myProvider.getBurdeningTypes().subscribe(models => {
        expect(models.length).toBe(2);
        expect(models).toEqual(mockedBurdeningTypes);
      });

      const req = httpMock.expectOne(
        `${myProvider.SERVER_URL}/getBurdeningTypes`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockedBurdeningTypes);
    });
  });

  describe('#getMaterials', () => {
    it('should return an Observable<Material[]', () => {
      myProvider
        .getMaterials()
        .subscribe(materials => expect(materials).toEqual(mockedMaterials));

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/getMaterials`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedMaterials);
    });
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
      multiaxiality: 0
    };

    const mockedHaighPrediction = {
      'fatigue_strength-1': 129.60351058284022,
      fatigue_strength0: 127.48671337634478,
      plot1: [[0, 0], [229.60351058284022, 229.60351058284022]],
      plot2: [[0, 129.60351058284022], [127.48671337634478, 127.48671337634478]]
    };

    it('should return an Observable<PredictionResult>', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 1)
        .subscribe(haighResult => {
          expect(haighResult).toEqual(mockedHaighPrediction);
        });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/predictor`);
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });

    it('should return PredictionResult for Woehler Chart', () => {
      myProvider
        .postPrediction(mockedPredictionRequest, 2)
        .subscribe(woehlerResult => {
          expect(woehlerResult).toEqual(undefined);
        });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/predictor`);
      expect(req.request.method).toBe('POST');
      req.flush(mockedHaighPrediction);
    });
  });

  describe('postLoadsData', () => {
    it('should return an Observable<any[]', () => {
      const mockedLoads = {};
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
        multiaxiality: 0
      };

      const mockedLoadsPrediction = {
        woehler: {},
        loads: { x: [] as number[], y: [] as number[] }
      };

      myProvider
        .postLoadsData(mockedLoads, mockedPredictionRequest)
        .subscribe(loadsResult => {
          expect(loadsResult).toEqual(mockedLoadsPrediction);
        });

      const req = httpMock.expectOne(`${myProvider.SERVER_URL}/loads`);
      expect(req.request.method).toBe('POST');
      req.flush(mockedLoadsPrediction);
    });
  });
});
