import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AttritionOverTime } from '../../shared/models';
import { ChartType } from '../models/chart-type.enum';
import { DimensionFluctuationData } from '../models/dimension-fluctuation-data.model';
import { OrgUnitFluctuationRate } from '../org-chart/models';
import { CountryData } from '../world-map/models/country-data.model';
import {
  chartTypeSelected,
  loadAttritionOverTimeOrgChart,
  loadAttritionOverTimeOrgChartFailure,
  loadAttritionOverTimeOrgChartSuccess,
  loadOrgChart,
  loadOrgChartFailure,
  loadOrgChartSuccess,
  loadOrgUnitFluctuationMeta,
  loadOrgUnitFluctuationRate,
  loadOrgUnitFluctuationRateFailure,
  loadOrgUnitFluctuationRateSuccess,
  loadParent,
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
    fluctuationRates: {
      selectedEmployeeId: string;
      data: OrgUnitFluctuationRate[];
      loading: boolean;
      errorMessage: string;
    };
  };
  worldMap: {
    selectedRegion: string;
    selectedCountry: string;
    data: CountryData[];
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
    fluctuationRates: {
      selectedEmployeeId: undefined,
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
    data: undefined,
    loading: false,
    errorMessage: undefined,
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
    loadOrgUnitFluctuationMeta,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        fluctuationRates: {
          ...state.orgChart.fluctuationRates,
          loading: false,
          selectedEmployeeId: data.id,
        },
      },
    })
  ),
  on(
    loadOrgUnitFluctuationRate,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        fluctuationRates: {
          ...state.orgChart.fluctuationRates,
          loading: true,
        },
      },
    })
  ),
  on(
    loadOrgUnitFluctuationRateSuccess,
    (state: OrganizationalViewState, { rate }): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        fluctuationRates: {
          ...state.orgChart.fluctuationRates,
          data: [...state.orgChart.fluctuationRates.data, rate],
          loading: false,
        },
      },
    })
  ),
  on(
    loadOrgUnitFluctuationRateFailure,
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
      ...state,
      orgChart: {
        ...state.orgChart,
        fluctuationRates: {
          ...state.orgChart.fluctuationRates,
          errorMessage,
          loading: false,
          selectedEmployeeId: undefined,
        },
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
    loadAttritionOverTimeOrgChart,
    (state: OrganizationalViewState): OrganizationalViewState => ({
      ...state,
      attritionOverTime: {
        ...state.attritionOverTime,
        loading: true,
      },
    })
  ),
  on(
    loadAttritionOverTimeOrgChartSuccess,
    (state: OrganizationalViewState, { data }): OrganizationalViewState => ({
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
    (
      state: OrganizationalViewState,
      { errorMessage }
    ): OrganizationalViewState => ({
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
