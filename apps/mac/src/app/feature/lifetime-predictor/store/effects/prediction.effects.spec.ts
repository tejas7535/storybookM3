import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { PredictionEffects } from '.';
import { getPredictionRequest, getStatisticalRequest } from '..';
import {
  mockedLoadsResult,
  mockedStatisticalResult,
} from '../../mock/mock.constants';
import { MockService } from '../../mock/mock.service';
import { RestService } from '../../services/rest.service';

describe('PredictionEffects', () => {
  // eslint-disable-next-line
  let actions: Observable<any>;
  let effects: PredictionEffects;

  const mockedPredictionRequest = {
    prediction: 0,
    mpa: 400,
    v90: 1,
    hv: 180,
    hv_lower: 180,
    hv_upper: 180,
    rrelation: -1,
    burdeningType: 0,
    model: 5,
    spreading: 0,
    rArea: 5,
    es: 0,
    rz: 0,
    hv_core: 500,
    a90: 100,
    gradient: 1,
    multiaxiality: 0,
  };

  const mockedStatisticalRequest = {
    rz: 0,
    hardness: 180,
    es: 200,
    r: -1,
    rArea: 5,
    v90: 1,
    loadingType: 0,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PredictionEffects,
        { provide: RestService, useClass: MockService },
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            {
              selector: getPredictionRequest,
              value: mockedPredictionRequest,
            },
            {
              selector: getStatisticalRequest,
              value: mockedStatisticalRequest,
            },
          ],
        }),
      ],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(PredictionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should have a setPredictionRequest effect that calls the setMLRequest and setStatisticalRequest action', () => {
    actions = of({
      type: '[Input Component] Set Prediction Request',
      predictionRequest: mockedPredictionRequest,
      statisticalRequest: mockedStatisticalRequest,
    });

    effects.setPredictionRequest$.subscribe((action) => {
      expect(action).toEqual([
        {
          type: '[Predict Lifetime Container Component] Set ML Request',
          predictionRequest: mockedPredictionRequest,
        },
        {
          type:
            '[Predict Lifetime Container Component] Set Statistical Request',
          statisticalRequest: mockedStatisticalRequest,
        },
      ]);
    });
  });

  it('should have a postPrediction effect that calls the postPrediction action', () => {
    actions = of({
      type: '[Material Component] Set Hardness',
      selectedHardness: 400,
    });

    effects.postPrediction$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Prediction Component] Post Prediction',
      });
    });
  });

  it('should have a postMLPrediction effect that calls the setPredictionResult action', () => {
    actions = of({
      type: '[Input Component] Set ML Request',
      predictionRequest: mockedPredictionRequest,
    });

    effects.postMLPrediction$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Prediction Component] Set Prediction Results',
        predictionResult: undefined,
      });
    });
  });

  it('should have a postStatisticalPrediction effect that calls the setStatisticalResult action', () => {
    actions = of({
      type: '[Input Component] Set Statistical Request',
      statisticalRequest: mockedStatisticalRequest,
    });

    effects.postStatisticalPrediction$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Prediction Component] Set Statistical Results',
        statisticalResult: mockedStatisticalResult,
      });
    });
  });

  it('should have a setLoadsRequest effect that calls the postLoadsData action', () => {
    actions = of({
      type: '[Ouput Wohler Chart Component] Set Loads Request',
      loadsRequest: {
        data: [0, 1, 2, 3],
        status: 1,
        error: undefined,
        conversionFactor: 1,
        repetitionFactor: 1,
        method: 'FKM',
      },
    });

    effects.setLoadsRequest$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Ouput Wohler Chart Component] Get Load Data',
      });
    });
  });

  it('should have a postLoadsData effect effect that calls the setLoadsResult action', () => {
    actions = of({
      type: '[Ouput Wohler Chart Component] Get Load Data',
      loadsRequest: { status: 1, data: [1, 2, 3, 4] },
    });

    effects.postLoadsData$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Ouput Wohler Chart Component] Set Loads Result',
        ...mockedLoadsResult,
        status: 2,
        error: undefined,
      });
    });
  });
});
