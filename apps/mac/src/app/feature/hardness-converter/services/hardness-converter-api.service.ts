import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { environment } from '@mac/environments/environment';
import {
  ConversionRequest,
  ConversionResponse,
  Info,
  UnitsRequest,
  UnitsResponse,
} from '@mac/feature/hardness-converter/models';

@Injectable({
  providedIn: 'root',
})
export class HardnessConverterApiService {
  private readonly BASE_URL = `${environment.baseUrl}/hardness-conversion/api`;

  public constructor(
    private readonly httpClient: HttpClient,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public getInfo() {
    return this.httpClient.get<Info>(`${this.BASE_URL}/info`);
  }

  public getUnits(unitsRequest: UnitsRequest) {
    return this.httpClient.post<UnitsResponse>(
      `${this.BASE_URL}/units`,
      unitsRequest
    );
  }

  public getConversion(conversionRequest: ConversionRequest) {
    return this.httpClient
      .post<ConversionResponse>(
        `${this.BASE_URL}/conversion`,
        conversionRequest
      )
      .pipe(
        map((response) => {
          this.applicationInsightService.logEvent('[MAC - HC - REQUEST]', {
            request: conversionRequest,
            response,
          });

          return response;
        })
      );
  }
}
