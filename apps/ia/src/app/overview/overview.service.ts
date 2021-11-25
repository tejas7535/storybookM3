import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
  ResignedEmployee,
  ResignedEmployeesResponse,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  readonly OVERVIEW_FLUCTUATION_RATES = 'overview-fluctuation-rates';
  readonly FLUCTUATION_RATES_CHART = 'fluctuation-rates-chart';
  readonly UNFORCED_FLUCTUATION_RATES_CHART =
    'unforced-fluctuation-rates-chart';
  readonly RESIGNED_EMPLOYEES = 'resigned-employees';
  readonly OPEN_APPLICATIONS = 'open-applications';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOverviewFluctuationRates(
    employeesRequest: EmployeesRequest
  ): Observable<OverviewFluctuationRates> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http.get<OverviewFluctuationRates>(
      `${ApiVersion.V1}/${this.OVERVIEW_FLUCTUATION_RATES}`,
      { params, context: withCache() }
    );
  }

  getFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(
      employeesRequest.orgUnit
    );

    return this.http.get<FluctuationRatesChartData>(
      `${ApiVersion.V1}/${this.FLUCTUATION_RATES_CHART}`,
      { params, context: withCache() }
    );
  }

  getUnforcedFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(
      employeesRequest.orgUnit
    );

    return this.http.get<FluctuationRatesChartData>(
      `${ApiVersion.V1}/${this.UNFORCED_FLUCTUATION_RATES_CHART}`,
      { params, context: withCache() }
    );
  }

  getResignedEmployees(orgUnit: string): Observable<ResignedEmployee[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(orgUnit);

    return this.http
      .get<ResignedEmployeesResponse>(
        `${ApiVersion.V1}/${this.RESIGNED_EMPLOYEES}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(map((response) => response.employees));
  }

  getOpenApplications(orgUnit: string): Observable<OpenApplication[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(orgUnit);

    return this.http.get<OpenApplication[]>(
      `${ApiVersion.V1}/${this.OPEN_APPLICATIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
