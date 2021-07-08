import { SeriesOption } from 'echarts';

import { initialState, OverviewState } from '..';
import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { FilterKey, FluctuationKpi } from '../../../shared/models';
import { Color } from '../../../shared/models/color.enum';
import { Employee } from '../../../shared/models/employee.model';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';
import { OpenApplication, ResignedEmployee } from '../../models';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingResignedEmployees,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getLeaversDataForSelectedOrgUnit,
  getOpenApplications,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationKpi,
  getOverviewFluctuationRates,
  getOverviewUnforcedFluctuationKpi,
  getResignedEmployees,
  getUnforcedFluctuationRatesForChart,
} from './overview.selector';

describe('Overview Selector', () => {
  const selectedOrgUnit = 'Schaeffler_IT';
  const leaverIT1 = createExternalLeaver(
    '1',
    selectedOrgUnit,
    new Date(2020, 3, 15)
  );
  const leaverIT2 = createExternalLeaver(
    '2',
    `${selectedOrgUnit}_1`,
    new Date(2020, 3, 15)
  );
  const leaverHR = createExternalLeaver(
    '3',
    'Schaeffler_HR',
    new Date(2020, 3, 15)
  );
  const internalLeaver1 = createInternalLeaver(
    '4',
    selectedOrgUnit,
    new Date(2020, 4, 30)
  );

  const entryEmployee1 = createExternalEntryEmployee(
    '5',
    new Date(2020, 3, 14)
  );
  const entryEmployee2 = createExternalEntryEmployee(
    '6',
    new Date(2020, 8, 19)
  );
  const internalEntryEmployee1 = createInternalEntryEmployee(
    '7',
    new Date(2020, 8, 19)
  );
  const internalEntryEmployeeBeforeTimeRange = createInternalEntryEmployee(
    '8',
    new Date(2018, 9, 19)
  );
  const entryEmployeeBeforeTimeRange = createExternalEntryEmployee(
    '9',
    new Date(2018, 2, 1)
  );
  const entryEmployeeAfterTimeRange = createExternalEntryEmployee(
    '10',
    new Date(2021, 2, 1)
  );

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
      entriesExits: {
        data: {
          entryEmployees: [
            leaverIT1,
            entryEmployee2,
            entryEmployeeAfterTimeRange,
            leaverIT2,
            internalEntryEmployeeBeforeTimeRange,
            internalEntryEmployee1,
            entryEmployeeBeforeTimeRange,
            entryEmployee1,
            internalLeaver1,
            leaverHR,
          ],
          exitEmployees: [leaverIT1, leaverIT2, leaverHR, internalLeaver1],
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
      fluctuationRates: {
        data: {
          companyName: 'Schaeffler',
          orgUnitName: 'Schaeffler_IT',
          fluctuationRates: [
            { company: 0.025, orgUnit: 0.018 },
            { company: 0.035, orgUnit: 0.014 },
          ],
        },
        errorMessage: undefined,
        loading: false,
      },
      unforcedFluctuationRates: {
        data: {
          companyName: 'Schaeffler',
          orgUnitName: 'Schaeffler_IT',
          fluctuationRates: [
            { company: 0.02, orgUnit: 0.013 },
            { company: 0.04, orgUnit: 0.03 },
          ],
        },
        errorMessage: undefined,
        loading: false,
      },
      resignedEmployees: {
        data: [{ employeeName: 'Bastian' } as ResignedEmployee],
        loading: false,
        errorMessage: undefined,
      },
      openApplications: {
        data: [{ name: 'UI Designer' } as OpenApplication],
        loading: false,
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
        entryEmployees: [
          leaverIT1,
          entryEmployee2,
          entryEmployeeAfterTimeRange,
          leaverIT2,
          internalEntryEmployeeBeforeTimeRange,
          internalEntryEmployee1,
          entryEmployeeBeforeTimeRange,
          entryEmployee1,
          internalLeaver1,
          leaverHR,
        ],
        exitEmployees: [leaverIT1, leaverIT2, leaverHR, internalLeaver1],
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

  describe('getIsLoadingDoughnutsConfig', () => {
    it('should return true when doughnuts config loading', () => {
      expect(getIsLoadingDoughnutsConfig(fakeState)).toBeTruthy();
    });
  });

  describe('getOverviewFluctuationEntriesDoughnutConfig', () => {
    it('should return config for doughnut chart with entries', () => {
      expect(getOverviewFluctuationEntriesDoughnutConfig(fakeState)).toEqual(
        new DoughnutConfig('Entries', [
          new DoughnutSeriesConfig(1, 'internal', Color.LIGHT_GREEN),
          new DoughnutSeriesConfig(2, 'external', Color.LIGHT_BLUE),
        ])
      );
    });
  });

  describe('getOverviewFluctuationExitsDoughnutConfig', () => {
    it('should return config for doughnut chart with exits', () => {
      expect(getOverviewFluctuationExitsDoughnutConfig(fakeState)).toEqual(
        new DoughnutConfig('Exits', [
          new DoughnutSeriesConfig(1, 'internal', Color.LIGHT_GREEN),
          new DoughnutSeriesConfig(2, 'external', Color.LIGHT_BLUE),
        ])
      );
    });
  });

  describe('getOverviewFluctuationEntriesCount', () => {
    it('should return actual entries number', () => {
      expect(getOverviewFluctuationEntriesCount(fakeState)).toEqual(3);
    });
  });
  describe('getOverviewFluctuationExitsCount', () => {
    it('should return actual exits number', () => {
      expect(getOverviewFluctuationExitsCount(fakeState)).toEqual(3);
    });
  });

  describe('getLeaversDataForSelectedOrgUnit', () => {
    it('should return leavers for selected org unit only', () => {
      const leavers = getLeaversDataForSelectedOrgUnit(fakeState);

      expect(leavers.length).toEqual(3);
      expect(leavers).toContain(leaverIT1);
      expect(leavers).toContain(leaverIT2);
      expect(leavers).toContain(internalLeaver1);
    });
  });

  describe('getEntryEmployees', () => {
    it('should return entry employees only in selected time range', () => {
      const entryEmployees = getEntryEmployees(fakeState);

      expect(entryEmployees.length).toEqual(3);
      expect(entryEmployees).toContain(entryEmployee1);
      expect(entryEmployees).toContain(entryEmployee2);
      expect(entryEmployees).toContain(internalEntryEmployee1);
    });
  });

  describe('getFluctuationRatesForChart', () => {
    it('should return config for chart', () => {
      const result = getFluctuationRatesForChart(fakeState);
      const series = result.series as SeriesOption[];
      expect(series.length).toEqual(2);
      expect(series[0].name).toEqual('Schaeffler');
      expect(series[0].data).toEqual([2.5, 3.5]);
      expect(series[1].name).toEqual('Schaeffler_IT');
      expect(series[1].data).toEqual([1.8, 1.4]);
    });
  });

  describe('getUnforcedFluctuationRatesForChart', () => {
    it('should return config for chart', () => {
      const result = getUnforcedFluctuationRatesForChart(fakeState);
      const series = result.series as SeriesOption[];
      expect(series.length).toEqual(2);
      expect(series[0].name).toEqual('Schaeffler');
      expect(series[0].data).toEqual([2, 4]);
      expect(series[1].name).toEqual('Schaeffler_IT');
      expect(series[1].data).toEqual([1.3, 3]);
    });
  });

  describe('getIsLoadingFluctuationRatesForChart', () => {
    it('should return isLoading value', () => {
      expect(getIsLoadingFluctuationRatesForChart(fakeState)).toBeFalsy();
    });
  });

  describe('getIsLoadingUnforcedFluctuationRatesForChart', () => {
    it('should return isLoading value', () => {
      expect(
        getIsLoadingUnforcedFluctuationRatesForChart(fakeState)
      ).toBeFalsy();
    });
  });

  describe('getOverviewFluctuationKpi', () => {
    it('should return kpis', () => {
      const expectedResult = {
        kpiRates: {
          company: '4.1%',
          orgUnit: '2.3%',
        },
        orgUnitName: 'Schaeffler_IT',
        exitEmployees: [leaverIT1, leaverIT2],
      } as FluctuationKpi;
      const x = getOverviewFluctuationKpi(fakeState);
      expect(x).toEqual(expectedResult);
    });

    it('should return undefined when fluctuation rates not ready', () => {
      const entriesExitsNotReady = {
        overview: {
          entriesExits: {},
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

      expect(getOverviewFluctuationKpi(entriesExitsNotReady)).toBeUndefined();
    });
  });

  describe('getOveriviewUnforcedFluctuationKpi', () => {
    it('should return kpis', () => {
      const expectedResult = {
        kpiRates: {
          company: '8.1%',
          orgUnit: '6.5%',
        },
        orgUnitName: 'Schaeffler_IT',
        exitEmployees: [],
      } as FluctuationKpi;
      const x = getOverviewUnforcedFluctuationKpi(fakeState);
      expect(x).toEqual(expectedResult);
    });

    it('should return undefined when fluctuation rates not ready', () => {
      const entriesExitsNotReady = {
        overview: {
          entriesExits: {},
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

      expect(
        getOverviewUnforcedFluctuationKpi(entriesExitsNotReady)
      ).toBeUndefined();
    });
  });

  it('should return undefined when filter not ready', () => {
    const entriesExitsNotReady = getStateForFluctuationKpiTesting();

    expect(getOverviewFluctuationKpi(entriesExitsNotReady)).toBeUndefined();
  });

  describe('getIsLoadingResignedEmployees', () => {
    it('should return isLoading value', () => {
      expect(
        getIsLoadingResignedEmployees.projector(fakeState.overview)
      ).toBeFalsy();
    });
  });

  describe('getResignedEmployees', () => {
    it('should return resigned employees', () => {
      expect(getResignedEmployees.projector(fakeState.overview)).toEqual([
        { employeeName: 'Bastian' },
      ]);
    });
  });

  describe('getOpenApplications', () => {
    it('should return open applications', () => {
      expect(getOpenApplications.projector(fakeState.overview)).toEqual([
        { name: 'UI Designer' },
      ]);
    });
  });
});

function getStateForFluctuationKpiTesting() {
  return {
    overview: {
      entriesExits: {
        fluctuationRate: {
          company: 0.041,
          orgUnit: 0.023,
        },
        unforcedFluctuationRate: {
          company: 0.041,
          orgUnit: 0.023,
        },
      },
    },
    filter: {
      selectedTimeRange: '1577863715000|1609399715000',
      selectedFilters: {
        ids: [FilterKey.ORG_UNIT],
        entities: {
          orgUnit: { name: FilterKey.ORG_UNIT, value: 'Schaeffler_IT' },
        },
      },
    } as unknown as FilterState,
  };
}

function createExternalEntryEmployee(id: string, entryDate: Date): Employee {
  return createEmployee(id, 'Schaeffler_IT', entryDate);
}

function createInternalEntryEmployee(
  id: string,
  internalEntryDate: Date
): Employee {
  return createEmployee(
    id,
    'Schaeffler_IT',
    undefined,
    undefined,
    internalEntryDate
  );
}

function createExternalLeaver(
  id: string,
  orgUnit: string,
  exitDate: Date
): Employee {
  return createEmployee(id, orgUnit, undefined, exitDate);
}

function createInternalLeaver(
  id: string,
  orgUnit: string,
  internalExitDate: Date
) {
  return createEmployee(
    id,
    orgUnit,
    undefined,
    undefined,
    undefined,
    internalExitDate
  );
}

function createEmployee(
  id: string,
  orgUnit: string,
  entryDate?: Date,
  exitDate?: Date,
  internalEntryDate?: Date,
  internalExitDate?: Date
): Employee {
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
    exitDate ? exitDate.toJSON() : undefined,
    entryDate ? entryDate.toJSON() : '2021-05-01',
    internalEntryDate ? internalEntryDate.toJSON() : undefined,
    internalExitDate ? internalExitDate.toJSON() : undefined,
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
