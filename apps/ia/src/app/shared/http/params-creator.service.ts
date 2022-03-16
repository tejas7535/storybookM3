import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParamsCreatorService {
  readonly PARAM_ORG_UNIT = 'org_unit';
  readonly PARAM_SEARCH_FOR = 'search_for';
  readonly PARAM_TIME_RANGE = 'time_range';
  readonly PARAM_TIME_PERIOD = 'time_period';

  createHttpParamsForAutoCompleteOrgUnits(
    searchFor: string,
    timeRange: string
  ) {
    return new HttpParams()
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_SEARCH_FOR, searchFor);
  }

  createHttpParamsForOrgUnit(orgUnit: string) {
    return new HttpParams().set(this.PARAM_ORG_UNIT, orgUnit);
  }

  createHttpParamsForOrgUnitAndTimeRange(orgUnit: string, timeRange: string) {
    return new HttpParams()
      .set(this.PARAM_ORG_UNIT, orgUnit)
      .set(this.PARAM_TIME_RANGE, timeRange);
  }

  createHttpParamsForOrgUnitTimeRangeAndTimePeriod(
    orgUnit: string,
    timeRange: string,
    timePeriod: string
  ) {
    return new HttpParams()
      .set(this.PARAM_ORG_UNIT, orgUnit)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_TIME_PERIOD, timePeriod);
  }
}
