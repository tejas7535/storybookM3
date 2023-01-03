import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ExitEntryEmployeesResponse } from '../overview/models';
import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { LostJobProfilesResponse, WorkforceResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class LossOfSkillService {
  readonly JOB_PROFILES = 'job-profiles';
  readonly OPEN_POSITIONS = 'open-positions';
  readonly WORKFORCE = 'workforce';
  readonly LEAVERS = 'leavers';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getJobProfiles(
    employeesRequest: EmployeesRequest
  ): Observable<LostJobProfilesResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<LostJobProfilesResponse>(
      `${ApiVersion.V1}/${this.JOB_PROFILES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getWorkforce(
    employeesRequest: EmployeesRequest
  ): Observable<WorkforceResponse> {
    const params = this.paramsCreator.createHttpParamsForPositionDescription(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange,
      employeesRequest.positionDescription
    );

    return this.http.get<WorkforceResponse>(
      `${ApiVersion.V1}/${this.WORKFORCE}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getLeavers(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params = this.paramsCreator.createHttpParamsForPositionDescription(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange,
      employeesRequest.positionDescription
    );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.LEAVERS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
