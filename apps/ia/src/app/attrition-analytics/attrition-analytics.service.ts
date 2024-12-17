import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { EmployeeAnalytics, EmployeeCluster } from './models';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsService {
  readonly AVAILABLE_CLUSTERS = 'available-clusters';
  readonly EMPLOYEE_ANALYTICS = 'employee-analytics';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getAvailableClusters(): Observable<EmployeeCluster[]> {
    return this.http.get<EmployeeCluster[]>(
      `${ApiVersion.V1}/${this.AVAILABLE_CLUSTERS}`,
      {
        context: withCache(),
      }
    );
  }

  getEmployeeAnalytics(
    request: EmployeesRequest
  ): Observable<EmployeeAnalytics[]> {
    const params =
      this.paramsCreator.createHttpParamsForDimensionTimeRangeAndCluster(
        request.filterDimension,
        request.value,
        request.timeRange,
        request.cluster
      );

    return this.http.get<EmployeeAnalytics[]>(
      `${ApiVersion.V1}/${this.EMPLOYEE_ANALYTICS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
