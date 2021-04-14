import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { PredictionRequest } from '../models';
import { mockedPredictionResult } from './mock.constants';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  postPrediction(
    _predictionRequest: PredictionRequest,
    _otherValue: any
  ): Observable<any> {
    return of(mockedPredictionResult);
  }
}
