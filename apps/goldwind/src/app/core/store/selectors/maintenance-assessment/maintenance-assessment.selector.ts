import { createSelector } from '@ngrx/store';
import { getGreaseStatusResult } from '..';
import { DataToChartSeriesConverter } from '../../../../shared/chart/data-to-chart-series-converter';
import { MAINTENACE_ASSESSMENT_CONTROLS } from '../../../../shared/constants/maintenance-assessment-controls';
import { getMaintenanceAssessmentState } from '../../reducers';
import { GcmStatus } from '../../reducers/grease-status/models';
import { ChartState } from '../../../../shared/chart/chart.state';
import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import { Interval } from '../../reducers/shared/models';
import { EChartsOption } from 'echarts';
import { getEdmResult } from '../edm-monitor/edm-monitor.selector';
import { EdmStatus } from '../../reducers/edm-monitor/models';
import { getShaftResult } from '../shaft/shaft.selector';
import { ShaftStatus } from '../../reducers/shaft/models';

type DisplayOption = [any, boolean];

export const getMaintenanceAssessmentDisplay = createSelector(
  getMaintenanceAssessmentState,
  (state: ChartState<MaintenanceAssessmentDisplay>) => state.display
);

export const getMaintenanceAssessmentInterval = createSelector(
  getMaintenanceAssessmentState,
  (state: ChartState<MaintenanceAssessmentDisplay>): Interval => state.interval
);

export const getAnalysisGraphDataM = createSelector(
  getGreaseStatusResult,
  getEdmResult,
  getShaftResult,
  getMaintenanceAssessmentDisplay,
  (
    gcmStatus: GcmStatus[],
    edm: EdmStatus[],
    shaftStatus: ShaftStatus[],
    display: MaintenanceAssessmentDisplay | any
  ): EChartsOption => {
    const result = gcmStatus && {
      legend: {
        data: Object.entries(display)
          .map(([key, value]) => [key, value] as DisplayOption)
          .filter(([_key, value]: DisplayOption) => value)
          .map(([key, _value]: DisplayOption) => key),
      },
      series: Object.entries(display)
        .map(([key, value]) => [key, value] as DisplayOption)
        .map(([key, value]: DisplayOption) =>
          new DataToChartSeriesConverter(
            key,
            value,
            MAINTENACE_ASSESSMENT_CONTROLS,
            {
              gcmStatus,
              edm,
              shaftStatus,
            }
          ).getData()
        ),
    };

    return result;
  }
);
