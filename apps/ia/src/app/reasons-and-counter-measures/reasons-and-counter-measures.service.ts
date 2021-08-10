import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { EmployeesRequest } from '../shared/models';
import { ReasonForLeavingStats } from './models/reason-for-leaving-stats.model';

@Injectable({
  providedIn: 'root',
})
export class ReasonsAndCounterMeasuresService {
  readonly REASONS_WHY_PEOPLE_LEFT = 'reasons-why-people-left';

  constructor(
    private readonly dataService: DataService,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getReasonsWhyPeopleLeft(
    employeesRequest: EmployeesRequest
  ): Observable<ReasonForLeavingStats[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.dataService.getAll<ReasonForLeavingStats[]>(
      this.REASONS_WHY_PEOPLE_LEFT,
      { params, context: withCache() }
    );
  }
}
