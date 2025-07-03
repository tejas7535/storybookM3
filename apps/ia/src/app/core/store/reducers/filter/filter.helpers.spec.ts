import { EntityState } from '@ngrx/entity';
import moment from 'moment';

import {
  FilterDimension,
  FilterKey,
  SelectedFilter,
  TimePeriod,
} from '../../../../shared/models';
import {
  getInitialSelectedTimeRange,
  getMaxDate,
  getMaxTimeRangeConstraint,
  getMinTimeRangeConstraint,
  getTimeRangeConstraints,
  getTimeRangeFilterForTimePeriod,
} from './filter.helpers';

// Mock the imported functions
jest.mock('../../../../shared/utils/utilities', () => ({
  getMonth12MonthsAgo: jest
    .fn()
    .mockImplementation((_refDate) => moment.utc('2022-05-01')),
  getTimeRangeFromDates: jest
    .fn()
    .mockImplementation((start, end) => `${start.unix()}|${end.unix()}`),
}));

describe('Filter Helpers', () => {
  const { filterAdapter } = jest.requireMock('../../../../shared/models');

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2023-05-13T12:33:37.000Z').getTime());
  });

  describe('getMaxDate', () => {
    it('should return the correct max date based on DATA_IMPORT_DAY', () => {
      const result = getMaxDate();

      // Since the test mocks Date.now to return '2023-05-13T12:33:37.000Z'
      // With DATA_IMPORT_DAY = 9, if today is after the 9th, it will use the end of previous month
      // In this case, - April 30, 2023
      expect(moment.unix(result).utc().format('YYYY-MM-DD')).toBe('2023-04-30');
    });
  });

  describe('getInitialSelectedTimeRange', () => {
    it('should calculate correct initial time range', () => {
      const today = moment.utc('2023-05-13');
      const result = getInitialSelectedTimeRange(today);

      // Verify the time range values, not the function calls since we mocked them
      const [startDate, endDate] = result.split('|');
      expect(moment.unix(+startDate).utc().format('YYYY-MM-DD')).toBe(
        '2022-05-01'
      );
      expect(moment.unix(+endDate).utc().format('YYYY-MM-DD')).toBe(
        '2023-04-30'
      );
    });
  });

  describe('getTimeRangeConstraints', () => {
    it('should return 2022 min date for dimensions with 2021 data', () => {
      // ORG_UNIT is in DIMENSIONS_WITH_2021_DATA
      const selectedDimension = FilterDimension.ORG_UNIT;
      const currentConstraints: { min: number | undefined; max: number } = {
        min: undefined,
        max: 1_625_097_600,
      };
      const expected2022Date = moment.utc('2022-01-01').unix();

      const result = getTimeRangeConstraints(
        selectedDimension,
        currentConstraints
      );

      expect(result).toEqual({
        ...currentConstraints,
        min: expected2022Date,
      });
    });

    it('should return 2023 min date for dimensions without 2021 data', () => {
      // Using a dimension not in DIMENSIONS_WITH_2021_DATA
      const selectedDimension = FilterDimension.SEGMENT;
      const currentConstraints: { min: number | undefined; max: number } = {
        min: undefined,
        max: 1_625_097_600,
      };
      const expected2023Date = moment.utc('2023-01-01').unix();

      const result = getTimeRangeConstraints(
        selectedDimension,
        currentConstraints
      );

      expect(result).toEqual({
        ...currentConstraints,
        min: expected2023Date,
      });
    });
  });

  describe('getTimeRangeFilterForTimePeriod', () => {
    beforeEach(() => {
      filterAdapter.upsertOne = jest.fn();
    });

    it('should return the entity state for unknown time period', () => {
      const timePeriod = 'UNKNOWN' as TimePeriod;
      const mockEntityState = {
        ids: ['TIME_RANGE'],
        entities: {
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: '1625097600|1627776000',
              value: 'Test Value',
            },
          },
        },
      } as unknown as EntityState<SelectedFilter>;

      const result = getTimeRangeFilterForTimePeriod(
        timePeriod,
        mockEntityState
      );

      expect(result).toBe(mockEntityState);
      expect(filterAdapter.upsertOne).not.toHaveBeenCalled();
    });

    it('should handle YEAR time period', () => {
      const timePeriod = TimePeriod.YEAR;
      const currentTimeRangeEnd = moment.utc('2022-07-31T23:59:59.999Z');

      const mockEntityState = {
        ids: ['TIME_RANGE'],
        entities: {
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: `1625097600|${currentTimeRangeEnd.unix()}`,
              value: 'Test Value',
            },
          },
        },
      } as unknown as EntityState<SelectedFilter>;

      // Mock Date.now to ensure consistent behavior
      jest.spyOn(Date, 'now').mockReturnValue(new Date('2022-07-01').getTime());

      // We just want to test that the function completes without errors
      const result = getTimeRangeFilterForTimePeriod(
        timePeriod,
        mockEntityState
      );
      expect(result).toBeDefined();
    });

    it('should handle MONTH time period', () => {
      const timePeriod = TimePeriod.MONTH;
      const currentTimeRangeEnd = moment.utc('2022-07-31T23:59:59.999Z');

      const mockEntityState = {
        ids: ['TIME_RANGE'],
        entities: {
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: `1625097600|${currentTimeRangeEnd.unix()}`,
              value: 'Test Value',
            },
          },
        },
      } as unknown as EntityState<SelectedFilter>;

      const result = getTimeRangeFilterForTimePeriod(
        timePeriod,
        mockEntityState
      );
      expect(result).toBeDefined();
    });

    it('should handle LAST_12_MONTHS time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const currentTimeRangeEnd = moment.utc('2023-04-30T23:59:59.999Z');

      const mockEntityState = {
        ids: ['TIME_RANGE'],
        entities: {
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: `1625097600|${currentTimeRangeEnd.unix()}`,
              value: 'Test Value',
            },
          },
        },
      } as unknown as EntityState<SelectedFilter>;

      const result = getTimeRangeFilterForTimePeriod(
        timePeriod,
        mockEntityState
      );
      expect(result).toBeDefined();
    });
  });
  describe('getMaxTimeRangeConstraint', () => {
    it('should return end of previous year for YEAR time period', () => {
      const result = getMaxTimeRangeConstraint(TimePeriod.YEAR);

      // Since the test mocks Date.now to return '2023-05-13T12:33:37.000Z'
      // getMaxDate() returns the end of April 2023
      // For year period, it subtracts 1 year and returns end of 2022
      expect(moment.unix(result).utc().format('YYYY-MM-DD')).toBe('2022-12-31');
    });

    it('should return max date for non-YEAR time periods', () => {
      const result = getMaxTimeRangeConstraint(TimePeriod.MONTH);

      // The max date is the end of April 2023 as per the mocked date
      const expectedTimestamp = 1_682_899_199; // 2023-04-30 23:59:59
      expect(result).toBe(expectedTimestamp);
    });
  });

  describe('getMinTimeRangeConstraint', () => {
    it('should return 2022-01-01 for dimensions with 2021 data', () => {
      // Using a dimension that is in DIMENSIONS_WITH_2021_DATA
      const result = getMinTimeRangeConstraint(FilterDimension.ORG_UNIT);

      expect(moment.unix(result).utc().format('YYYY-MM-DD')).toBe('2022-01-01');
    });

    it('should return 2023-01-01 for dimensions without 2021 data', () => {
      // Using a dimension that is NOT in DIMENSIONS_WITH_2021_DATA
      const result = getMinTimeRangeConstraint(FilterDimension.SEGMENT);

      expect(moment.unix(result).utc().format('YYYY-MM-DD')).toBe('2023-01-01');
    });
  });
});
