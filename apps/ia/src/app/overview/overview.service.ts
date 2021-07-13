import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { DataService } from '@schaeffler/http';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  EmployeesRequest,
  FluctuationRatesChartData,
  OverviewFluctuationRates,
} from '../shared/models';
import {
  OpenApplication,
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
    private readonly dataService: DataService,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOverviewFluctuationRates(
    employeesRequest: EmployeesRequest
  ): Observable<OverviewFluctuationRates> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.dataService.getAll<OverviewFluctuationRates>(
      this.OVERVIEW_FLUCTUATION_RATES,
      { params, context: withCache() }
    );
  }

  getFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(
      employeesRequest.orgUnit
    );

    return this.dataService.getAll<FluctuationRatesChartData>(
      this.FLUCTUATION_RATES_CHART,
      { params, context: withCache() }
    );
  }

  getUnforcedFluctuationRateChartData(
    employeesRequest: EmployeesRequest
  ): Observable<FluctuationRatesChartData> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(
      employeesRequest.orgUnit
    );

    return this.dataService.getAll<FluctuationRatesChartData>(
      this.UNFORCED_FLUCTUATION_RATES_CHART,
      { params, context: withCache() }
    );
  }

  getResignedEmployees(orgUnit: string): Observable<ResignedEmployee[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(orgUnit);

    return this.dataService
      .getAll<ResignedEmployeesResponse>(this.RESIGNED_EMPLOYEES, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.employees));
  }

  getOpenApplications(orgUnit: string): Observable<OpenApplication[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnit(orgUnit);

    return this.dataService.getAll<OpenApplication[]>(this.OPEN_APPLICATIONS, {
      params,
      context: withCache(),
    });
  }
}
