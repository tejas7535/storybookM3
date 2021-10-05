import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ApiVersion } from '../shared/models';
import { EmployeeAnalytics } from './models/employee-analytics.model';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsService {
  readonly EMPLOYEE_ANALYTICS = 'employee-analytics';

  constructor(private readonly http: HttpClient) {}

  getEmployeeAnalytics(): Observable<EmployeeAnalytics> {
    return this.http.get<EmployeeAnalytics>(
      `${ApiVersion.V1}/${this.EMPLOYEE_ANALYTICS}`,
      {
        context: withCache(),
      }
    );
  }
}
