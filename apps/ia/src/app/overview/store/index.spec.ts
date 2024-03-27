import { Action } from '@ngrx/store';

import { EmployeesRequest, MonthlyFluctuation } from '../../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  FluctuationRatesChartData,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../models';
import { initialState, overviewReducer, OverviewState, reducer } from '.';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadOpenApplications,
  loadOpenApplicationsCount,
  loadOpenApplicationsCountFailure,
  loadOpenApplicationsCountSuccess,
  loadOpenApplicationsFailure,
  loadOpenApplicationsSuccess,
  loadOverviewEntryEmployees,
  loadOverviewEntryEmployeesFailure,
  loadOverviewEntryEmployeesSuccess,
  loadOverviewExitEmployees,
  loadOverviewExitEmployeesFailure,
  loadOverviewExitEmployeesSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadWorkforceBalanceMeta,
  loadWorkforceBalanceMetaFailure,
  loadWorkforceBalanceMetaSuccess,
} from './actions/overview.action';

describe('Overview Reducer', () => {
  const errorMessage = 'An error occured';

  describe('loadAttritionOverTimeOverview', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeOverview({
        request: { value: 'ACB' } as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeTruthy();
    });
  });

  describe('loadAttritionOverTimeOverviewSuccess', () => {
    test('should unset loading and set country data', () => {
      const monthlyFluctuation = {} as unknown as MonthlyFluctuation;

      const action = loadAttritionOverTimeOverviewSuccess({
        monthlyFluctuation,
      });

      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.data).toEqual(monthlyFluctuation);
    });
  });

  describe('loadAttritionOverTimeOverviewFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadAttritionOverTimeOverviewFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        attritionOverTime: {
          ...initialState.attritionOverTime,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.attritionOverTime.loading).toBeFalsy();
      expect(state.attritionOverTime.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadAttritionOverTimeEmployees', () => {
    test('should set loading', () => {
      const action = loadAttritionOverTimeEmployees({
        timeRange: '1-1',
      });
      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTimeEmployees.loading).toBeTruthy();
    });
  });

  describe('loadAttritionOverTimeEmployeesSuccess', () => {
    test('should unset loading and set employees data', () => {
      const data: ExitEntryEmployeesResponse = {
        employees: [],
        responseModified: true,
      };
      const action = loadAttritionOverTimeEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.attritionOverTimeEmployees.loading).toBeFalsy();
      expect(state.attritionOverTimeEmployees.data).toEqual(data);
    });
  });

  describe('loadAttritionOverTimeEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadAttritionOverTimeEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        attritionOverTime: {
          ...initialState.attritionOverTime,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.attritionOverTimeEmployees.loading).toBeFalsy();
      expect(state.attritionOverTimeEmployees.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('loadFluctuationRatesChartData', () => {
    test('should set loading', () => {
      const action = loadFluctuationRatesChartData({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRatesChart.dimension.loading).toBeTruthy();
    });
  });

  describe('loadFluctuationRatesChartDataSuccess', () => {
    test('should unset loading and set fluctuation rates data', () => {
      const monthlyFluctuation = {} as unknown as MonthlyFluctuation;

      const action = loadFluctuationRatesChartDataSuccess({
        monthlyFluctuation,
      });

      const state = overviewReducer(initialState, action);

      expect(state.fluctuationRatesChart.dimension.loading).toBeFalsy();
      expect(state.fluctuationRatesChart.dimension.data).toEqual(
        monthlyFluctuation
      );
    });
  });

  describe('loadFluctuationRatesChartDataFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadFluctuationRatesChartDataFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        fluctuationRatesChart: {
          ...initialState.fluctuationRatesChart,
          dimension: {
            ...initialState.fluctuationRatesChart.dimension,
            loading: true,
          },
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.fluctuationRatesChart.dimension.loading).toBeFalsy();
      expect(state.fluctuationRatesChart.dimension.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('loadFluctuationRatesOverview', () => {
    test('should set loading', () => {
      const action = loadWorkforceBalanceMeta({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.workforceBalanceMeta.dimension.loading).toBeTruthy();
    });
  });

  describe('loadFluctuationRatesOverviewSuccess', () => {
    test('should unset loading and set fluctuation data', () => {
      const data: OverviewWorkforceBalanceMeta =
        {} as unknown as OverviewWorkforceBalanceMeta;

      const action = loadWorkforceBalanceMetaSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.workforceBalanceMeta.dimension.loading).toBeFalsy();
      expect(state.workforceBalanceMeta.dimension.data).toEqual(data);
    });
  });

  describe('loadFluctuationRatesOverviewFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadWorkforceBalanceMetaFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        workforceBalanceMeta: {
          ...initialState.workforceBalanceMeta,
          dimension: {
            ...initialState.workforceBalanceMeta.dimension,
            loading: true,
          },
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.workforceBalanceMeta.dimension.loading).toBeFalsy();
      expect(state.workforceBalanceMeta.dimension.errorMessage).toEqual(
        errorMessage
      );
    });
  });

  describe('clearOverviewDimensionData', () => {
    test('should clear overview dimension data', () => {
      const benchmarkRate = 70;
      const benchmarkUnforcedRate = 50;
      const dimensionRate = 90;
      const dimensionUnforcedRate = 60;

      const fakeState: OverviewState = {
        ...initialState,
        fluctuationRates: {
          ...initialState.fluctuationRates,
          benchmark: {
            ...initialState.fluctuationRates.benchmark,
            data: {
              fluctuationRate: benchmarkRate,
              unforcedFluctuationRate: benchmarkUnforcedRate,
            },
          },
          dimension: {
            ...initialState.fluctuationRates.dimension,
            data: {
              fluctuationRate: dimensionRate,
              unforcedFluctuationRate: dimensionUnforcedRate,
            },
          },
        },
        workforceBalanceMeta: {
          ...initialState.workforceBalanceMeta,
          dimension: {
            ...initialState.workforceBalanceMeta.dimension,
            data: {
              ...initialState.workforceBalanceMeta.dimension.data,
              externalUnforcedExitCount: 1,
              externalEntryCount: 2,
              externalExitCount: 3,
              internalEntryCount: 4,
              internalExitCount: 5,
              totalEmployeesCount: 6,
            },
          },
        },
        fluctuationRatesChart: {
          ...initialState.fluctuationRatesChart,
          dimension: {
            ...initialState.fluctuationRatesChart.dimension,
            data: {
              ...initialState.fluctuationRatesChart.dimension.data,
              fluctuationRates: [7],
              unforcedFluctuationRates: [7],
            },
          },
          benchmark: {
            ...initialState.fluctuationRatesChart.benchmark,
            data: {
              ...initialState.fluctuationRatesChart.benchmark.data,
              fluctuationRates: [benchmarkRate],
              unforcedFluctuationRates: [benchmarkUnforcedRate],
            },
          },
        },
        openApplicationsCount: {
          ...initialState.openApplicationsCount,
          data: 57,
        },
        openApplications: {
          ...initialState.openApplications,
          data: [],
        },
        resignedEmployees: {
          ...initialState.resignedEmployees,
          data: {} as ResignedEmployeesResponse,
        },
        attritionOverTime: {
          ...initialState.attritionOverTime,
          data: {} as Partial<MonthlyFluctuation>,
        },
      };
      const action = clearOverviewDimensionData();

      const state = overviewReducer(fakeState, action);

      expect(state.fluctuationRates.dimension.data).toBeUndefined();
      expect(state.fluctuationRates.benchmark.data.fluctuationRate).toEqual(
        benchmarkRate
      );
      expect(
        state.fluctuationRates.benchmark.data.unforcedFluctuationRate
      ).toEqual(benchmarkUnforcedRate);
      expect(state.workforceBalanceMeta.dimension.data).toBeUndefined();
      expect(state.fluctuationRatesChart.dimension.data).toBeUndefined();
      expect(
        state.fluctuationRatesChart.benchmark.data.fluctuationRates[0]
      ).toEqual(benchmarkRate);
      expect(
        state.fluctuationRatesChart.benchmark.data.unforcedFluctuationRates[0]
      ).toEqual(benchmarkUnforcedRate);
      expect(state.openApplicationsCount.data).toBeUndefined();
      expect(state.openApplications.data).toBeUndefined();
      expect(state.resignedEmployees.data).toBeUndefined();
      expect(state.attritionOverTime.data).toBeUndefined();
    });
  });

  describe('clearOverviewBenchmarkData', () => {
    test('should clear benchmark related data', () => {
      const fakeState: OverviewState = {
        ...initialState,
        fluctuationRates: {
          ...initialState.fluctuationRates,
          benchmark: {
            ...initialState.fluctuationRates.benchmark,
            data: {
              fluctuationRate: 10,
              unforcedFluctuationRate: 20,
            } as FluctuationRate,
          },
        },
        fluctuationRatesChart: {
          ...initialState.fluctuationRatesChart,
          benchmark: {
            ...initialState.fluctuationRatesChart.benchmark,
            data: {
              fluctuationRates: [1],
              unforcedFluctuationRates: [2],
            } as FluctuationRatesChartData,
          },
        },
      };
      const action = clearOverviewBenchmarkData();

      const state = overviewReducer(fakeState, action);

      expect(state.fluctuationRates.benchmark.data).toBeUndefined();
      expect(state.fluctuationRatesChart.benchmark.data).toBeUndefined();
    });
  });

  describe('loadResignedEmployees', () => {
    test('should set loading', () => {
      const action = loadResignedEmployees();
      const state = overviewReducer(initialState, action);

      expect(state.resignedEmployees.loading).toBeTruthy();
    });
  });

  describe('loadResignedEmployeesSuccess', () => {
    test('should unset loading and set resigned employees', () => {
      const data: ResignedEmployeesResponse = {
        employees: [],
        resignedEmployeesCount: 5,
        responseModified: true,
        synchronizedOn: '123',
      };

      const action = loadResignedEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.resignedEmployees.loading).toBeFalsy();
      expect(state.resignedEmployees.data).toEqual(data);
    });
  });

  describe('loadResignedEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadResignedEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        resignedEmployees: {
          ...initialState.resignedEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.resignedEmployees.loading).toBeFalsy();
      expect(state.resignedEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOpenApplications', () => {
    test('should set loading', () => {
      const action = loadOpenApplications();
      const state = overviewReducer(initialState, action);

      expect(state.openApplications.loading).toBeTruthy();
    });
  });

  describe('loadOpenApplicationsSuccess', () => {
    test('should unset loading and set open applications', () => {
      const data: OpenApplication[] = [];

      const action = loadOpenApplicationsSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.openApplications.loading).toBeFalsy();
      expect(state.openApplications.data).toEqual(data);
    });
  });

  describe('loadOpenApplicationsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOpenApplicationsFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        openApplications: {
          ...initialState.openApplications,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.openApplications.loading).toBeFalsy();
      expect(state.openApplications.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOverviewExitEmployees', () => {
    test('should set loading', () => {
      const action = loadOverviewExitEmployees();
      const state = overviewReducer(initialState, action);

      expect(state.exitEmployees.loading).toBeTruthy();
    });
  });

  describe('loadOverviewExitEmployeesSuccess', () => {
    test('should unset loading and set exit employees', () => {
      const data: ExitEntryEmployeesResponse =
        {} as unknown as ExitEntryEmployeesResponse;

      const action = loadOverviewExitEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.exitEmployees.loading).toBeFalsy();
      expect(state.exitEmployees.data).toEqual(data);
    });
  });

  describe('loadOverviewExitEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOverviewExitEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        exitEmployees: {
          ...initialState.exitEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.exitEmployees.loading).toBeFalsy();
      expect(state.exitEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOverviewEntryEmployees', () => {
    test('should set loading', () => {
      const action = loadOverviewEntryEmployees();
      const state = overviewReducer(initialState, action);

      expect(state.entryEmployees.loading).toBeTruthy();
    });
  });

  describe('loadOverviewEntryEmployeesSuccess', () => {
    test('should unset loading and set entry employees', () => {
      const data: ExitEntryEmployeesResponse =
        {} as unknown as ExitEntryEmployeesResponse;

      const action = loadOverviewEntryEmployeesSuccess({ data });

      const state = overviewReducer(initialState, action);

      expect(state.entryEmployees.loading).toBeFalsy();
      expect(state.entryEmployees.data).toEqual(data);
    });
  });

  describe('loadOverviewEntryEmployeesFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOverviewEntryEmployeesFailure({ errorMessage });
      const fakeState: OverviewState = {
        ...initialState,
        entryEmployees: {
          ...initialState.entryEmployees,
          loading: true,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.entryEmployees.loading).toBeFalsy();
      expect(state.entryEmployees.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadOpenApplicationsCount', () => {
    test('should set loading', () => {
      const action = loadOpenApplicationsCount({
        request: {} as unknown as EmployeesRequest,
      });
      const state = overviewReducer(initialState, action);

      expect(state.openApplicationsCount.loading).toBeTruthy();
    });
  });

  describe('loadOpenApplicationsCountSuccess', () => {
    test('should unset loading and set open applications count', () => {
      const openApplicationsCount = 5;

      const action = loadOpenApplicationsCountSuccess({
        openApplicationsCount,
      });

      const state = overviewReducer(initialState, action);

      expect(state.openApplicationsCount.loading).toBeFalsy();
      expect(state.openApplicationsCount.data).toEqual(openApplicationsCount);
    });
  });

  describe('loadOpenApplicationsCountFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadOpenApplicationsCountFailure({ errorMessage });
      const fakeState = {
        ...initialState,
        openApplicationsCount: {
          ...initialState.openApplicationsCount,
          loading: true,
          data: 80,
        },
      };

      const state = overviewReducer(fakeState, action);

      expect(state.openApplicationsCount.data).toBeUndefined();
      expect(state.openApplicationsCount.loading).toBeFalsy();
      expect(state.openApplicationsCount.errorMessage).toEqual(errorMessage);
    });
  });

  describe('Reducer function', () => {
    test('should return overviewReducer', () => {
      // prepare any action
      const action: Action = { type: 'Test' };
      expect(reducer(initialState, action)).toEqual(
        overviewReducer(initialState, action)
      );
    });
  });
});
