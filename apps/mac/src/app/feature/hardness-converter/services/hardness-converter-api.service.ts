import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { DataService } from '@schaeffler/http';

import {
  HardnessConversionResponse,
  HardnessUnitsResponse,
} from './hardness-converter-response.model';

@Injectable({
  providedIn: 'root',
})
export class HardnessConverterApiService {
  private readonly SCORE = 'hardness-conversion/api/score';

  public constructor(
    private readonly dataService: DataService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public getUnits(): Observable<string[]> {
    return this.dataService
      .post<HardnessUnitsResponse>(this.SCORE, { unitList: true })
      .pipe(map((response) => response.units));
  }

  public getConversionResult(
    unit: string,
    value: number
  ): Observable<HardnessConversionResponse> {
    const body = {
      value,
      unit_in: unit,
    };

    return this.dataService
      .post<HardnessConversionResponse>(this.SCORE, body)
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
