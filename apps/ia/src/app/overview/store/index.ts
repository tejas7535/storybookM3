import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  AttritionOverTime,
  FluctuationRatesChartData,
  OverviewFluctuationRates,
} from '../../shared/models';
import { ResignedEmployee } from '../models';
import {
  loadAttritionOverTimeOverview,
  loadAttritionOverTimeOverviewFailure,
  loadAttritionOverTimeOverviewSuccess,
  loadFluctuationRatesChartData,
  loadFluctuationRatesChartDataFailure,
  loadFluctuationRatesChartDataSuccess,
  loadFluctuationRatesOverview,
  loadFluctuationRatesOverviewFailure,
  loadFluctuationRatesOverviewSuccess,
  loadResignedEmployees,
  loadResignedEmployeesFailure,
  loadResignedEmployeesSuccess,
  loadUnforcedFluctuationRatesChartData,
  loadUnforcedFluctuationRatesChartDataFailure,
  loadUnforcedFluctuationRatesChartDataSuccess,
} from './actions/overview.action';

export const overviewFeatureKey = 'overview';

export interface OverviewState {
  attritionOverTime: {
    data: AttritionOverTime;
    loading: boolean;
    errorMessage: string;
  };
  entriesExits: {
    data: OverviewFluctuationRates;
    loading: boolean;
    errorMessage: string;
  };
  fluctuationRates: {
    data: FluctuationRatesChartData;
    loading: boolean;
    errorMessage: string;
  };
  unforcedFluctuationRates: {
    data: FluctuationRatesChartData;
    loading: boolean;
    errorMessage: string;
  };
  resignedEmployees: {
    data: ResignedEmployee[];
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: OverviewState = {
  attritionOverTime: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  entriesExits: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  fluctuationRates: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  unforcedFluctuationRates: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
  resignedEmployees: {
    data: undefined,
    loading: false,
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
    loadFluctuationRatesOverview,
    (state: OverviewState): OverviewState => ({
      ...state,
      entriesExits: {
        ...state.entriesExits,
        loading: true,
      },
    })
  ),
  on(
    loadFluctuationRatesOverviewSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      entriesExits: {
        ...state.entriesExits,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadFluctuationRatesOverviewFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      entriesExits: {
        ...state.entriesExits,
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
    loadUnforcedFluctuationRatesChartData,
    (state: OverviewState): OverviewState => ({
      ...state,
      unforcedFluctuationRates: {
        ...state.fluctuationRates,
        loading: true,
      },
    })
  ),
  on(
    loadUnforcedFluctuationRatesChartDataSuccess,
    (state: OverviewState, { data }): OverviewState => ({
      ...state,
      unforcedFluctuationRates: {
        ...state.unforcedFluctuationRates,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadUnforcedFluctuationRatesChartDataFailure,
    (state: OverviewState, { errorMessage }): OverviewState => ({
      ...state,
      unforcedFluctuationRates: {
        ...state.unforcedFluctuationRates,
        errorMessage,
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
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: OverviewState, action: Action): OverviewState {
  return overviewReducer(state, action);
}

export const selectOverviewState =
  createFeatureSelector<OverviewState>(overviewFeatureKey);
