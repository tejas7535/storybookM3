import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import worldJson from '../../assets/world.json';
import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  ApiVersion,
  AttritionOverTime,
  Employee,
  EmployeesRequest,
  TimePeriod,
} from '../shared/models';
import {
  OrgChartResponse,
  OrgUnitFluctuationRate,
  OrgUnitFluctuationRateResponse,
} from './org-chart/models';
import { CountryData, WorldMapResponse } from './world-map/models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationalViewService {
  readonly ORG_CHART = 'org-chart';
  readonly WORLD_MAP = 'world-map';
  readonly EMPLOYEE = 'employee';
  readonly ATTRITION_OVER_TIME = 'attrition-over-time';
  readonly FLUCTUATION_RATE = 'fluctuation-rate';

  readonly PARAM_EMPLOYEE_ID = 'employee_key';
  readonly PARAM_REPORT_DATE = 'report_date';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgChart(employeesRequest: EmployeesRequest): Observable<Employee[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgChartResponse>(`${ApiVersion.V1}/${this.ORG_CHART}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.employees));
  }

  addContinentToCountryData(countryData: CountryData[]): CountryData[] {
    return countryData.map((country) => {
      const countryJson = (worldJson as any).features.find(
        (elem: any) =>
          elem.properties.name === country.name ||
          elem.properties.name_long === country.name
      );

      return {
        ...country,
        name: countryJson?.properties.name,
        continent: countryJson?.properties.continent,
      };
    });
  }

  getWorldMap(employeesRequest: EmployeesRequest): Observable<CountryData[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<WorldMapResponse>(`${ApiVersion.V1}/${this.WORLD_MAP}`, {
        params,
        context: withCache(),
      })
      .pipe(
        map((response) => response.data),
        map((countryData) => this.addContinentToCountryData(countryData))
      );
  }

  getOrgUnitFluctuationRate(
    employeesRequest: EmployeesRequest
  ): Observable<OrgUnitFluctuationRate> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.orgUnit,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgUnitFluctuationRateResponse>(
        `${ApiVersion.V1}/${this.FLUCTUATION_RATE}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(
        map((response) => ({
          ...response,
          orgUnitKey: employeesRequest.orgUnit,
          timeRange: employeesRequest.timeRange,
        }))
      );
  }

  getParentEmployee(
    parentEmployeeId: string,
    reportDate: string
  ): Observable<Employee> {
    const params = new HttpParams()
      .set(this.PARAM_EMPLOYEE_ID, parentEmployeeId)
      .set(this.PARAM_REPORT_DATE, reportDate);

    return this.http.get<Employee>(`${ApiVersion.V1}/${this.EMPLOYEE}`, {
      params,
      context: withCache(),
    });
  }

  getAttritionOverTime(
    orgUnit: string,
    timePeriod: TimePeriod.LAST_THREE_YEARS | TimePeriod.LAST_6_MONTHS
  ): Observable<AttritionOverTime> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimePeriod(
      orgUnit,
      timePeriod
    );

    return this.http.get<AttritionOverTime>(
      `${ApiVersion.V1}/${this.ATTRITION_OVER_TIME}`,
      {
        params,
        context: withCache(),
      }
    );
  }
}
