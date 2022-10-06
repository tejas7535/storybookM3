import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Observable, of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { mockedStatisticalResult } from '../../mock/mock.constants';
import { MockService } from '../../mock/mock.service';
import { RestService } from '../../services/rest.service';
import { getPredictionRequest, getStatisticalRequest } from '..';
import { PredictionEffects } from '.';

describe('PredictionEffects', () => {
  let spectator: SpectatorService<PredictionEffects>;
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

  const createService = createServiceFactory({
    service: PredictionEffects,
    imports: [HttpClientTestingModule],
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
  });

  beforeEach(() => {
    spectator = createService();

    effects = spectator.service;
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

    effects.setPredictionRequest$.subscribe((action: any) => {
      expect(action).toEqual([
        {
          type: '[Predict Lifetime Container Component] Set ML Request',
          predictionRequest: mockedPredictionRequest,
        },
        {
          type: '[Predict Lifetime Container Component] Set Statistical Request',
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

    effects.postPrediction$.subscribe((action: any) => {
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

    effects.postMLPrediction$.subscribe((action: any) => {
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

    effects.postStatisticalPrediction$.subscribe((action: any) => {
      expect(action).toEqual({
        type: '[Prediction Component] Set Statistical Results',
        statisticalResult: mockedStatisticalResult,
      });
    });
  });
});
