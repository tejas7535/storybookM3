import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import worldJson from '../../assets/world.json';
import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  ApiVersion,
  AttritionOverTime,
  Employee,
  EmployeesRequest,
  TimePeriod,
} from '../shared/models';
import { OrgChartResponse, ParentEmployeeResponse } from './org-chart/models';
import { CountryData, WorldMapResponse } from './world-map/models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationalViewService {
  readonly ORG_CHART = 'org-chart';
  readonly WORLD_MAP = 'world-map';
  readonly EMPLOYEE = 'parent-employee';
  readonly ATTRITION_OVER_TIME = 'attrition-over-time';

  readonly PARAM_CHILD_EMPLOYEE_ID = 'child_employee_id';
  readonly PARAM_CHILD_EMPLOYEE_REPORT_DATE = 'child_employee_report_date';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgChart(employeesRequest: EmployeesRequest): Observable<Employee[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgChartResponse>(`${ApiVersion.V1}/${this.ORG_CHART}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.employees));
  }

  addContinentToCountryData(countryData: CountryData[]): CountryData[] {
    return countryData.map((country) => ({
      ...country,
      continent: (worldJson as any).features.find(
        (elem: any) => elem.properties.name === country.name
      )?.properties.continent,
    }));
  }

  getWorldMap(employeesRequest: EmployeesRequest): Observable<CountryData[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<WorldMapResponse>(`${ApiVersion.V1}/${this.WORLD_MAP}`, {
        params,
        context: withCache(),
      })
      .pipe(
        map((response) => response.data),
        map((countryData) => this.addContinentToCountryData(countryData))
      );
  }

  getParentEmployee(
    childEmployeeId: string,
    childEmployeeReportDate: string
  ): Observable<Employee> {
    const params = new HttpParams()
      .set(this.PARAM_CHILD_EMPLOYEE_ID, childEmployeeId)
      .set(this.PARAM_CHILD_EMPLOYEE_REPORT_DATE, childEmployeeReportDate);

    return this.http
      .get<ParentEmployeeResponse>(`${ApiVersion.V1}/${this.EMPLOYEE}`, {
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

    return this.http.get<AttritionOverTime>(
      `${ApiVersion.V1}/${this.ATTRITION_OVER_TIME}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
