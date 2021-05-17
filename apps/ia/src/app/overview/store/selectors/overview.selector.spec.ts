import { initialState, OverviewState } from '..';
import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getIsLoadingAttritionOverTimeOverview,
} from './overview.selector';

describe('Overview Selector', () => {
  const fakeState: { overview: OverviewState; filter: FilterState } = {
    overview: {
      ...initialState,
      attritionOverTime: {
        data: {
          events: [{ date: new Date('01-01-2021'), name: 'Monkeys' }],
          data: {
            2019: {
              employees: [],
              attrition: [10, 20, 10, 20, 10],
            },
          },
        },
        loading: true,
        errorMessage: undefined,
      },
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
    } as unknown as FilterState,
  };

  describe('getIsLoadingAttritionOverTimeOverview', () => {
    it('should return loading status', () => {
      expect(getIsLoadingAttritionOverTimeOverview(fakeState)).toBeTruthy();
    });
  });

  describe('getAttritionOverTimeEvents', () => {
    it('should return list of events', () => {
      expect(getAttritionOverTimeEvents(fakeState)).toEqual([
        { date: new Date('01-01-2021'), name: 'Monkeys' },
      ]);
    });
  });

  describe('getAttritionOverTimeOverviewData', () => {
    it('should return actual attrition data', () => {
      expect(getAttritionOverTimeOverviewData(fakeState)).toEqual({
        2019: {
          employees: [],
          attrition: [10, 20, 10, 20, 10],
        },
      });
    });
  });
});
