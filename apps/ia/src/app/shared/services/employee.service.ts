import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { OrgChartEmployee } from '../../overview/org-chart/models/org-chart-employee.model';
import { CountryData } from '../../overview/world-map/models/country-data.model';
import {
  AttritionOverTime,
  EmployeesRequest,
  InitialFiltersResponse,
  LostJobProfile,
  OrgChartResponse,
  ParentEmployeeResponse,
  WorldMapResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly INITIAL_FILTERS = 'initial-filters';
  private readonly ORG_CHART = 'org-chart';
  private readonly WORLD_MAP = 'world-map';
  private readonly EMPLOYEE = 'parent-employee';
  private readonly ATTRITION_OVER_TIME = 'attrition-over-time';
  private readonly LOST_JOB_PROFILES = 'lost-job-profiles';

  private readonly PARAM_CHILD_EMPLOYEE_ID = 'child_employee_id';

  public static employeeLeftInTimeRange(
    employee: OrgChartEmployee,
    timeRange: string
  ): boolean {
    const date = new Date(employee.exitDate);

    return (
      date &&
      date.getTime() >= +timeRange.split('|')[0] &&
      date.getTime() <= +timeRange.split('|')[1]
    );
  }

  public static fixIncomingEmployeeProps(
    employee: OrgChartEmployee
  ): OrgChartEmployee {
    employee.exitDate = employee.exitDate
      ? new Date(employee.exitDate).toJSON()
      : undefined;
    employee.terminationDate = employee.terminationDate
      ? new Date(employee.terminationDate).toJSON()
      : undefined;
    employee.entryDate = employee.entryDate
      ? new Date(employee.entryDate).toJSON()
      : undefined;

    return employee;
  }

  public constructor(private readonly dataService: DataService) {}

  public getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.dataService.getAll<InitialFiltersResponse>(
      this.INITIAL_FILTERS
    );
  }

  public getOrgChart(
    employeesRequest: EmployeesRequest
  ): Observable<OrgChartEmployee[]> {
    return this.dataService
      .post<OrgChartResponse>(this.ORG_CHART, employeesRequest)
      .pipe(
        map((response) => [
          ...response.employees.map(EmployeeService.fixIncomingEmployeeProps),
        ])
      );
  }

  public getWorldMap(
    employeesRequest: EmployeesRequest
  ): Observable<CountryData[]> {
    return this.dataService
      .post<WorldMapResponse>(this.WORLD_MAP, employeesRequest)
      .pipe(map((response) => response.data));
  }

  public getParentEmployee(
    childEmployeeId: string
  ): Observable<OrgChartEmployee> {
    const params = new HttpParams().set(
      this.PARAM_CHILD_EMPLOYEE_ID,
      childEmployeeId
    );

    return this.dataService
      .getAll<ParentEmployeeResponse>(this.EMPLOYEE, { params })
      .pipe(
        map((response) =>
          EmployeeService.fixIncomingEmployeeProps(response.employee)
        )
      );
  }

  public getAttritionOverTime(
    employeesRequest: EmployeesRequest
  ): Observable<AttritionOverTime> {
    return this.dataService.post<AttritionOverTime>(
      this.ATTRITION_OVER_TIME,
      employeesRequest
    );
  }

  public getLostJobProfiles(
    employeesRequest: EmployeesRequest
  ): Observable<LostJobProfile[]> {
    return this.dataService.post<LostJobProfile[]>(
      this.LOST_JOB_PROFILES,
      employeesRequest
    );
  }
}
