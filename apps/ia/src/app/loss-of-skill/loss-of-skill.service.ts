import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { JobProfile, OpenPosition } from './models';

@Injectable({
  providedIn: 'root',
})
export class LossOfSkillService {
  readonly JOB_PROFILES = 'job-profiles';
  readonly OPEN_POSITIONS = 'open-positions';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getJobProfiles(employeesRequest: EmployeesRequest): Observable<JobProfile[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http.get<JobProfile[]>(
      `${ApiVersion.V1}/${this.JOB_PROFILES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getOpenPositions(
    employeesRequest: EmployeesRequest
  ): Observable<OpenPosition[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(
      employeesRequest.orgUnit
    );

    return this.http.get<OpenPosition[]>(
      `${ApiVersion.V1}/${this.OPEN_POSITIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
