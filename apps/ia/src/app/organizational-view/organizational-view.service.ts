import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  AttritionOverTime,
  EmployeesRequest,
  OrgChartResponse,
  ParentEmployeeResponse,
  TimePeriod,
  WorldMapResponse,
} from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { CountryData } from './world-map/models/country-data.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationalViewService {
  readonly ORG_CHART = 'org-chart';
  readonly WORLD_MAP = 'world-map';
  readonly EMPLOYEE = 'parent-employee';
  readonly ATTRITION_OVER_TIME = 'attrition-over-time';

  readonly PARAM_CHILD_EMPLOYEE_ID = 'child_employee_id';

  constructor(
    private readonly dataService: DataService,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgChart(employeesRequest: EmployeesRequest): Observable<Employee[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.dataService
      .getAll<OrgChartResponse>(this.ORG_CHART, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.employees));
  }

  getWorldMap(employeesRequest: EmployeesRequest): Observable<CountryData[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.dataService
      .getAll<WorldMapResponse>(this.WORLD_MAP, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.data));
  }

  getParentEmployee(childEmployeeId: string): Observable<Employee> {
    const params = new HttpParams().set(
      this.PARAM_CHILD_EMPLOYEE_ID,
      childEmployeeId
    );

    return this.dataService
      .getAll<ParentEmployeeResponse>(this.EMPLOYEE, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.employee));
  }

  getAttritionOverTime(
    employeesRequest: EmployeesRequest,
    timePeriod: TimePeriod
  ): Observable<AttritionOverTime> {
    const params =
      this.paramsCreator.createHttpParamsForOrgUnitTimeRangeAndTimePeriod(
        employeesRequest.orgUnit,
        employeesRequest.timeRange,
        timePeriod
      );

    return this.dataService.getAll<AttritionOverTime>(
      this.ATTRITION_OVER_TIME,
      { params, context: withCache() }
    );
  }
}
