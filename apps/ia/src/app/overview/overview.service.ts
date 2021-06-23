import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { ResignedEmployee, ResignedEmployeesResponse } from './models';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private readonly RESIGNED_EMPLOYEES = 'resigned-employees';

  private readonly PARAM_ORG_UNIT = 'org_unit';

  constructor(private readonly dataService: DataService) {}

  getResignedEmployees(orgUnit: string): Observable<ResignedEmployee[]> {
    const params = new HttpParams().set(this.PARAM_ORG_UNIT, orgUnit);

    return this.dataService
      .getAll<ResignedEmployeesResponse>(this.RESIGNED_EMPLOYEES, { params })
      .pipe(map((response) => response.employees));
  }
}
