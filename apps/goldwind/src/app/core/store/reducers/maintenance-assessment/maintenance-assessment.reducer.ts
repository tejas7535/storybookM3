import { createReducer, on } from '@ngrx/store';
import {
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
} from '../../actions';

import { ChartState } from '../../../../shared/chart/chart.state';

export const initialState: ChartState = {
  display: {
    deterioration_1: true,
    waterContent_1: true,
    temperatureOptics_1: true,
    deterioration_2: true,
    waterContent_2: true,
    temperatureOptics_2: true,
    rsmShaftSpeed: true,
  },
  interval: {
    startDate: Math.floor(+new Date().setDate(new Date().getDate() - 1) / 1000),
    endDate: Math.floor(Date.now() / 1000),
  },
};

export const maintenanceAssessmentReducer = createReducer(
  initialState,

  on(
    setMaintenanceAssessmentDisplay,
    (state: ChartState, { maintenanceAssessmentDisplay }): ChartState => ({
      ...state,
      display: maintenanceAssessmentDisplay,
    })
  ),
  on(
    setMaintenanceAssessmentInterval,
    (state: ChartState, { interval }): ChartState => ({
      ...state,
      interval,
    })
  )
);
