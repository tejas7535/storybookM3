import { addMonths, addWeeks, format } from 'date-fns';

import { KpiBucketTypeEnum } from '../../../../feature/demand-validation/model';
import { getCellClass } from './cell-style';

describe('getCellClass', () => {
  let today: Date;
  let mockParams: any;

  beforeEach(() => {
    // Fix the current date for testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-05-15T12:00:00Z'));

    today = new Date('2023-05-15T12:00:00Z');
    jest.spyOn(Date, 'now').mockImplementation(() => today.getTime());

    // Set up basic mock params
    mockParams = {
      colDef: {
        colId: format(today, 'yyyy-MM-dd'),
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('MONTH period type', () => {
    it('should add schaeffler-border-left class when column is in current month', () => {
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.MONTH);
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
    });

    it('should not add schaeffler-border-left class when column is not in current month', () => {
      mockParams.colDef.colId = format(addMonths(today, 1), 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.MONTH);
      const result = cellClassFunc(mockParams);

      expect(result).not.toContain('schaeffler-border-left');
    });

    it('should add error-border-right class when column is in frozen zone month', () => {
      const frozenZoneDate = format(today, 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(
        KpiBucketTypeEnum.MONTH,
        undefined,
        frozenZoneDate
      );
      const result = cellClassFunc(mockParams);

      expect(result).toContain('error-border-right');
    });

    it('should add warning-border-right class when column is in RLT month', () => {
      const rltDate = format(today, 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.MONTH, rltDate);
      const result = cellClassFunc(mockParams);

      expect(result).toContain('warning-border-right');
    });

    it('should add multiple classes when conditions overlap', () => {
      const rltDate = format(today, 'yyyy-MM-dd');
      const frozenZoneDate = format(today, 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(
        KpiBucketTypeEnum.MONTH,
        rltDate,
        frozenZoneDate
      );
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
      expect(result).toContain('warning-border-right');
      expect(result).toContain('error-border-right');
      expect(result).toHaveLength(3);
    });
  });

  describe('WEEK period type', () => {
    it('should add schaeffler-border-left class when column is in current week', () => {
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.WEEK);
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
    });

    it('should not add schaeffler-border-left class when column is not in current week', () => {
      mockParams.colDef.colId = format(addWeeks(today, 1), 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.WEEK);
      const result = cellClassFunc(mockParams);

      expect(result).not.toContain('schaeffler-border-left');
    });

    it('should add error-border-right class when column is in frozen zone week', () => {
      const frozenZoneDate = format(today, 'yyyy-MM-dd');
      const cellClassFunc = getCellClass(
        KpiBucketTypeEnum.WEEK,
        undefined,
        frozenZoneDate
      );
      const result = cellClassFunc(mockParams);

      expect(result).toContain('error-border-right');
    });
  });

  describe('PARTIAL_WEEK period type', () => {
    it('should add schaeffler-border-left class when column is in current week and month', () => {
      const cellClassFunc = getCellClass(KpiBucketTypeEnum.PARTIAL_WEEK);
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
    });

    it('should not add schaeffler-border-left when in same week but different month', () => {
      // Edge case: Create a date in the same week but different month
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      const nextMonthFirstDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );

      // Ensure test is using dates that fall on edge of month in same week
      if (lastDayOfMonth.getDay() !== 6) {
        // If not Saturday
        mockParams.colDef.colId = format(nextMonthFirstDay, 'yyyy-MM-dd');
        today = lastDayOfMonth;
        jest.spyOn(Date, 'now').mockImplementation(() => today.getTime());

        const cellClassFunc = getCellClass(KpiBucketTypeEnum.PARTIAL_WEEK);
        const result = cellClassFunc(mockParams);

        // eslint-disable-next-line jest/no-conditional-expect
        expect(result).not.toContain('schaeffler-border-left');
      }
    });
  });

  describe('Default case', () => {
    it('should handle unknown period type as MONTH', () => {
      const cellClassFunc = getCellClass(
        'UNKNOWN_TYPE' as any,
        undefined as any,
        undefined as any
      );
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
    });
  });

  describe('Edge cases', () => {
    it('should handle dates at month boundaries', () => {
      // Last day of current month
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      mockParams.colDef.colId = format(lastDay, 'yyyy-MM-dd');

      const cellClassFunc = getCellClass(
        KpiBucketTypeEnum.MONTH,
        undefined as any,
        undefined as any
      );
      const result = cellClassFunc(mockParams);

      expect(result).toContain('schaeffler-border-left');
    });
  });
});
