import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { environment } from '@ea/environments/environment';

import { CO2UpstreamCalculationResult } from '../store/models';

@Injectable({ providedIn: 'root' })
export class CO2UpstreamService {
  readonly baseUrl = `${environment.co2UpstreamApiBaseUrl}/v1`;

  constructor(private readonly httpClient: HttpClient) {}

  public getCO2UpstreamForDesignation(
    bearingDesignation: string
  ): Observable<CO2UpstreamCalculationResult | undefined> {
    if (!bearingDesignation) {
      return throwError(() => new Error('bearingDesignation must be provided'));
    }

    return this.httpClient.post<{
      weight: number;
      upstreamEmissionFactor: number;
      upstreamEmissionTotal: number;
      unit: string;
    }>(`${this.baseUrl}/public/upstreamForDesignation`, {
      designation: bearingDesignation,
      unitSet: 'SI',
    });
  }
}
