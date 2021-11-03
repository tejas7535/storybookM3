import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ApiVersion } from '../shared/models';
import { EmployeeAnalytics } from './models/employee-analytics.model';
import { FeatureParams } from './models/feature-params.model';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsService {
  readonly EMPLOYEE_ANALYTICS = 'employee-analytics';
  readonly AVAILABLE_FEATURES = 'available-features';

  constructor(private readonly http: HttpClient) {}

  getAvailableFeatures(): Observable<FeatureParams[]> {
    return this.http.get<FeatureParams[]>(
      `${ApiVersion.V1}/${this.AVAILABLE_FEATURES}`,
      {
        context: withCache(),
      }
    );
  }

  getEmployeeAnalytics(
    requestedFeatures: FeatureParams[]
  ): Observable<EmployeeAnalytics[]> {
    return this.http.post<EmployeeAnalytics[]>(
      `${ApiVersion.V1}/${this.EMPLOYEE_ANALYTICS}`,
      requestedFeatures
    );
  }
}
