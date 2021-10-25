import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromBearing from './bearing/bearing.reducer';
import * as fromDataView from './data-view/data-view.reducer';
import * as fromDevices from './devices/devices.reducer';
import * as fromEdmMonitor from './edm-monitor/edm-monitor.reducer';
import * as fromEdmHistogram from './edm-monitor/edm-histogram.reducer';
import * as fromGreaseStatus from './grease-status/grease-status.reducer';
import * as fromGreaseHeatmapStatus from './grease-status/heatmap.reducer';
import * as fromLoadAssement from './load-assessment/load-assessment.reducer';
import * as fromLoadDistribution from './load-distribution/load-distribution.reducer';
import * as fromLoadSense from './load-sense/load-sense.reducer';
import * as fromCenterLoad from './center-load/center-load.reducer';
import * as fromShaft from './shaft/shaft.reducer';
import * as fromStaticSafety from './static-safety/static-safety.reducer';
import { ChartState } from '../../../shared/chart/chart.state';
import { MaintenanceAssessmentDisplay } from './maintenance-assessment/maintenance.assessment.model';
import { EdmHistogramState } from './edm-monitor/edm-histogram.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState =
  createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>(
    'router'
  );

export const getBearingState =
  createFeatureSelector<fromBearing.BearingState>('bearing');

export const getBearingLoadState =
  createFeatureSelector<fromLoadSense.BearingLoadState>('loadSense');

export const getLoadDistributionState =
  createFeatureSelector<fromLoadDistribution.LoadDistributionState>(
    'loadDistribution'
  );

export const getDataViewState =
  createFeatureSelector<fromDataView.DataViewState>('dataView');

export const getDevicesState =
  createFeatureSelector<fromDevices.DevicesState>('devices');

export const getEdmMonitorState =
  createFeatureSelector<fromEdmMonitor.EdmMonitorState>('edmMonitor');
export const getEdmHistogramState =
  createFeatureSelector<fromEdmHistogram.EdmHistogramState>('edmHistogram');

export const getGreaseStatusState =
  createFeatureSelector<fromGreaseStatus.GreaseStatusState>('greaseStatus');
export const getGreaseHeatmapStatusState =
  createFeatureSelector<fromGreaseHeatmapStatus.GreaseHeatmapState>(
    'greaseHeatmapStatus'
  );

export const getLoadAssessmentState =
  createFeatureSelector<fromLoadAssement.LoadAssessmentState>('loadAssessment');

export const getMaintenanceAssessmentState = createFeatureSelector<
  ChartState<MaintenanceAssessmentDisplay>
>('maintenanceAssessment');

export const getShaftState =
  createFeatureSelector<fromShaft.ShaftState>('shaft');

export const getCenterLoadState =
  createFeatureSelector<fromCenterLoad.CenterLoadState>('center-load');

export const getStaticSafetyState =
  createFeatureSelector<fromStaticSafety.StaticSafetyState>('staticSafety');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl>
{
  /**
   * Serialize the router state
   */
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
