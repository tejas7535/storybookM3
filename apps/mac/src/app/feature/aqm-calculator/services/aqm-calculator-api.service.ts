import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMMaterialsResponse,
} from './aqm-calulator-response.model';

@Injectable({
  providedIn: 'root',
})
export class AqmCalculatorApiService {
  private readonly SCORE = 'aqm-calculation/api/score';

  constructor(private readonly dataService: DataService) {}

  public getMaterialsData(): Observable<AQMMaterialsResponse> {
    return this.dataService.post<AQMMaterialsResponse>(this.SCORE, {});
  }

  public getCalculationResult(
    request: AQMCalculationRequest
  ): Observable<AQMCalculationResponse> {
    return this.dataService.post(this.SCORE, { composition: request });
  }
}
