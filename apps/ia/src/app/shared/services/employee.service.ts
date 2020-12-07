import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { OrgChartEmployee } from '../../overview/org-chart/models/org-chart-employee.model';
import { CountryData } from '../../overview/world-map/models/country-data.model';
import {
  EmployeesRequest,
  InitialFiltersResponse,
  OrgChartResponse,
  WorldMapResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly INITIAL_FILTERS = 'initial-filters';
  private readonly ORG_CHART = 'org-chart';
  private readonly WORLD_MAP = 'world-map';

  public static employeeLeftInTimeRange(
    employee: OrgChartEmployee,
    timeRange: string
  ): boolean {
    return (
      employee.exitDate &&
      employee.exitDate.getTime() >= +timeRange.split('|')[0] &&
      employee.exitDate.getTime() <= +timeRange.split('|')[1]
    );
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
        map((response) => this.fixIncomingEmployeeProps(response.employees))
      );
  }

  public getWorldMap(
    employeesRequest: EmployeesRequest
  ): Observable<CountryData[]> {
    return this.dataService
      .post<WorldMapResponse>(this.WORLD_MAP, employeesRequest)
      .pipe(map((response) => response.data));
  }

  public fixIncomingEmployeeProps(
    employees: OrgChartEmployee[]
  ): OrgChartEmployee[] {
    return employees.map((employee) => {
      employee.exitDate = employee.exitDate
        ? new Date(employee.exitDate)
        : undefined;
      employee.terminationDate = employee.terminationDate
        ? new Date(employee.terminationDate)
        : undefined;
      employee.entryDate = employee.entryDate
        ? new Date(employee.entryDate)
        : undefined;

      return employee;
    });
  }
}
