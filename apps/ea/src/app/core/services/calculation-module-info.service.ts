import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ModuleCalculationModuleInfoResult } from './calculation-module-info.interface';

@Injectable({ providedIn: 'root' })
export class CalculationModuleInfoService {
  readonly baseUrl = `${environment.calculationModuleInfoApiBaseUrl}/v1/CalculationModuleInfo`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the available calculation modules for a given bearing
   * @param bearingDesignation name of the bearing
   */
  getCalculationInfo(
    bearingDesignation: string
  ): Observable<
    Pick<
      ModuleCalculationModuleInfoResult,
      'catalogueCalculation' | 'frictionCalculation'
    >
  > {
    if (!bearingDesignation) {
      return throwError(() => new Error('No bearing designation provided'));
    }

    return this.http
      .get<ModuleCalculationModuleInfoResult>(`${this.baseUrl}/module-info`, {
        params: { designation: bearingDesignation },
      })
      .pipe(
        map((response) => {
          if (!response) {
            throw new Error('No info returned');
          }

          return {
            catalogueCalculation: response.catalogueCalculation,
            frictionCalculation: response.frictionCalculation,
          };
        })
      );
  }
}
