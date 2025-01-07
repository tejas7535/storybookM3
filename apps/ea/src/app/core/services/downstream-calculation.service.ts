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
  constructor(private readonly httpService: HttpClient) {}

  getDownstreamCalculation(
    designation: string,
    calculationParameters: DownstreamAPIRequest
  ) {
    return this.httpService.post<DownstreamAPIResponse>(
      `${environment.downstreamCo2ApiUrl}co2ecalculation/calculate?designation=${designation}`,
      calculationParameters
    );
  }

  getCanCalculate(designation: string) {
    return this.httpService
      .get<{
        available: boolean;
      }>(
        `${environment.downstreamCo2ApiUrl}co2ecalculation/cancalculate?designation=${designation}`
      )
      .pipe(map(({ available }) => available));
  }
}
