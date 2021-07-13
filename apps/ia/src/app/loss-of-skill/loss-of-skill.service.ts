import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { EmployeesRequest } from '../shared/models';
import { LostJobProfile, LostJobProfilesResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class LossOfSkillService {
  readonly LOST_JOB_PROFILES = 'lost-job-profiles';

  constructor(
    private readonly dataService: DataService,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getLostJobProfiles(
    employeesRequest: EmployeesRequest
  ): Observable<LostJobProfile[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.dataService
      .getAll<LostJobProfilesResponse>(this.LOST_JOB_PROFILES, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.lostJobProfiles));
  }
}
