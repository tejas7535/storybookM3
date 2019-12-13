import { Observable, of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { MockService } from '../../../mocks/mock.service';
import { RestService } from '../../services/rest.service';

import { PredictionState } from '../reducers/prediction.reducer';

import {
  mockedLoadsResult,
  mockedPredictionResult
} from '../../../mocks/mock.constants';

import { PredictionEffects } from '.';
import { getPredictionRequest } from '..';

describe('PredictionEffects', () => {
  // tslint:disable-next-line
  let actions: Observable<any>;
  let effects: PredictionEffects;
  const initialState = ({
    predictionRequest: {
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
      showFKM: false,
      showMurakami: false,
      es: 0,
      rz: 0,
      hv_core: 500,
      a90: 100,
      gradient: 1,
      multiaxiality: 0
    },
    predictionResult: undefined,
    woehlerPrediction: undefined,
    haighPrediction: undefined,
    loadsRequest: undefined,
    loads: undefined
  } as unknown) as PredictionState;

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
              value: {
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
                es: 0,
                rz: 0,
                hv_core: 500,
                a90: 100,
                gradient: 1,
                multiaxiality: 0
              }
            }
          ]
        })
      ],
      imports: [HttpClientTestingModule]
    });

    effects = TestBed.get(PredictionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should have a setPredictionRequest effect that calls the postPrediction action', () => {
    actions = of({ type: '[Input Component] Set Prediction Request' });

    effects.setPredictionRequest$.subscribe(action => {
      expect(action).toEqual({
        type: '[Predict Lifetime Container Component] Post Prediction'
      });
    });
  });

  it('should have a postPrediction effect that calls the setPredictionResults action', inject(
    [MockService],
    (mockService: MockService) => {
      actions = of({
        type: '[Predict Lifetime Container Component] Post Prediction'
      });

      effects.postPrediction$.subscribe(action => {
        expect(action).toEqual({
          type: '[Prediction Component] Set Prediction Results',
          predictionResult: mockedPredictionResult
        });
      });
    }
  ));

  it('should have a postLoadsData effect effect that calls the setLoadsResult action', inject(
    [MockService],
    (mockService: MockService) => {
      actions = of({
        type: '[Ouput Wohler Chart Component] Get Load Data',
        loadsRequest: { status: 1, data: [1, 2, 3, 4] }
      });

      effects.postLoadsData$.subscribe(action => {
        expect(action).toEqual({
          type: '[Ouput Wohler Chart Component] Set Loads Result',
          ...mockedLoadsResult,
          status: 2,
          error: undefined
        });
      });
    }
  ));
});
