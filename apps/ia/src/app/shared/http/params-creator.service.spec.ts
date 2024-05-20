import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { FilterDimension, MonthlyFluctuationOverTime } from '../models';
import { ParamsCreatorService } from './params-creator.service';

describe('ParamsCreatorService', () => {
  let service: ParamsCreatorService;
  let spectator: SpectatorService<ParamsCreatorService>;

  const createService = createServiceFactory({
    service: ParamsCreatorService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('createHttpParamsForAutoCompleteOrgUnits', () => {
    const searchFor = 'searchFor';
    const timeRange = 'timeRange';

    const result = service.createHttpParamsForAutoCompleteOrgUnits(
      searchFor,
      timeRange
    );

    expect(result.get(service.PARAM_SEARCH_FOR)).toBe(searchFor);
    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
  });

  test('createHttpParamsForTimeRange', () => {
    const timeRange = 'timeRange';

    const result = service.createHttpParamsForTimeRange(timeRange);

    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
  });

  test('createHttpParamsForFilterDimension', () => {
    const filterDimension = FilterDimension.FUNCTION;
    const value = 'value';

    const result = service.createHttpParamsForFilterDimension(
      filterDimension,
      value
    );

    expect(result.get(service.PARAM_FILTER_DIMENSION)).toBe(filterDimension);
    expect(result.get(service.PARAM_FILTER_VALUE)).toBe(value);
  });

  test('createHttpParamsForJobKey', () => {
    const filterDimension = FilterDimension.FUNCTION;
    const value = 'value';
    const timeRange = 'timeRange';
    const jobKey = 'jobKey';

    const result = service.createHttpParamsForJobKey(
      filterDimension,
      value,
      timeRange,
      jobKey
    );

    expect(result.get(service.PARAM_FILTER_DIMENSION)).toBe(filterDimension);
    expect(result.get(service.PARAM_FILTER_VALUE)).toBe(value);
    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
    expect(result.get(service.PARAM_JOB_KEY)).toBe(jobKey);
  });

  test('createHttpParamsForDimensionAndTimeRange', () => {
    const filterDimension = FilterDimension.FUNCTION;
    const value = 'value';
    const timeRange = 'timeRange';

    const result = service.createHttpParamsForDimensionAndTimeRange(
      filterDimension,
      value,
      timeRange
    );

    expect(result.get(service.PARAM_FILTER_DIMENSION)).toBe(filterDimension);
    expect(result.get(service.PARAM_FILTER_VALUE)).toBe(value);
    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
  });

  test('createHttpParamsForDimensionTimeRangeAndTypes', () => {
    const filterDimension = FilterDimension.FUNCTION;
    const value = 'value';
    const timeRange = 'timeRange';
    const type = [
      MonthlyFluctuationOverTime.HEADCOUNTS,
      MonthlyFluctuationOverTime.FLUCTUATION_RATES,
    ];

    const result = service.createHttpParamsForDimensionTimeRangeAndTypes(
      filterDimension,
      value,
      timeRange,
      type
    );

    expect(result.get(service.PARAM_FILTER_DIMENSION)).toBe(filterDimension);
    expect(result.get(service.PARAM_FILTER_VALUE)).toBe(value);
    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
    expect(result.get(service.PARAM_TYPE)).toBe(type.join(','));
  });

  test('createHttpParamsForFilterValueTimeRangeAndTimePeriod', () => {
    const orgUnitKey = 'orgUnitKey';
    const timeRange = 'timeRange';
    const timePeriod = 'timePeriod';

    const result = service.createHttpParamsForFilterValueTimeRangeAndTimePeriod(
      orgUnitKey,
      timeRange,
      timePeriod
    );

    expect(result.get(service.PARAM_FILTER_VALUE)).toBe(orgUnitKey);
    expect(result.get(service.PARAM_TIME_RANGE)).toBe(timeRange);
    expect(result.get(service.PARAM_TIME_PERIOD)).toBe(timePeriod);
  });
});
