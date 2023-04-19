import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import { ApiVersion, EmployeesRequest } from '../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRatesChartData,
  OpenApplication,
  OverviewFluctuationRates,
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
  readonly OPEN_APPLICATIONS_COUNT = 'open-positions-count';
  readonly OVERVIEW_EXIT_EMPLOYEES = 'overview-exit-employees';
  readonly OVERVIEW_ENTRY_EMPLOYEES = 'overview-entry-employees';
  readonly OVERVIEW_ATTRITION_OVER_TIME_EMPLOYEES =
    'overview-attrition-over-time-employees';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOverviewFluctuationRates(
    employeesRequest: EmployeesRequest
  ): Observable<OverviewFluctuationRates> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<OverviewFluctuationRates>(
      `${ApiVersion.V1}/${this.OVERVIEW_FLUCTUATION_RATES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    const params = this.paramsCreator.createHttpParamsForFilterDimension(
      employeesRequest.filterDimension,
      employeesRequest.value
    );

    return this.http.get<FluctuationRatesChartData>(
      `${ApiVersion.V1}/${this.FLUCTUATION_RATES_CHART}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getResignedEmployees(
    employeesRequest: Partial<EmployeesRequest>
  ): Observable<ResignedEmployeesResponse> {
    const params = this.paramsCreator.createHttpParamsForFilterDimension(
      employeesRequest.filterDimension,
      employeesRequest.value
    );

    return this.http.get<ResignedEmployeesResponse>(
      `${ApiVersion.V1}/${this.RESIGNED_EMPLOYEES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getOpenApplications(
    employeesRequest: EmployeesRequest
  ): Observable<OpenApplication[]> {
    const params = this.paramsCreator.createHttpParamsForFilterDimension(
      employeesRequest.filterDimension,
      employeesRequest.value
    );

    return this.http.get<OpenApplication[]>(
      `${ApiVersion.V1}/${this.OPEN_APPLICATIONS}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getOpenApplicationsCount(
    employeesRequest: EmployeesRequest
  ): Observable<number> {
    const params = this.paramsCreator.createHttpParamsForFilterDimension(
      employeesRequest.filterDimension,
      employeesRequest.value
    );

    return this.http.get<number>(
      `${ApiVersion.V1}/${this.OPEN_APPLICATIONS_COUNT}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getOverviewExitEmployees(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.OVERVIEW_EXIT_EMPLOYEES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getOverviewEntryEmployees(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.OVERVIEW_ENTRY_EMPLOYEES}`,
      {
        params,
        context: withCache(),
      }
    );
  }

  getAttritionOverTimeEmployees(
    employeesRequest: EmployeesRequest
  ): Observable<ExitEntryEmployeesResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http.get<ExitEntryEmployeesResponse>(
      `${ApiVersion.V1}/${this.OVERVIEW_ATTRITION_OVER_TIME_EMPLOYEES}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
