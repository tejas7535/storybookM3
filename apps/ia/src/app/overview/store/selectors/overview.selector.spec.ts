import { SeriesOption } from 'echarts';
import moment from 'moment';

import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { DoughnutConfig } from '../../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../../shared/charts/models/doughnut-series-config.model';
import {
  ActionType,
  Color,
  Employee,
  FilterDimension,
  FilterKey,
} from '../../../shared/models';
import { FluctuationKpi, LeavingType, OpenApplication } from '../../models';
import { initialState, OverviewState } from '..';
import {
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getExitEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingResignedEmployees,
  getOpenApplications,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationKpi,
  getOverviewFluctuationRates,
  getOverviewFluctuationTotalEmployeesCount,
  getOverviewUnforcedFluctuationKpi,
  getResignedEmployees,
  getUnforcedFluctuationRatesForChart,
} from './overview.selector';

describe('Overview Selector', () => {
  const selectedOrgUnit = 'Schaeffler_IT';
  const leaverIT1 = createExternalLeaver(
    '1',
    selectedOrgUnit,
    moment({ year: 2020, month: 3, date: 15 }).valueOf().toString()
  );
  const leaverIT2 = createExternalLeaver(
    '2',
    `${selectedOrgUnit}_1`,
    moment({ year: 2020, month: 3, date: 15 }).valueOf().toString()
  );
  const internalLeaver1 = createInternalLeaver(
    '4',
    selectedOrgUnit,
    moment({ year: 2020, month: 4, date: 30 }).valueOf().toString()
  );

  const entryEmployee1 = createExternalEntryEmployee(
    '5',
    moment({ year: 2020, month: 3, date: 14 }).valueOf().toString()
  );
  const entryEmployee2 = createExternalEntryEmployee(
    '6',
    moment({ year: 2020, month: 8, date: 19 }).valueOf().toString()
  );
  const internalEntryEmployee1 = createInternalEntryEmployee(
    '7',
    moment({ year: 2020, month: 8, date: 19 }).valueOf().toString()
  );
  const internalEntryEmployeeBeforeTimeRange = createInternalEntryEmployee(
    '8',
    moment({ year: 2018, month: 9, date: 19 }).valueOf().toString()
  );
  const entryEmployeeBeforeTimeRange = createExternalEntryEmployee(
    '9',
    moment({ year: 2018, month: 2, date: 1 }).valueOf().toString()
  );
  const entryEmployeeAfterTimeRange = createExternalEntryEmployee(
    '10',
    moment({ year: 2021, month: 2, date: 1 }).valueOf().toString()
  );

  const fakeState: { overview: OverviewState; filter: FilterState } = {
    overview: {
      ...initialState,
      attritionOverTime: {
        data: {
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
            entryEmployee2,
            entryEmployeeAfterTimeRange,
            internalEntryEmployeeBeforeTimeRange,
            internalEntryEmployee1,
            entryEmployeeBeforeTimeRange,
            entryEmployee1,
          ],
          exitEmployees: [leaverIT1, leaverIT2, internalLeaver1],
          fluctuationRate: {
            global: 0.041,
            orgUnit: 0.023,
          },
          unforcedFluctuationRate: {
            global: 0.081,
            orgUnit: 0.065,
          },
          totalEmployeesCount: 20,
          internalExitCount: 5,
          externalExitCount: 3,
          externalUnforcedExitCount: 0,
          internalEntryCount: 2,
          externalEntryCount: 5,
          responseModified: true,
        },
        loading: true,
        errorMessage: undefined,
      },
      fluctuationRates: {
        data: {
          unforcedFluctuationRates: [
            { global: 0.02, orgUnit: 0.013 },
            { global: 0.04, orgUnit: 0.03 },
          ],
          fluctuationRates: [
            { global: 0.025, orgUnit: 0.018 },
            { global: 0.035, orgUnit: 0.014 },
          ],
        },
        errorMessage: undefined,
        loading: false,
      },
      resignedEmployees: {
        data: {
          employees: [{ employeeName: 'Bastian' } as Employee],
          resignedEmployeesCount: 1,
          responseModified: false,
        },
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
      selectedFilters: {
        ids: [FilterKey.ORG_UNIT, FilterKey.TIME_RANGE],
        entities: {
          [FilterKey.ORG_UNIT]: {
            name: FilterKey.ORG_UNIT,
            idValue: {
              id: 'Schaeffler_IT',
              value: 'Schaeffler_IT',
            },
          },
          [FilterKey.TIME_RANGE]: {
            name: FilterKey.TIME_RANGE,
            idValue: {
              id: '1577863715|1609399715',
              value: '01.01.2020 - 31.12.2020',
            },
          },
        },
      },
      selectedDimension: FilterDimension.ORG_UNIT,
    } as unknown as FilterState,
  };

  describe('getIsLoadingAttritionOverTimeOverview', () => {
    it('should return loading status', () => {
      expect(getIsLoadingAttritionOverTimeOverview(fakeState)).toBeTruthy();
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
          entryEmployee2,
          entryEmployeeAfterTimeRange,
          internalEntryEmployeeBeforeTimeRange,
          internalEntryEmployee1,
          entryEmployeeBeforeTimeRange,
          entryEmployee1,
        ],
        exitEmployees: [leaverIT1, leaverIT2, internalLeaver1],
        fluctuationRate: {
          global: 0.041,
          orgUnit: 0.023,
        },
        unforcedFluctuationRate: {
          global: 0.081,
          orgUnit: 0.065,
        },
        totalEmployeesCount: 20,
        internalExitCount: 5,
        externalExitCount: 3,
        externalUnforcedExitCount: 0,
        internalEntryCount: 2,
        externalEntryCount: 5,
        responseModified: true,
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
          new DoughnutSeriesConfig([{ value: 2 }], 'internal', Color.LIME),
          new DoughnutSeriesConfig(
            [{ value: 5 }],
            'external',
            Color.LIGHT_BLUE
          ),
        ])
      );
    });
  });

  describe('getOverviewFluctuationExitsDoughnutConfig', () => {
    it('should return config for doughnut chart with exits', () => {
      expect(getOverviewFluctuationExitsDoughnutConfig(fakeState)).toEqual(
        new DoughnutConfig('Exits', [
          new DoughnutSeriesConfig([{ value: 5 }], 'internal', Color.LIME),
          new DoughnutSeriesConfig(
            [{ value: 3 }],
            'external',
            Color.LIGHT_BLUE
          ),
        ])
      );
    });
  });

  describe('getOverviewFluctuationEntriesCount', () => {
    it('should return actual entries number', () => {
      expect(getOverviewFluctuationEntriesCount(fakeState)).toEqual(7);
    });
  });

  describe('getOverviewFluctuationTotalEmployeesCount', () => {
    it('should return total headcount', () => {
      expect(
        getOverviewFluctuationTotalEmployeesCount.projector(fakeState.overview)
      ).toEqual(fakeState.overview.entriesExits.data.totalEmployeesCount);
    });
  });
  describe('getOverviewFluctuationExitsCount', () => {
    it('should return actual exits number', () => {
      expect(getOverviewFluctuationExitsCount(fakeState)).toEqual(8);
    });
  });

  describe('getExitEmployees', () => {
    it('should return external and internal leavers', () => {
      const leavers = getExitEmployees(fakeState);

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

  describe('getOverviewFluctuationKpi', () => {
    it('should return kpis', () => {
      const expectedResult = {
        kpiRates: {
          company: '4.1%',
          orgUnit: '2.3%',
        },
        orgUnitName: 'Schaeffler_IT',
        exitEmployees: [leaverIT1, leaverIT2],
        realEmployeesCount: 3,
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
        exitEmployees: [leaverIT1, leaverIT2],
        realEmployeesCount: 0,
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

function createExternalEntryEmployee(id: string, entryDate: string): Employee {
  return createEmployee(id, 'Schaeffler_IT', entryDate);
}

function createInternalEntryEmployee(
  id: string,
  internalEntryDate: string
): Employee {
  const employee = createEmployee(id, 'Schaeffler_IT');
  employee.actions = [
    { actionType: ActionType.INTERNAL, entryDate: internalEntryDate } as any,
  ];

  return employee;
}

function createExternalLeaver(
  id: string,
  orgUnit: string,
  exitDate: string
): Employee {
  return createEmployee(id, orgUnit, undefined, exitDate);
}

function createInternalLeaver(
  id: string,
  orgUnit: string,
  internalExitDate: string
) {
  const employee = createEmployee(id, orgUnit);

  employee.actions = [
    { actionType: ActionType.INTERNAL, exitDate: internalExitDate } as any,
  ];

  return employee;
}

function createEmployee(
  id: string,
  orgUnit: string,
  entryDate?: string,
  exitDate?: string
): Employee {
  return {
    employeeId: id,
    reportDate: '123',
    employeeName: 'John Walker',
    orgUnit,
    parentEmployeeId: '10',
    exitDate,
    entryDate: entryDate ?? new Date(2021, 5, 1).valueOf().toString(),
    reasonForLeaving: LeavingType.UNFORCED,
    level: 4,
    directSubordinates: 2,
    totalSubordinates: 1,
    directAttrition: 0,
    totalAttrition: 1,
    attritionMeta: undefined,
    directLeafChildren: [],
  } as Employee;
}
