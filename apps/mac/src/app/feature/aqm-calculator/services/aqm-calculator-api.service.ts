import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
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

  public constructor(
    private readonly dataService: DataService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public getMaterialsData(): Observable<AQMMaterialsResponse> {
    return this.dataService.post<AQMMaterialsResponse>(this.SCORE, {});
  }

  public getCalculationResult(
    request: AQMCalculationRequest
  ): Observable<AQMCalculationResponse> {
    return this.dataService.post(this.SCORE, { composition: request }).pipe(
      map((response: any) => {
        this.applicationInsightService.logEvent('[MAC - AQM - REQUEST]', {
          request,
          response,
        });

        return response as AQMCalculationResponse;
      })
    );
  }
}
