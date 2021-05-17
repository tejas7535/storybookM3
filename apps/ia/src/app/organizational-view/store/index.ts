import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime, IdValue } from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import { OrgChartEmployee } from '../org-chart/models/org-chart-employee.model';
import { CountryData } from '../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapSuccess,
} from './actions/organizational-view.action';

export const organizationalViewFeatureKey = 'organizationalView';

export interface OrganizationalViewState {
  orgChart: {
    data: OrgChartEmployee[];
    loading: boolean;
    errorMessage: string;
  };
  worldMap: {
    data: CountryData[];
    continents: IdValue[];
    loading: boolean;
    errorMessage: string;
  };
  selectedChart: ChartType;
  attritionOverTime: {
    data: AttritionOverTime;
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: OrganizationalViewState = {
  orgChart: {
    data: [],
    loading: false,
    errorMessage: undefined,
  },
  worldMap: {
    data: [],
    // Hardcoded for PoC
    continents: [
      {
        id: 'europe',
        value: 'Europe',
      },
      {
        id: 'asia',
        value: 'Asia Pacific',
      },
      {
        id: 'americas',
        value: 'Americas',
      },
    ],
    loading: false,
    errorMessage: undefined,
  },
  selectedChart: ChartType.ORG_CHART,
  attritionOverTime: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const organizationalViewReducer = createReducer(
  initialState,
  on(chartTypeSelected, (state: OrganizationalViewState, { chartType }) => ({
    ...state,
    selectedChart: chartType,
  })),
  on(loadOrgChart, (state: OrganizationalViewState) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      loading: true,
    },
  })),
  on(loadOrgChartSuccess, (state: OrganizationalViewState, { employees }) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      data: employees,
      loading: false,
    },
  })),
  on(
    loadOrgChartFailure,
    (state: OrganizationalViewState, { errorMessage }) => ({
      ...state,
      errorMessage,
      orgChart: {
        ...state.orgChart,
        errorMessage,
        data: [],
        loading: false,
      },
    })
  ),
  on(loadWorldMap, (state: OrganizationalViewState) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      loading: true,
    },
  })),
  on(loadWorldMapSuccess, (state: OrganizationalViewState, { data }) => ({
    ...state,
    worldMap: {
      ...state.worldMap,
      data,
      loading: false,
    },
  })),
  on(
    loadWorldMapFailure,
    (state: OrganizationalViewState, { errorMessage }) => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        errorMessage,
        data: [],
        loading: false,
      },
    })
  ),
  on(loadParent, (state: OrganizationalViewState) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      loading: true,
    },
  })),
  // result is not saved in store -> loading should not stop as the process of loading the new org chart is still ongoing
  on(loadParentSuccess, (state: OrganizationalViewState) => ({
    ...state,
  })),
  on(loadParentFailure, (state: OrganizationalViewState, { errorMessage }) => ({
    ...state,
    orgChart: {
      ...state.orgChart,
      errorMessage,
      data: [],
      loading: false,
    },
  })),
  on(loadAttritionOverTimeOrgChart, (state: OrganizationalViewState) => ({
    ...state,
    attritionOverTime: {
      ...state.attritionOverTime,
      loading: true,
    },
  })),
  on(
    loadAttritionOverTimeOrgChartSuccess,
    (state: OrganizationalViewState, { data }) => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadAttritionOverTimeOrgChartFailure,
    (state: OrganizationalViewState, { errorMessage }) => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        errorMessage,
        data: undefined,
        loading: false,
      },
    })
  )
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(
  state: OrganizationalViewState,
  action: Action
): OrganizationalViewState {
  return organizationalViewReducer(state, action);
}

export const selectOrganizationalViewState =
  createFeatureSelector<OrganizationalViewState>(organizationalViewFeatureKey);
