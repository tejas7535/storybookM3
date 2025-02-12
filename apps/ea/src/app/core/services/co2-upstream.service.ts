import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { environment } from '@ea/environments/environment';

import {
  Co2ApiSearchResult,
  CO2UpstreamCalculationResult,
} from '../store/models';

@Injectable({ providedIn: 'root' })
export class CO2UpstreamService {
  readonly baseUrl = `${environment.co2UpstreamApiBaseUrl}public/`;

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
    }>(`${this.baseUrl}upstreamForDesignation/constant`, {
      designation: bearingDesignation,
      unitSet: 'SI',
    });
  }

  public findBearings(pattern: string): Observable<Co2ApiSearchResult[]> {
    return this.httpClient.post<Co2ApiSearchResult[]>(
      `${this.baseUrl}search/constant`,
      {
        pattern,
      }
    );
  }
}
