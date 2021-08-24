import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { EmployeeAnalytics } from './models/employee-analytics.model';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsService {
  readonly EMPLOYEE_ANALYTICS = 'employee-analytics';

  constructor(private readonly dataService: DataService) {}

  getEmployeeAnalytics(): Observable<EmployeeAnalytics> {
    return this.dataService.getAll<EmployeeAnalytics>(this.EMPLOYEE_ANALYTICS, {
      context: withCache(),
    });
  }
}
