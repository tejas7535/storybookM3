import { SeriesOption } from 'echarts';
import moment from 'moment';

import { FilterState } from '../../../core/store/reducers/filter/filter.reducer';
import { DoughnutConfig } from '../../../shared/charts/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../../shared/charts/models/doughnut-series-config.model';
import {
  ActionType,
  Color,
  Employee,
  EmployeeWithAction,
  FilterDimension,
  FilterKey,
} from '../../../shared/models';
import { FluctuationKpi, LeavingType, OpenApplication } from '../../models';
import { initialState, OverviewState } from '..';
import {
  getAttritionOverTimeOverviewData,
  getExternalEntryCount,
  getExternalExitCount,
  getFluctuationRatesForChart,
  getInternalEntryCount,
  getInternalExitCount,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingOpenApplications,
  getIsLoadingResignedEmployees,
  getOpenApplications,
  getOverviewEntryEmployees,
  getOverviewEntryEmployeesLoading,
  getOverviewExitEmployees,
  getOverviewExitEmployeesLoading,
  getOverviewExternalExitEmployees,
  getOverviewExternalUnforcedExitEmployees,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationKpi,
  getOverviewFluctuationRates,
  getOverviewFluctuationTotalEmployeesCount,
  getOverviewUnforcedFluctuationKpi,
  getResignedEmployees,
  getResignedEmployeesCount,
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

  const leaverITUnforced = createExternalUnforcedLeaver(
    '11',
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
      exitEmployees: {
        data: {
          employees: [leaverIT1, leaverIT2, internalLeaver1, leaverITUnforced],
          responseModified: false,
        },
        loading: true,
        errorMessage: undefined,
      },
      entryEmployees: {
        data: {
          employees: [
            entryEmployee2,
            entryEmployeeAfterTimeRange,
            internalEntryEmployeeBeforeTimeRange,
            internalEntryEmployee1,
            entryEmployeeBeforeTimeRange,
            entryEmployee1,
          ],
          responseModified: false,
        },
        loading: true,
        errorMessage: undefined,
      },
      entriesExitsMeta: {
        data: {
          fluctuationRate: {
            global: 0.041,
            dimension: 0.023,
          },
          unforcedFluctuationRate: {
            global: 0.081,
            dimension: 0.065,
          },
          totalEmployeesCount: 20,
          internalExitCount: 5,
          externalExitCount: 3,
          externalUnforcedExitCount: 0,
          internalEntryCount: 2,
          externalEntryCount: 5,
        },
        loading: true,
        errorMessage: undefined,
      },
      fluctuationRates: {
        data: {
          unforcedFluctuationRates: [
            { global: 0.02, dimension: 0.013 },
            { global: 0.04, dimension: 0.03 },
          ],
          fluctuationRates: [
            { global: 0.025, dimension: 0.018 },
            { global: 0.035, dimension: 0.014 },
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
        ids: [FilterDimension.ORG_UNIT, FilterKey.TIME_RANGE],
        entities: {
          [FilterDimension.ORG_UNIT]: {
            name: FilterDimension.ORG_UNIT,
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
        fluctuationRate: {
          global: 0.041,
          dimension: 0.023,
        },
        unforcedFluctuationRate: {
          global: 0.081,
          dimension: 0.065,
        },
        totalEmployeesCount: 20,
        internalExitCount: 5,
        externalExitCount: 3,
        externalUnforcedExitCount: 0,
        internalEntryCount: 2,
        externalEntryCount: 5,
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
      ).toEqual(fakeState.overview.entriesExitsMeta.data.totalEmployeesCount);
    });
  });
  describe('getOverviewFluctuationExitsCount', () => {
    it('should return actual exits number', () => {
      expect(getOverviewFluctuationExitsCount(fakeState)).toEqual(8);
    });
  });

  describe('getOverviewExitEmployees', () => {
    it('should return overview exit employees', () => {
      const employees = getOverviewExitEmployees.projector(fakeState.overview);

      expect(employees).toEqual(
        fakeState.overview.exitEmployees.data.employees
      );
    });
  });

  describe('getOverviewExternalExitEmployees', () => {
    it('should return overview external exit employees', () => {
      const employees = getOverviewExternalExitEmployees.projector(
        fakeState.overview.exitEmployees.data.employees
      );

      expect(employees).toEqual([leaverIT1, leaverIT2, leaverITUnforced]);
    });
  });

  describe('getOverviewExternalUnforcedExitEmployees', () => {
    it('should return overview unforced external exit employees', () => {
      const employees = getOverviewExternalUnforcedExitEmployees.projector(
        fakeState.overview.exitEmployees.data.employees
      );

      expect(employees).toEqual([leaverITUnforced]);
    });
  });

  describe('getOverviewExitEmployeesLoading', () => {
    it('should return loading state', () => {
      expect(
        getOverviewExitEmployeesLoading.projector(fakeState.overview)
      ).toBeTruthy();
    });
  });

  describe('getOverviewEntryEmployees', () => {
    it('should return external entry employees only in selected time range', () => {
      const entryEmployees = getOverviewEntryEmployees.projector(
        fakeState.overview
      );

      expect(entryEmployees).toEqual(
        fakeState.overview.entryEmployees.data.employees
      );
    });
  });

  describe('getOverviewEntryEmployeesLoading', () => {
    it('should return loading state', () => {
      expect(
        getOverviewEntryEmployeesLoading.projector(fakeState.overview)
      ).toBeTruthy();
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
            ids: [FilterDimension.ORG_UNIT],
            entities: {
              ORG_UNIT: {
                name: FilterDimension.ORG_UNIT,
                value: 'Schaeffler_IT',
              },
            },
          },
          selectedDimension: FilterDimension.ORG_UNIT,
        } as unknown as FilterState,
      };

      expect(getOverviewFluctuationKpi(entriesExitsNotReady)).toBeUndefined();
    });
  });

  describe('getOverviewUnforcedFluctuationKpi', () => {
    it('should return kpis', () => {
      const expectedResult = {
        kpiRates: {
          company: '8.1%',
          orgUnit: '6.5%',
        },
        orgUnitName: 'Schaeffler_IT',
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
            ids: [FilterDimension.ORG_UNIT],
            entities: {
              ORG_UNIT: {
                name: FilterDimension.ORG_UNIT,
                value: 'Schaeffler_IT',
              },
            },
          },
          selectedDimension: FilterDimension.ORG_UNIT,
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

  describe('getResignedEmployeesCount', () => {
    it('should return resigned employees count', () => {
      expect(getResignedEmployeesCount.projector(fakeState.overview)).toEqual(
        fakeState.overview.resignedEmployees.data?.resignedEmployeesCount
      );
    });
  });

  describe('getOpenApplications', () => {
    it('should return open applications', () => {
      expect(getOpenApplications.projector(fakeState.overview)).toEqual([
        { name: 'UI Designer' },
      ]);
    });
  });

  describe('getIsLoadingOpenApplications', () => {
    it('should return open applications count', () => {
      expect(
        getIsLoadingOpenApplications.projector(fakeState.overview)
      ).toEqual(fakeState.overview.openApplications.loading);
    });
  });

  describe('getInternalExitCount', () => {
    test('should return internal exit count', () => {
      const count = getInternalExitCount.projector(fakeState.overview);

      expect(count).toEqual(
        fakeState.overview.entriesExitsMeta.data.internalExitCount
      );
    });
  });

  describe('getExternalExitCount', () => {
    test('should return external exit count', () => {
      const count = getExternalExitCount.projector(fakeState.overview);

      expect(count).toEqual(
        fakeState.overview.entriesExitsMeta.data.externalExitCount
      );
    });
  });

  describe('getInternalEntryCount', () => {
    test('should return internal entry count', () => {
      const count = getInternalEntryCount.projector(fakeState.overview);

      expect(count).toEqual(
        fakeState.overview.entriesExitsMeta.data.internalEntryCount
      );
    });
  });

  describe('getExternalEntryCount', () => {
    test('should return external entry count', () => {
      const count = getExternalEntryCount.projector(fakeState.overview);

      expect(count).toEqual(
        fakeState.overview.entriesExitsMeta.data.externalEntryCount
      );
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
        ids: [FilterDimension.ORG_UNIT],
        entities: {
          ORG_UNIT: { name: FilterDimension.ORG_UNIT, value: 'Schaeffler_IT' },
        },
      },
      selectedDimension: FilterDimension.ORG_UNIT,
    } as unknown as FilterState,
  };
}

function createExternalEntryEmployee(
  name: string,
  entryDate: string
): EmployeeWithAction {
  return createEmployee(
    name,
    'Schaeffler_IT',
    ActionType.EXTERNAL,
    undefined,
    entryDate
  );
}

function createInternalEntryEmployee(
  name: string,
  internalEntryDate: string
): EmployeeWithAction {
  return createEmployee(
    name,
    'Schaeffler IT',
    ActionType.INTERNAL,
    undefined,
    internalEntryDate
  );
}

function createExternalLeaver(
  name: string,
  orgUnit: string,
  exitDate: string
): EmployeeWithAction {
  return createEmployee(
    name,
    orgUnit,
    ActionType.EXTERNAL,
    undefined,
    undefined,
    exitDate
  );
}

function createExternalUnforcedLeaver(
  name: string,
  orgUnit: string,
  exitDate: string
): EmployeeWithAction {
  return createEmployee(
    name,
    orgUnit,
    ActionType.EXTERNAL,
    LeavingType.UNFORCED,
    undefined,
    exitDate
  );
}

function createInternalLeaver(
  name: string,
  orgUnit: string,
  internalExitDate: string
) {
  return createEmployee(
    name,
    orgUnit,
    ActionType.INTERNAL,
    undefined,
    undefined,
    internalExitDate
  );
}

function createEmployee(
  employeeName: string,
  orgUnit: string,
  actionType: ActionType,
  reasonForLeaving?: LeavingType,
  entryDate?: string,
  exitDate?: string,
  positionDescription?: string
): EmployeeWithAction {
  return {
    employeeName,
    exitDate,
    entryDate,
    orgUnit,
    actionType,
    reasonForLeaving,
    positionDescription,
  } as EmployeeWithAction;
}
