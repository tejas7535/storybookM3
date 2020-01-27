import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import {
  mockedBurdeningTypes,
  mockedLoadsResult,
  mockedMaterials,
  mockedPredictionResult,
  mockedPredictions
} from './mock.constants';

import {
  BurdeningType,
  Material,
  Prediction,
  PredictionRequest
} from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  getMaterials(): Observable<Material[]> {
    return of(mockedMaterials);
  }

  getPredictions(): Observable<Prediction[]> {
    return of(mockedPredictions);
  }

  getBurdeningTypes(): Observable<BurdeningType[]> {
    return of(mockedBurdeningTypes);
  }

  postPrediction(
    _predictionRequest: PredictionRequest,
    mode: number
  ): Observable<any> {
    return mode === 2 ? of(mockedPredictionResult) : undefined;
  }

  postLoadsData(
    _loads: any,
    _predictionRequest: PredictionRequest
  ): Observable<any> {
    return of(mockedLoadsResult);
  }
}
