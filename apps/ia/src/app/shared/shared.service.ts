import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  ApiVersion,
  EmployeesRequest,
  MonthlyFluctuationOverTime,
} from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly MONTHLY_FLUCTUATION_OVER_TIME = 'monthly-fluctuation-over-time';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<Record<MonthlyFluctuationOverTime, number[]>> {
    const params =
      this.paramsCreator.createHttpParamsForDimensionTimeRangeAndTypes(
        employeesRequest.filterDimension,
        employeesRequest.value,
        employeesRequest.timeRange,
        employeesRequest.type
      );

    return this.http.get<Record<MonthlyFluctuationOverTime, number[]>>(
      `${ApiVersion.V1}/${this.MONTHLY_FLUCTUATION_OVER_TIME}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
