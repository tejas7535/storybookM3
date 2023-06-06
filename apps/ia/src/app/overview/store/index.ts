/* eslint-disable max-lines */
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationRate,
  FluctuationRatesChartData,
  OpenApplication,
  OverviewWorkforceBalanceMeta,
  ResignedEmployeesResponse,
} from '../models';
import {
  clearOverviewBenchmarkData,
  clearOverviewDimensionData,
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadBenchmarkFluctuationRates,
  loadBenchmarkFluctuationRatesChartData,
  loadBenchmarkFluctuationRatesChartDataFailure,
  loadBenchmarkFluctuationRatesChartDataSuccess,
  loadBenchmarkFluctuationRatesFailure,
  loadBenchmarkFluctuationRatesSuccess,
  loadFluctuationRates,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesFailure,
  loadFluctuationRatesSuccess,
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

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  attritionOverTime: {
    data: AttritionOverTime;
    loading: boolean;
    errorMessage: string;
  };
  attritionOverTimeEmployees: {
    data: ExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  exitEmployees: {
    data: ExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  entryEmployees: {
    data: ExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  fluctuationRates: {
    benchmark: {
      data: FluctuationRate;
      loading: boolean;
      errorMessage: string;
    };
    dimension: {
      data: FluctuationRate;
      loading: boolean;
      errorMessage: string;
    };
  };
  workforceBalanceMeta: {
    dimension: {
      data: OverviewWorkforceBalanceMeta;
      loading: boolean;
      errorMessage: string;
    };
  };
  fluctuationRatesChart: {
    benchmark: {
      data: FluctuationRatesChartData;
      loading: boolean;
      errorMessage: string;
    };
    dimension: {
      data: FluctuationRatesChartData;
      loading: boolean;
      errorMessage: string;
    };
  };
  resignedEmployees: {
    data: ResignedEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  openApplications: {
    data: OpenApplication[];
    loading: boolean;
    errorMessage: string;
  };
  openApplicationsCount: {
    loading: boolean;
    data: number;
    errorMessage: string;
  };
}

export const initialState: OverviewState = {
  attritionOverTime: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  attritionOverTimeEmployees: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  exitEmployees: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  entryEmployees: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  fluctuationRates: {
    benchmark: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    dimension: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
  workforceBalanceMeta: {
    dimension: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
  fluctuationRatesChart: {
    benchmark: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    dimension: {
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
  resignedEmployees: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  openApplications: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  openApplicationsCount: {
    loading: false,
    data: undefined,
    errorMessage: undefined,
  },
};

export const overviewReducer = createReducer(
  initialState,
  on(
    loadFluctuationRates,
    (state: OverviewState): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        dimension: {
          ...state.fluctuationRates.dimension,
          loading: true,
        },
      },
    })
  ),
  on(
    loadFluctuationRatesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        dimension: {
          ...state.fluctuationRates.dimension,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadFluctuationRatesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        dimension: {
          ...state.fluctuationRates.dimension,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRates,
    (state: OverviewState): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        benchmark: {
          ...state.fluctuationRates.benchmark,
          loading: true,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRatesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        benchmark: {
          ...state.fluctuationRates.benchmark,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRatesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        benchmark: {
          ...state.fluctuationRates.benchmark,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    loadAttritionOverTimeOverview,
    (state: OverviewState): OverviewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        loading: true,
      },
    })
  ),
  on(
    loadAttritionOverTimeOverviewSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadAttritionOverTimeOverviewFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadAttritionOverTimeEmployees,
    (state: OverviewState): OverviewState => ({
      ...state,
      attritionOverTimeEmployees: {
        ...state.attritionOverTimeEmployees,
        loading: true,
      },
    })
  ),
  on(
    loadAttritionOverTimeEmployeesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      attritionOverTimeEmployees: {
        ...state.attritionOverTimeEmployees,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadAttritionOverTimeEmployeesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      attritionOverTimeEmployees: {
        ...state.attritionOverTimeEmployees,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadWorkforceBalanceMeta,
    (state: OverviewState): OverviewState => ({
      ...state,
      workforceBalanceMeta: {
        ...state.workforceBalanceMeta,
        dimension: {
          ...state.workforceBalanceMeta.dimension,
          loading: true,
        },
      },
    })
  ),
  on(
    loadWorkforceBalanceMetaSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      workforceBalanceMeta: {
        ...state.workforceBalanceMeta,
        dimension: {
          ...state.workforceBalanceMeta.dimension,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadWorkforceBalanceMetaFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      workforceBalanceMeta: {
        ...state.workforceBalanceMeta,
        dimension: {
          ...state.workforceBalanceMeta.dimension,
          loading: false,
          errorMessage,
        },
      },
    })
  ),
  on(
    clearOverviewDimensionData,
    (state: OverviewState): OverviewState => ({
      ...state,
      workforceBalanceMeta: {
        ...state.workforceBalanceMeta,
        dimension: {
          ...state.workforceBalanceMeta.dimension,
          data: undefined,
        },
      },
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        dimension: {
          ...state.fluctuationRatesChart.dimension,
          data: undefined,
        },
      },
      fluctuationRates: {
        ...state.fluctuationRates,
        dimension: {
          ...state.fluctuationRates.dimension,
          data: undefined,
        },
      },
      openApplicationsCount: {
        ...state.openApplicationsCount,
        data: undefined,
      },
      openApplications: {
        ...state.openApplications,
        data: undefined,
      },
      resignedEmployees: {
        ...state.resignedEmployees,
        data: undefined,
      },
      attritionOverTime: {
        ...state.attritionOverTime,
        data: undefined,
      },
    })
  ),
  on(
    clearOverviewBenchmarkData,
    (state: OverviewState): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        benchmark: {
          ...state.fluctuationRates.benchmark,
          data: undefined,
        },
      },
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        benchmark: {
          ...state.fluctuationRatesChart.benchmark,
          data: undefined,
        },
      },
    })
  ),
  on(
    loadOverviewExitEmployees,
    (state: OverviewState): OverviewState => ({
      ...state,
      exitEmployees: {
        ...state.exitEmployees,
        loading: true,
      },
    })
  ),
  on(
    loadOverviewExitEmployeesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      exitEmployees: {
        ...state.exitEmployees,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadOverviewExitEmployeesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      exitEmployees: {
        ...state.exitEmployees,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadOverviewEntryEmployees,
    (state: OverviewState): OverviewState => ({
      ...state,
      entryEmployees: {
        ...state.entryEmployees,
        loading: true,
      },
    })
  ),
  on(
    loadOverviewEntryEmployeesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      entryEmployees: {
        ...state.entryEmployees,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadOverviewEntryEmployeesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      entryEmployees: {
        ...state.entryEmployees,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  ),
  on(
    loadFluctuationRatesChartData,
    (state: OverviewState): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        dimension: {
          ...state.fluctuationRatesChart.dimension,
          data: undefined,
          loading: true,
        },
      },
    })
  ),
  on(
    loadFluctuationRatesChartDataSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        dimension: {
          ...state.fluctuationRatesChart.dimension,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadFluctuationRatesChartDataFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        dimension: {
          ...state.fluctuationRatesChart.dimension,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRatesChartData,
    (state: OverviewState): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        benchmark: {
          ...state.fluctuationRatesChart.benchmark,
          loading: true,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRatesChartDataSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        benchmark: {
          ...state.fluctuationRatesChart.benchmark,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadBenchmarkFluctuationRatesChartDataFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      fluctuationRatesChart: {
        ...state.fluctuationRatesChart,
        benchmark: {
          ...state.fluctuationRatesChart.benchmark,
          errorMessage,
          loading: false,
        },
      },
    })
  ),
  on(
    loadResignedEmployees,
    (state: OverviewState): OverviewState => ({
      ...state,
      resignedEmployees: {
        ...state.resignedEmployees,
        loading: true,
      },
    })
  ),
  on(
    loadResignedEmployeesSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      resignedEmployees: {
        ...state.resignedEmployees,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadResignedEmployeesFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      resignedEmployees: {
        ...state.resignedEmployees,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    loadOpenApplications,
    (state: OverviewState): OverviewState => ({
      ...state,
      openApplications: {
        ...state.openApplications,
        data: undefined,
        loading: true,
      },
    })
  ),
  on(
    loadOpenApplicationsSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      openApplications: {
        ...state.openApplications,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadOpenApplicationsFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      openApplications: {
        ...state.openApplications,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    loadOpenApplicationsCount,
    (state: OverviewState): OverviewState => ({
      ...state,
      openApplicationsCount: {
        ...state.openApplicationsCount,
        loading: true,
      },
    })
  ),
  on(
    loadOpenApplicationsCountSuccess,
    (state: OverviewState, { openApplicationsCount }): OverviewState => ({
      ...state,
      openApplicationsCount: {
        data: openApplicationsCount,
        loading: false,
        errorMessage: undefined,
      },
    })
  ),
  on(
    loadOpenApplicationsCountFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      openApplicationsCount: {
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState =
  createFeatureSelector<OverviewState>(overviewFeatureKey);
