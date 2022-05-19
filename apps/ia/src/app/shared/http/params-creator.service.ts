import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParamsCreatorService {
  readonly PARAM_ORG_UNIT_KEY = 'org_unit_key';
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

  createHttpParamsForOrgUnit(orgUnitKey: string) {
    return new HttpParams().set(this.PARAM_ORG_UNIT_KEY, orgUnitKey);
  }

  createHttpParamsForOrgUnitAndTimeRange(
    orgUnitKey: string,
    timeRange: string
  ) {
    return new HttpParams()
      .set(this.PARAM_ORG_UNIT_KEY, orgUnitKey)
      .set(this.PARAM_TIME_RANGE, timeRange);
  }

  createHttpParamsForOrgUnitTimeRangeAndTimePeriod(
    orgUnitKey: string,
    timeRange: string,
    timePeriod: string
  ) {
    return new HttpParams()
      .set(this.PARAM_ORG_UNIT_KEY, orgUnitKey)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_TIME_PERIOD, timePeriod);
  }

  createHttpParamsForOrgUnitAndTimePeriod(
    orgUnitKey: string,
    timePeriod: string
  ) {
    return new HttpParams()
      .set(this.PARAM_ORG_UNIT_KEY, orgUnitKey)
      .set(this.PARAM_TIME_PERIOD, timePeriod);
  }
}
