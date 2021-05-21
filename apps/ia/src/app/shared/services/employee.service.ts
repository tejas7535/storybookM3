import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { CountryData } from '../../organizational-view/world-map/models/country-data.model';
import {
  AttritionOverTime,
  EmployeesRequest,
  InitialFiltersResponse,
  LostJobProfile,
  OrgChartResponse,
  ParentEmployeeResponse,
  TimePeriod,
  WorldMapResponse,
} from '../models';
import { Employee } from '../models/employee.model';
import { OverviewFluctuationRates } from '../models/overview-fluctuation-rates';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly INITIAL_FILTERS = 'initial-filters';
  private readonly OVERVIEW_FLUCTUATION_RATES = 'overview-fluctuation-rates';
  private readonly ORG_CHART = 'org-chart';
  private readonly WORLD_MAP = 'world-map';
  private readonly EMPLOYEE = 'parent-employee';
  private readonly ATTRITION_OVER_TIME = 'attrition-over-time';
  private readonly LOST_JOB_PROFILES = 'lost-job-profiles';

  private readonly PARAM_CHILD_EMPLOYEE_ID = 'child_employee_id';

  public static employeeLeftInTimeRange(
    employee: Employee,
    timeRange: string
  ): boolean {
    const date = new Date(employee.exitDate);

    return (
      date &&
      date.getTime() >= +timeRange.split('|')[0] &&
      date.getTime() <= +timeRange.split('|')[1]
    );
  }

  public static fixIncomingEmployeeProps(employee: Employee): Employee {
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

  public getOverviewFluctuationRates(
    employeesRequest: EmployeesRequest
  ): Observable<OverviewFluctuationRates> {
    return this.dataService.post<OverviewFluctuationRates>(
      this.OVERVIEW_FLUCTUATION_RATES,
      employeesRequest
    );
  }

  public getOrgChart(
    employeesRequest: EmployeesRequest
  ): Observable<Employee[]> {
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

  public getParentEmployee(childEmployeeId: string): Observable<Employee> {
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
    employeesRequest: EmployeesRequest,
    timePeriod: TimePeriod
  ): Observable<AttritionOverTime> {
    return this.dataService.post<AttritionOverTime>(
      `${this.ATTRITION_OVER_TIME}?time_period=${timePeriod}`,
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
