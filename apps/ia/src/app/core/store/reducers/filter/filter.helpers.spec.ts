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
  getTimeRangeConstraints,
  getTimeRangeFilterForTimePeriod,
} from './filter.helpers';

// Mock the required dependencies
jest.mock('../../../../shared/utils/utilities', () => ({
  getMonth12MonthsAgo: jest.fn(),
  getTimeRangeFromDates: jest.fn(),
}));

jest.mock('../../../../shared/constants', () => ({
  DATA_IMPORT_DAY: 10,
  DATE_FORMAT_BEAUTY: 'MMMM YYYY',
  DIMENSIONS_WITH_2021_DATA: ['BUSINESS', 'REGION'],
}));

// Mock the filterAdapter
jest.mock('../../../../shared/models', () => {
  const original = jest.requireActual('../../../../shared/models');

  return {
    ...original,
    filterAdapter: {
      upsertOne: jest.fn((_: any, state: any) => state),
    },
  };
});

describe('Filter Helpers', () => {
  const { getMonth12MonthsAgo, getTimeRangeFromDates } = jest.requireMock(
    '../../../../shared/utils/utilities'
  );
  const { filterAdapter } = jest.requireMock('../../../../shared/models');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMaxDate', () => {
    it('should return the correct max date based on DATA_IMPORT_DAY', () => {
      const mockNow = moment('2025-07-01T00:00:00Z');
      jest.spyOn(moment, 'utc').mockReturnValue(mockNow);

      const result = getMaxDate();

      expect(moment.unix(result).utc().format('YYYY-MM-DD')).toBe('2025-05-31');
    });
  });

  describe('getInitialSelectedTimeRange', () => {
    it('should calculate correct initial time range', () => {
      const today = moment('2025-07-01T00:00:00Z');
      const mockOldDate = moment('2024-07-01T00:00:00Z');
      const expectedTimeRange = '1234|5678';

      getMonth12MonthsAgo.mockReturnValue(mockOldDate);
      getTimeRangeFromDates.mockReturnValue(expectedTimeRange);

      const result = getInitialSelectedTimeRange(today);

      expect(getMonth12MonthsAgo).toHaveBeenCalled();
      expect(getTimeRangeFromDates).toHaveBeenCalledWith(
        mockOldDate,
        expect.any(Object)
      );
      expect(result).toBe(expectedTimeRange);
    });
  });

  describe('getTimeRangeConstraints', () => {
    it('should return 2022 min date for dimensions with 2021 data', () => {
      const selectedDimension = 'BUSINESS' as FilterDimension;
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
      const selectedDimension = 'ORG_UNIT' as FilterDimension;
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
      filterAdapter.upsertOne.mockImplementation((_: any, state: any) => state);
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
    });

    it('should handle YEAR time period', () => {
      const timePeriod = TimePeriod.YEAR;
      const currentTimeRangeEnd = moment('2025-07-31T23:59:59.999Z');

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

      // Mock unix value for testing
      jest.spyOn(moment.prototype, 'unix').mockReturnValue(1_627_776_000);

      getTimeRangeFilterForTimePeriod(timePeriod, mockEntityState);

      expect(filterAdapter.upsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: FilterKey.TIME_RANGE,
          idValue: expect.objectContaining({
            value: expect.any(String),
          }),
        }),
        mockEntityState
      );
    });

    it('should handle MONTH time period', () => {
      const timePeriod = TimePeriod.MONTH;
      const currentTimeRangeEnd = moment('2025-07-31T23:59:59.999Z');

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

      getTimeRangeFilterForTimePeriod(timePeriod, mockEntityState);

      expect(filterAdapter.upsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: FilterKey.TIME_RANGE,
        }),
        mockEntityState
      );
    });

    it('should handle LAST_12_MONTHS time period', () => {
      const timePeriod = TimePeriod.LAST_12_MONTHS;
      const currentTimeRangeEnd = moment('2025-07-31T23:59:59.999Z');
      const mockOldDate = moment('2024-08-01T00:00:00Z');

      getMonth12MonthsAgo.mockReturnValue(mockOldDate);

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

      getTimeRangeFilterForTimePeriod(timePeriod, mockEntityState);

      expect(getMonth12MonthsAgo).toHaveBeenCalled();
      expect(filterAdapter.upsertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: FilterKey.TIME_RANGE,
          idValue: expect.objectContaining({
            id: expect.stringContaining('|'),
          }),
        }),
        mockEntityState
      );
    });
  });
});
