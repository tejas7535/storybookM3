import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { PredictionRequest } from '../shared/models';
import { mockedPredictionResult } from './mock.constants';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  postPrediction(
    _predictionRequest: PredictionRequest,
    mode: number
  ): Observable<any> {
    return mode === 2 ? of(mockedPredictionResult) : undefined;
  }

  // postLoadsData(
  //   _loads: any,
  //   _predictionRequest: PredictionRequest
  // ): Observable<any> {
  //   return of(mockedLoadsResult);
  // }
}
