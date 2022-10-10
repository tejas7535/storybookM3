/* eslint-disable max-lines */
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import {
  FluctuationRatesChartData,
  OpenApplication,
  OverviewExitEntryEmployeesResponse,
  OverviewFluctuationRates,
  ResignedEmployeesResponse,
} from '../models';
import {
  loadAttritionOverTimeEmployees,
  loadAttritionOverTimeEmployeesFailure,
  loadAttritionOverTimeEmployeesSuccess,
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
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
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  attritionOverTime: {
    data: AttritionOverTime;
    loading: boolean;
    errorMessage: string;
  };
  attritionOverTimeEmployees: {
    data: OverviewExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  exitEmployees: {
    data: OverviewExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  entryEmployees: {
    data: OverviewExitEntryEmployeesResponse;
    loading: boolean;
    errorMessage: string;
  };
  entriesExitsMeta: {
    data: OverviewFluctuationRates;
    loading: boolean;
    errorMessage: string;
  };
  fluctuationRates: {
    data: FluctuationRatesChartData;
    loading: boolean;
    errorMessage: string;
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
  entriesExitsMeta: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  fluctuationRates: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
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
    loadFluctuationRatesOverview,
    (state: OverviewState): OverviewState => ({
      ...state,
      entriesExitsMeta: {
        ...state.entriesExitsMeta,
        loading: true,
      },
    })
  ),
  on(
    loadFluctuationRatesOverviewSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      entriesExitsMeta: {
        ...state.entriesExitsMeta,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadFluctuationRatesOverviewFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      entriesExitsMeta: {
        ...state.entriesExitsMeta,
        errorMessage,
        data: undefined,
        loading: false,
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
      fluctuationRates: {
        ...state.fluctuationRates,
        loading: true,
      },
    })
  ),
  on(
    loadFluctuationRatesChartDataSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadFluctuationRatesChartDataFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      fluctuationRates: {
        ...state.fluctuationRates,
        errorMessage,
        data: undefined,
        loading: false,
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
