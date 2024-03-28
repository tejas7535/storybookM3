import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMMaterial,
  AQMMaterialsResponse,
  AQMMaterialsResponseRaw,
} from '../models';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AqmCalculatorApiService {
  private readonly SCORE = 'aqm-calculation/api/score';

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public getMaterialsData(): Observable<AQMMaterialsResponse> {
    return this.httpClient
      .post<AQMMaterialsResponseRaw>(`${environment.baseUrl}/${this.SCORE}`, {})
      .pipe(
        map((response) => {
          const materials = response.materials.map(
            (material) =>
              ({
                id: material.name,
                title: material.name,
                data: {
                  c: material.c,
                  si: material.si,
                  mn: material.mn,
                  cr: material.cr,
                  mo: material.mo,
                  ni: material.ni,
                },
              }) as AQMMaterial
          );

          return {
            ...response,
            materials,
          };
        })
      );
  }

  public getCalculationResult(
    request: AQMCalculationRequest
  ): Observable<AQMCalculationResponse> {
    return this.httpClient
      .post(`${environment.baseUrl}/${this.SCORE}`, { composition: request })
      .pipe(
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
