import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ExitEntryEmployeesResponse } from '../overview/models';
import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { ReasonForLeavingStats } from './models/reason-for-leaving-stats.model';

@Injectable({
  providedIn: 'root',
})
export class ReasonsAndCounterMeasuresService {
  readonly REASONS_WHY_PEOPLE_LEFT = 'reasons-why-people-left';
  readonly REASONS_LEAVERS = 'reasons-leavers';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getReasonsWhyPeopleLeft(
    employeesRequest: EmployeesRequest
  ): Observable<ReasonForLeavingStats> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<ReasonForLeavingStats>(
      `${ApiVersion.V1}/${this.REASONS_WHY_PEOPLE_LEFT}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getLeaversByReason(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params =
      this.paramsCreator.createHttpParamsForDimensionTimeRangeAndReason(
        employeesRequest.filterDimension,
        employeesRequest.value,
        employeesRequest.timeRange,
        employeesRequest.reasonId
      );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.REASONS_LEAVERS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
