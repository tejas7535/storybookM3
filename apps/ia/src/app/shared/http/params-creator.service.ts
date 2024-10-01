import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FilterDimension, MonthlyFluctuationOverTime } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ParamsCreatorService {
  readonly PARAM_FILTER_DIMENSION = 'dimension';
  readonly PARAM_FILTER_VALUE = 'value';
  readonly PARAM_SEARCH_FOR = 'search_for';
  readonly PARAM_TIME_RANGE = 'time_range';
  readonly PARAM_TIME_PERIOD = 'time_period';
  readonly PARAM_JOB_KEY = 'job_key';
  readonly PARAM_TYPE = 'type';
  readonly PARAM_REASON_ID = 'reason_id';

  createHttpParamsForAutoCompleteOrgUnits(
    searchFor: string,
    timeRange: string
  ) {
    return new HttpParams()
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_SEARCH_FOR, searchFor);
  }

  createHttpParamsForTimeRange(timeRange: string) {
    return timeRange
      ? new HttpParams().set(this.PARAM_TIME_RANGE, timeRange)
      : undefined;
  }

  createHttpParamsForFilterDimension(
    filterDimension: FilterDimension,
    value: string
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, value);
  }

  createHttpParamsForJobKey(
    filterDimension: FilterDimension,
    value: string,
    timeRange: string,
    jobKey: string
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, value)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_JOB_KEY, jobKey);
  }

  createHttpParamsForDimensionAndTimeRange(
    filterDimension: FilterDimension,
    value: string,
    timeRange: string
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, value)
      .set(this.PARAM_TIME_RANGE, timeRange);
  }

  createHttpParamsForDimensionTimeRangeAndReason(
    filterDimension: FilterDimension,
    value: string,
    timeRange: string,
    reasonId: number
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, value)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_REASON_ID, reasonId);
  }

  createHttpParamsForDimensionTimeRangeAndTypes(
    filterDimension: FilterDimension,
    value: string,
    timeRange: string,
    type: MonthlyFluctuationOverTime[]
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, value)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_TYPE, type.join(','));
  }

  createHttpParamsForFilterValueTimeRangeAndTimePeriod(
    orgUnitKey: string,
    timeRange: string,
    timePeriod: string
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_VALUE, orgUnitKey)
      .set(this.PARAM_TIME_RANGE, timeRange)
      .set(this.PARAM_TIME_PERIOD, timePeriod);
  }

  createHttpParamsForOrgUnitAndTimePeriod(
    filterDimension: FilterDimension,
    orgUnitKey: string,
    timePeriod: string
  ) {
    return new HttpParams()
      .set(this.PARAM_FILTER_DIMENSION, filterDimension)
      .set(this.PARAM_FILTER_VALUE, orgUnitKey)
      .set(this.PARAM_TIME_PERIOD, timePeriod);
  }
}
