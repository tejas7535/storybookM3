/* eslint-disable max-lines */
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import { ChartType, DimensionFluctuationData } from '../models';
import { OrgChartEmployee } from '../org-chart/models';
import { CountryDataAttrition } from '../world-map/models/country-data-attrition.model';
import {
  chartTypeSelected,
  loadChildAttritionOverTimeOrgChart,
  loadChildAttritionOverTimeOrgChartFailure,
  loadChildAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartEmployees,
  loadOrgChartEmployeesFailure,
  loadOrgChartEmployeesSuccess,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadParent,
  loadParentAttritionOverTimeOrgChart,
  loadParentAttritionOverTimeOrgChartFailure,
  loadParentAttritionOverTimeOrgChartSuccess,
  loadParentFailure,
  loadParentSuccess,
  loadWorldMap,
  loadWorldMapFailure,
  loadWorldMapFluctuationCountryMeta,
  loadWorldMapFluctuationRegionMeta,
  loadWorldMapSuccess,
} from './actions/organizational-view.action';

export const organizationalViewFeatureKey = 'organizationalView';

export interface OrganizationalViewState {
  orgChart: {
    data: DimensionFluctuationData[];
    loading: boolean;
    errorMessage: string;
    employees: {
      data: OrgChartEmployee[];
      loading: boolean;
      errorMessage: string;
    };
  };
  worldMap: {
    selectedRegion: string;
    selectedCountry: string;
    data: CountryDataAttrition[];
    loading: boolean;
    errorMessage: string;
  };
  selectedChart: ChartType;
  attritionOverTime: {
    parent: {
      dimensionName: string;
      data: AttritionOverTime;
      loading: boolean;
      errorMessage: string;
    };
    child: {
      dimensionName: string;
      data: AttritionOverTime;
      loading: boolean;
      errorMessage: string;
    };
  };
}

export const initialState: OrganizationalViewState = {
  orgChart: {
    data: [],
    loading: false,
    errorMessage: undefined,
    employees: {
      data: [],
      loading: false,
      errorMessage: undefined,
    },
  },
  worldMap: {
    selectedRegion: undefined,
    selectedCountry: undefined,
    data: [],
    loading: false,
    errorMessage: undefined,
  },
  selectedChart: ChartType.ORG_CHART,
  attritionOverTime: {
    parent: {
      dimensionName: undefined,
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
    child: {
      dimensionName: undefined,
      data: undefined,
      loading: false,
      errorMessage: undefined,
    },
  },
};

export const organizationalViewReducer = createReducer(
  initialState,
  on(
    chartTypeSelected,
    (
      state: OrganizationalViewState,
      { chartType }
    ): OrganizationalViewState => ({
      ...state,
      selectedChart: chartType,
    })
  ),
  on(
    loadOrgChart,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        data: [],
        loading: true,
      },
    })
  ),
  on(
    loadOrgChartSuccess,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadOrgChartFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        errorMessage,
        data: [],
        loading: false,
      },
    })
  ),
  on(
    loadWorldMapFluctuationRegionMeta,
    (state: OrganizationalViewState, { region }): OrganizationalViewState => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        selectedRegion: region,
        selectedCountry: undefined,
      },
    })
  ),
  on(
    loadWorldMapFluctuationCountryMeta,
    (state: OrganizationalViewState, { country }): OrganizationalViewState => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        selectedRegion: undefined,
        selectedCountry: country,
      },
    })
  ),
  on(
    loadWorldMap,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        loading: true,
      },
    })
  ),
  on(
    loadWorldMapSuccess,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadWorldMapFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      worldMap: {
        ...state.worldMap,
        errorMessage,
        data: [],
        loading: false,
      },
    })
  ),
  on(
    loadParent,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        loading: true,
      },
    })
  ),
  // result is not saved in store -> loading should not stop as the process of loading the new org chart is still ongoing
  on(
    loadParentSuccess,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
    })
  ),
  on(
    loadParentFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        errorMessage,
        data: [],
        loading: false,
      },
    })
  ),
  on(
    loadParentAttritionOverTimeOrgChart,
    (
      state: OrganizationalViewState,
      { dimensionName }
    ): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        parent: {
          ...state.attritionOverTime.parent,
          data: undefined,
          dimensionName,
          loading: true,
        },
      },
    })
  ),
  on(
    loadParentAttritionOverTimeOrgChartSuccess,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        parent: {
          ...state.attritionOverTime.parent,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadParentAttritionOverTimeOrgChartFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        parent: {
          ...state.attritionOverTime.parent,
          errorMessage,
          data: undefined,
          loading: false,
        },
      },
    })
  ),
  on(
    loadChildAttritionOverTimeOrgChart,
    (
      state: OrganizationalViewState,
      { dimensionName }
    ): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        child: {
          ...state.attritionOverTime.child,
          data: undefined,
          dimensionName,
          loading: true,
        },
      },
    })
  ),
  on(
    loadChildAttritionOverTimeOrgChartSuccess,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        child: {
          ...state.attritionOverTime.child,
          data,
          loading: false,
        },
      },
    })
  ),
  on(
    loadChildAttritionOverTimeOrgChartFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        child: {
          ...state.attritionOverTime.child,
          errorMessage,
          data: undefined,
          loading: false,
        },
      },
    })
  ),
  on(
    loadOrgChartEmployees,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        employees: {
          ...state.orgChart.employees,
          loading: true,
        },
      },
    })
  ),
  on(
    loadOrgChartEmployeesSuccess,
    (
      state: OrganizationalViewState,
      { employees }
    ): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        employees: {
          ...state.orgChart.employees,
          loading: false,
          data: employees,
        },
      },
    })
  ),
  on(
    loadOrgChartEmployeesFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        employees: {
          ...state.orgChart.employees,
          loading: false,
          errorMessage,
        },
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
