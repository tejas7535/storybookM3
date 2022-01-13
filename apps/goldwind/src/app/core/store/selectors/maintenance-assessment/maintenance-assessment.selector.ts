import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { ChartState } from '../../../../shared/chart/chart.state';
import { DataToChartSeriesConverter } from '../../../../shared/chart/data-to-chart-series-converter';
import { MAINTENACE_ASSESSMENT_CONTROLS } from '../../../../shared/constants/maintenance-assessment-controls';
import { getMaintenanceAssessmentState } from '../../reducers';
import { MaintenanceAssessmentDisplay } from '../../reducers/maintenance-assessment/maintenance.assessment.model';
import { Interval } from '../../reducers/shared/models';
import { MaintenaceSensorData } from '../../../http/types';

type DisplayOption = [any, boolean];

export const getMaintenanceAssessmentDisplay = createSelector(
  getMaintenanceAssessmentState,
  (state: ChartState<MaintenanceAssessmentDisplay>) => state.display
);

export const getMaintenanceAssessmentData = createSelector(
  getMaintenanceAssessmentState,
  (state: ChartState<MaintenanceAssessmentDisplay>) => state.result
);

export const getMaintenanceAssessmentInterval = createSelector(
  getMaintenanceAssessmentState,
  (state: ChartState<MaintenanceAssessmentDisplay>): Interval => state.interval
);

export const getAnalysisGraphDataM = createSelector(
  getMaintenanceAssessmentData,
  getMaintenanceAssessmentDisplay,
  getMaintenanceAssessmentInterval,
  (
    mData: MaintenaceSensorData[],
    display: MaintenanceAssessmentDisplay | any,
    interval: Interval
  ): EChartsOption => {
    const result = mData && {
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
            mData
          ).getData()
        ),
    };

    return result;
  }
);
