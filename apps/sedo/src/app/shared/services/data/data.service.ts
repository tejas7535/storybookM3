import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { UpdateDatesParams } from '../../models/dates-update.model';
import { UpdateIgnoreFlagParams } from '../../models/ignore-flag-update.model';
import { SalesSummary } from '../../models/sales-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly http: HttpClient) {}

  public async getAllSales(): Promise<SalesSummary> {
    return this.http
      .get<SalesSummary>(`${environment.apiBaseUrl}/sales/all`)
      .toPromise();
  }

  public async updateDates(
    updateDatesParams: UpdateDatesParams
  ): Promise<void> {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/sales/update-dates`,
        updateDatesParams
      )
      .toPromise();
  }

  public async updateIgnoreFlag(
    updateIgnoreFlagParams: UpdateIgnoreFlagParams
  ): Promise<void> {
    return this.http
      .put<any>(
        `${environment.apiBaseUrl}/sales/update-ignore-flag`,
        updateIgnoreFlagParams
      )
      .toPromise();
  }
}
