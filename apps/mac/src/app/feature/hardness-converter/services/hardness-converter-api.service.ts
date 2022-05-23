import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { HardnessConversionResponse, HardnessUnitsResponse } from '../models';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HardnessConverterApiService {
  private readonly SCORE = 'hardness-conversion/api/score';

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public getUnits(): Observable<HardnessUnitsResponse> {
    return this.httpClient.post<HardnessUnitsResponse>(
      `${environment.baseUrl}/${this.SCORE}`,
      {
        unitList: true,
      }
    );
  }

  public getConversionResult(
    unit: string,
    value: number,
    deviation?: number
  ): Observable<HardnessConversionResponse> {
    const body = {
      value,
      deviation,
      unit_in: unit,
    };

    return this.httpClient
      .post<HardnessConversionResponse>(
        `${environment.baseUrl}/${this.SCORE}`,
        body
      )
      .pipe(
        map((response) => {
          this.applicationInsightService.logEvent('[MAC - HC - REQUEST]', {
            request: body,
            response,
          });

          return response;
        })
      );
  }
}
