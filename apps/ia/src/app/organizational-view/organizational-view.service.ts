import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { withCache } from '@ngneat/cashew';

import { ParamsCreatorService } from '../shared/http/params-creator.service';
import {
  ApiVersion,
  AttritionOverTime,
  EmployeesRequest,
  FilterDimension,
  TimePeriod,
} from '../shared/models';
import { DimensionFluctuationData } from './models';
import {
  DimensionParentResponse,
  OrgChartEmployee,
  OrgChartEmployeesResponse,
  OrgChartResponse,
  OrgUnitFluctuationRate,
  OrgUnitFluctuationRateResponse,
} from './org-chart/models';
import { CountryDataAttrition, WorldMapResponse } from './world-map/models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationalViewService {
  readonly ORG_CHART = 'org-chart';
  readonly ORG_CHART_EMPLOYEES = 'org-chart-employees';
  readonly WORLD_MAP = 'world-map';
  readonly DIMENSION_PARENT = 'dimension-parent';
  readonly ATTRITION_OVER_TIME = 'attrition-over-time';
  readonly FLUCTUATION_RATE = 'fluctuation-rate';

  constructor(
    private readonly http: HttpClient,
    private readonly paramsCreator: ParamsCreatorService
  ) {}

  getOrgChart(
    employeesRequest: EmployeesRequest
  ): Observable<DimensionFluctuationData[]> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgChartResponse>(`${ApiVersion.V1}/${this.ORG_CHART}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.dimensions));
  }

  getOrgChartEmployeesForNode(
    employeesRequest: EmployeesRequest
  ): Observable<OrgChartEmployee[]> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http
      .get<OrgChartEmployeesResponse>(
        `${ApiVersion.V1}/${this.ORG_CHART_EMPLOYEES}`,
        {
          params,
          context: withCache(),
        }
      )
      .pipe(map((response) => response.employees));
  }

  getWorldMap(
    employeesRequest: EmployeesRequest
  ): Observable<CountryDataAttrition[]> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      employeesRequest.filterDimension,
      employeesRequest.value,
      employeesRequest.timeRange
    );

    return this.http
      .get<WorldMapResponse>(`${ApiVersion.V1}/${this.WORLD_MAP}`, {
        params,
        context: withCache(),
      })
      .pipe(map((response) => response.data));
  }

  getOrgUnitFluctuationRate(
    employeesRequest: EmployeesRequest
  ): Observable<OrgUnitFluctuationRate> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
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

  getParentOrgUnit(
    childDimension: FilterDimension,
    timeRange: string,
    parentId: string
  ): Observable<DimensionParentResponse> {
    const params = this.paramsCreator.createHttpParamsForDimensionAndTimeRange(
      childDimension,
      parentId,
      timeRange
    );

    return this.http.get<DimensionParentResponse>(
      `${ApiVersion.V1}/${this.DIMENSION_PARENT}`,
      {
        params,
        context: withCache(),
      }
    );
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
