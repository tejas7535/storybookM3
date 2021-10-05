import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import { LostJobProfile, LostJobProfilesResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class LossOfSkillService {
  readonly LOST_JOB_PROFILES = 'lost-job-profiles';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getLostJobProfiles(
    employeesRequest: EmployeesRequest
  ): Observable<LostJobProfile[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<LostJobProfilesResponse>(
        `${ApiVersion.V1}/${this.LOST_JOB_PROFILES}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(map((response) => response.lostJobProfiles));
  }
}
