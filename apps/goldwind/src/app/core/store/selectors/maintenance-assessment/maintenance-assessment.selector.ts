import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { ChartState } from '../../../../shared/chart/chart.state';
import { DataToChartSeriesConverter } from '../../../../shared/chart/data-to-chart-series-converter';
import { MAINTENACE_ASSESSMENT_CONTROLS } from '../../../../shared/constants/maintenance-assessment-controls';
import { getMaintenanceAssessmentState } from '../../reducers';
import { EdmStatus } from '../../reducers/edm-monitor/models';
import { GcmStatus } from '../../reducers/grease-status/models';
import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import { ShaftStatus } from '../../reducers/shaft/models';
import { Interval } from '../../reducers/shared/models';
import { getGreaseStatusResult } from '..';
import { getEdmResult } from '../edm-monitor/edm-monitor.selector';
import { getShaftResult } from '../shaft/shaft.selector';

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
  getMaintenanceAssessmentInterval,
  (
    gcmStatus: GcmStatus[],
    edm: EdmStatus[],
    shaftStatus: ShaftStatus[],
    display: MaintenanceAssessmentDisplay | any,
    interval: Interval
  ): EChartsOption => {
    const result = gcmStatus && {
      xAxis: {
        min: new Date(interval.startDate * 1000),
        max: new Date(interval.endDate * 1000),
      },
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
