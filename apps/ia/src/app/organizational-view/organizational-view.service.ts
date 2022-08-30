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
  EmployeesRequest,
  FilterDimension,
  IdValue,
  TimePeriod,
} from '../shared/models';
import { OrgUnitFluctuationData } from './models/org-unit-fluctuation-data.model';
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
  readonly ORG_UNIT = 'org-unit';
  readonly ATTRITION_OVER_TIME = 'attrition-over-time';
  readonly FLUCTUATION_RATE = 'fluctuation-rate';

  readonly PARAM_ID = 'id';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgChart(
    employeesRequest: EmployeesRequest
  ): Observable<OrgUnitFluctuationData[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgChartResponse>(`${ApiVersion.V1}/${this.ORG_CHART}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.orgUnits));
  }

  addContinentToCountryData(countryData: CountryData[]): CountryData[] {
    return countryData.map((country) => {
      const countryJson = (worldJson as any).features.find(
        (elem: any) =>
          elem.properties.name === country.name ||
          elem.properties.nameLong === country.name
      );

      return {
        ...country,
        name: country.name,
        continent: countryJson?.properties.continent,
      };
    });
  }

  getWorldMap(employeesRequest: EmployeesRequest): Observable<CountryData[]> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
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
      employeesRequest.filterDimension,
      employeesRequest.value,
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
          value: employeesRequest.value,
          timeRange: employeesRequest.timeRange,
        }))
      );
  }

  getParentOrgUnit(parentId: string): Observable<IdValue> {
    const params = new HttpParams().set(this.PARAM_ID, parentId);

    return this.http.get<IdValue>(`${ApiVersion.V1}/${this.ORG_UNIT}`, {
      params,
      context: withCache(),
    });
  }

  getAttritionOverTime(
    filterDimension: FilterDimension,
    key: string,
    timePeriod: TimePeriod.LAST_THREE_YEARS | TimePeriod.LAST_6_MONTHS
  ): Observable<AttritionOverTime> {
    const params = this.paramsCreator.createHttpParamsForOrgUnitAndTimePeriod(
      filterDimension,
      key,
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
