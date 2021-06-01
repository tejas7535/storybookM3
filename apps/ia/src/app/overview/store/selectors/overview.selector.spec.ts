import { initialState, OverviewState } from '..';
import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { FilterKey } from '../../../shared/models';
import { Employee } from '../../../shared/models/employee.model';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getIsLoadingAttritionOverTimeOverview,
  getLeaversDataForSelectedOrgUnit,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationRates,
} from './overview.selector';

describe('Overview Selector', () => {
  const selectedOrgUnit = 'Schaeffler_IT';
  const leaverIT1 = createEmployee('123', selectedOrgUnit);
  const leaverIT2 = createEmployee('321', `${selectedOrgUnit}_1`);
  const leaverHR = createEmployee('321', 'Schaeffler_HR');
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
      fluctuationRates: {
        data: {
          employees: [leaverIT1, leaverIT2, leaverHR],
          entries: 23,
          exits: 34,
          fluctuationRate: {
            company: 0.041,
            orgUnit: 0.023,
          },
          unforcedFluctuationRate: {
            company: 0.081,
            orgUnit: 0.065,
          },
        },
        loading: true,
        errorMessage: undefined,
      },
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000', // 01.01.2020 - 31.12.2020
      selectedFilters: {
        ids: [FilterKey.ORG_UNIT],
        entities: {
          orgUnit: { name: FilterKey.ORG_UNIT, value: 'Schaeffler_IT' },
        },
      },
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

  describe('getOverviewFluctuationRates', () => {
    it('should return actual fluctuation data', () => {
      expect(getOverviewFluctuationRates(fakeState)).toEqual({
        employees: [leaverIT1, leaverIT2, leaverHR],
        entries: 23,
        exits: 34,
        fluctuationRate: {
          company: 0.041,
          orgUnit: 0.023,
        },
        unforcedFluctuationRate: {
          company: 0.081,
          orgUnit: 0.065,
        },
      });
    });
  });

  describe('getOverviewFluctuationEntriesDoughnutConfig', () => {
    it('should return config for doughnut chart with entries', () => {
      expect(getOverviewFluctuationEntriesDoughnutConfig(fakeState)).toEqual(
        new DoughnutConfig(
          'Entries',
          [
            new DoughnutSeriesConfig(23, 'internal'),
            new DoughnutSeriesConfig(23, 'external'),
          ],
          ['internal', 'external']
        )
      );
    });
  });

  describe('getOverviewFluctuationExitsDoughnutConfig', () => {
    it('should return config for doughnut chart with exits', () => {
      expect(getOverviewFluctuationExitsDoughnutConfig(fakeState)).toEqual(
        new DoughnutConfig(
          'Exits',
          [
            new DoughnutSeriesConfig(34, 'internal'),
            new DoughnutSeriesConfig(34, 'external'),
          ],
          ['internal', 'external']
        )
      );
    });
  });

  describe('getOverviewFluctuationEntriesCount', () => {
    it('should return actual entries number', () => {
      expect(getOverviewFluctuationEntriesCount(fakeState)).toEqual(23);
    });
  });
  describe('getOverviewFluctuationExitsCount', () => {
    it('should return actual exits number', () => {
      expect(getOverviewFluctuationExitsCount(fakeState)).toEqual(34);
    });
  });

  describe('getLeaversDataForSelectedOrgUnit', () => {
    it('should return leavers for selected org unit only', () => {
      const leavers = getLeaversDataForSelectedOrgUnit(fakeState);

      expect(leavers.length).toEqual(2);
      expect(leavers).toContain(leaverIT1);
      expect(leavers).toContain(leaverIT2);
      expect(leavers).not.toContain(leaverHR);
    });
  });
});

function createEmployee(id: string, orgUnit: string) {
  return new Employee(
    id,
    'John Walker',
    'DE',
    'DEHAM',
    'DE',
    orgUnit,
    'DDZ',
    'MP',
    '321',
    'IT',
    'IT worker',
    24,
    20,
    'Male',
    'DE',
    'false',
    'Second',
    '10',
    20,
    1,
    'FT',
    '2021-05-01',
    '2021-05-01',
    '2019-04-01',
    'unforced',
    'big regret',
    4,
    2,
    1,
    0,
    1,
    undefined,
    []
  );
}
