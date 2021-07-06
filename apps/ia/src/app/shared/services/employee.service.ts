import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  LostJobProfile,
  LostJobProfilesResponse,
} from '../../loss-of-skills/models';
import { CountryData } from '../../organizational-view/world-map/models/country-data.model';
import {
  AttritionOverTime,
  EmployeesRequest,
  FluctuationRatesChartData,
  InitialFiltersResponse,
  OrgChartResponse,
  ParentEmployeeResponse,
  TimePeriod,
  WorldMapResponse,
} from '../models';
import { Employee } from '../models/employee.model';
import { OverviewFluctuationRates } from '../models/overview-fluctuation-rates.model';

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

  private readonly FLUCTUATION_RATES_CHART = 'fluctuation-rates-chart';
  private readonly UNFORCED_FLUCTUATION_RATES_CHART =
    'unforced-fluctuation-rates-chart';

  private readonly PARAM_CHILD_EMPLOYEE_ID = 'child_employee_id';

  static employeeLeftInTimeRange(
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

  // TODO: do not send date objects to frontend
  static fixIncomingEmployeeProps(employee: Employee): Employee {
    employee.exitDate = employee.exitDate
      ? new Date(employee.exitDate).toJSON()
      : undefined;
    employee.entryDate = employee.entryDate
      ? new Date(employee.entryDate).toJSON()
      : undefined;

    return employee;
  }

  constructor(private readonly dataService: DataService) {}

  getInitialFilters(): Observable<InitialFiltersResponse> {
    return this.dataService.getAll<InitialFiltersResponse>(
      this.INITIAL_FILTERS
    );
  }

  getOverviewFluctuationRates(
    employeesRequest: EmployeesRequest
  ): Observable<OverviewFluctuationRates> {
    return this.dataService.post<OverviewFluctuationRates>(
      this.OVERVIEW_FLUCTUATION_RATES,
      employeesRequest
    );
  }

  getOrgChart(employeesRequest: EmployeesRequest): Observable<Employee[]> {
    return this.dataService
      .post<OrgChartResponse>(this.ORG_CHART, employeesRequest)
      .pipe(
        map((response) => [
          ...response.employees.map((employee) =>
            EmployeeService.fixIncomingEmployeeProps(employee)
          ),
        ])
      );
  }

  getWorldMap(employeesRequest: EmployeesRequest): Observable<CountryData[]> {
    return this.dataService
      .post<WorldMapResponse>(this.WORLD_MAP, employeesRequest)
      .pipe(map((response) => response.data));
  }

  getParentEmployee(childEmployeeId: string): Observable<Employee> {
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

  getAttritionOverTime(
    employeesRequest: EmployeesRequest,
    timePeriod: TimePeriod
  ): Observable<AttritionOverTime> {
    return this.dataService.post<AttritionOverTime>(
      `${this.ATTRITION_OVER_TIME}?time_period=${timePeriod}`,
      employeesRequest
    );
  }

  getLostJobProfiles(
    employeesRequest: EmployeesRequest
  ): Observable<LostJobProfile[]> {
    return this.dataService
      .post<LostJobProfilesResponse>(this.LOST_JOB_PROFILES, employeesRequest)
      .pipe(map((response) => response.lostJobProfiles));
  }

  getFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    return this.dataService.post<FluctuationRatesChartData>(
      this.FLUCTUATION_RATES_CHART,
      employeesRequest
    );
  }

  getUnforcedFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    return this.dataService.post<FluctuationRatesChartData>(
      this.UNFORCED_FLUCTUATION_RATES_CHART,
      employeesRequest
    );
  }
}
