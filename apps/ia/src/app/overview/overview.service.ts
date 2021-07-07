import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  OpenApplication,
  ResignedEmployee,
  ResignedEmployeesResponse,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  readonly RESIGNED_EMPLOYEES = 'resigned-employees';
  readonly OPEN_APPLICATIONS = 'open-applications';

  readonly PARAM_ORG_UNIT = 'org_unit';

  constructor(private readonly dataService: DataService) {}

  getResignedEmployees(orgUnit: string): Observable<ResignedEmployee[]> {
    const params = this.createHttpParamsForOrgUnit(orgUnit);

    return this.dataService
      .getAll<ResignedEmployeesResponse>(this.RESIGNED_EMPLOYEES, { params })
      .pipe(map((response) => response.employees));
  }

  getOpenApplications(orgUnit: string): Observable<OpenApplication[]> {
    const params = this.createHttpParamsForOrgUnit(orgUnit);

    return this.dataService.getAll<OpenApplication[]>(this.OPEN_APPLICATIONS, {
      params,
    });
  }

  createHttpParamsForOrgUnit(orgUnit: string) {
    return new HttpParams().set(this.PARAM_ORG_UNIT, orgUnit);
  }
}
