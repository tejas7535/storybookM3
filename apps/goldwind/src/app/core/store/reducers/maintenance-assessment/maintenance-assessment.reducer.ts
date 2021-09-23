import { createReducer, on } from '@ngrx/store';
import {
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
} from '../../actions';

import { ChartState } from '../../../../shared/chart/chart.state';
import { MaintenanceAssessmentDisplay } from './maintenance.assessment.model';

export const initialState: ChartState<MaintenanceAssessmentDisplay> = {
  display: {
    deterioration_1: true,
    waterContent_1: true,
    temperatureOptics_1: true,
    deterioration_2: true,
    waterContent_2: true,
    temperatureOptics_2: true,
    rsmShaftSpeed: true,
    edm01Ai01Counter: true,
    edm01Ai02Counter: true,
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
    (
      state: ChartState<MaintenanceAssessmentDisplay>,
      { maintenanceAssessmentDisplay }
    ): ChartState<MaintenanceAssessmentDisplay> => ({
      ...state,
      display: maintenanceAssessmentDisplay,
    })
  ),
  on(
    setMaintenanceAssessmentInterval,
    (
      state: ChartState<MaintenanceAssessmentDisplay>,
      { interval }
    ): ChartState<MaintenanceAssessmentDisplay> => ({
      ...state,
      interval,
    })
  )
);
