import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { environment } from '@ea/environments/environment';

import {
  DownstreamAPIRequest,
  DownstreamAPIResponse,
} from './downstream-calculation.service.interface';

@Injectable({ providedIn: 'root' })
export class DownstreamCalculationService {
  public readonly downstreamCo2ApiBaseUrl = `${environment.downstreamCo2ApiUrl}/v2/`;
  constructor(private readonly httpService: HttpClient) {}

  getDownstreamCalculation(
    designation: string,
    calculationParameters: DownstreamAPIRequest
  ) {
    return this.httpService.post<DownstreamAPIResponse>(
      `${this.downstreamCo2ApiBaseUrl}co2ecalculation/calculate?designation=${designation}`,
      calculationParameters
    );
  }

  getCanCalculate(designation: string) {
    return this.httpService
      .get<{
        available: boolean;
      }>(
        `${this.downstreamCo2ApiBaseUrl}co2ecalculation/cancalculate?designation=${designation}`
      )
      .pipe(map(({ available }) => available));
  }
}
