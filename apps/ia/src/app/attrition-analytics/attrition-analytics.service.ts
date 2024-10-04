import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { EmployeeCluster } from './models';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsService {
  readonly AVAILABLE_CLUSTERS = 'available-clusters';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getAvailableClusters(
    request: EmployeesRequest
  ): Observable<EmployeeCluster[]> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      request.filterDimension,
      request.value,
      request.timeRange
    );

    return this.http.get<EmployeeCluster[]>(
      `${ApiVersion.V1}/${this.AVAILABLE_CLUSTERS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
