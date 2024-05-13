import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@hc/environments/environment';
import { LinkGroups } from '@hc/models/resource-links.model';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  ConversionRequest,
  ConversionResponse,
  IndentationRequest,
  IndentationResponse,
  Info,
  UnitsRequest,
  UnitsResponse,
} from '../models';

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

  public getIndentation(indentationRequest: IndentationRequest, unit: string) {
    return this.httpClient
      .post<IndentationResponse>(
        `${this.BASE_URL}/indentation/${unit}`,
        indentationRequest
      )
      .pipe(
        map((response) => {
          this.applicationInsightService.logEvent(
            '[MAC - HC - INDENTATION REQUEST]',
            {
              request: indentationRequest,
              response,
            }
          );

          return response;
        })
      );
  }

  public getResourceLinks(): Observable<LinkGroups> {
    return this.httpClient
      .get(`${this.BASE_URL}/links`)
      .pipe(map((groups) => groups as LinkGroups));
  }
}
