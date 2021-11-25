import { createSelector } from '@ngrx/store';

import { DataToChartSeriesConverter } from '../../../../shared/chart/data-to-chart-series-converter';
import { LOAD_ASSESSMENT_CONTROLS } from '../../../../shared/constants';
import { CenterLoadStatus } from '../../../../shared/models';
import { getLoadAssessmentState } from '../../reducers';
import { LoadAssessmentState } from '../../reducers/load-assessment/load-assessment.reducer';
import { getCenterLoadResult } from '../../selectors/center-load/center-load.selector';
import { LoadAssessmentDisplay } from '../../reducers/load-assessment/models';
import { LoadSense } from '../../reducers/load-sense/models';
import { Interval } from '../../reducers/shared/models';
import { getBearingLoadResult } from '../load-sense/load-sense.selector';
import { EChartsOption } from 'echarts';
type GreaseDisplayKeys = keyof LoadAssessmentDisplay;
type DisplayOption = [GreaseDisplayKeys, boolean];

export const getLoadAssessmentDisplay = createSelector(
  getLoadAssessmentState,
  (state: LoadAssessmentState) => state.display
);

export const getLoadAssessmentInterval = createSelector(
  getLoadAssessmentState,
  (state: LoadAssessmentState): Interval => state.interval
);

export const getAnalysisGraphData = createSelector(
  getBearingLoadResult,
  getCenterLoadResult,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
  (
    bearingLoad: LoadSense[],
    centerLoad: CenterLoadStatus[],
    display: LoadAssessmentDisplay,
    _interval: Interval
  ): EChartsOption => {
    const result: EChartsOption = {
      xAxis: {
        min: new Date(_interval.startDate * 1000),
        max: new Date(_interval.endDate * 1000),
      },
      legend: {
        data: Object.entries(display)
          .map(([key, value]) => [key, value] as DisplayOption)
          .filter(([_key, value]: DisplayOption) => value)
          .map(([key, _value]: DisplayOption) => key),
      },
      dataZoom: [
        {
          filterMode: 'none',
          type: 'inside',
        },
        {
          bottom: '10%',
          startValue: _interval.pristineStart * 1000,
          endValue: _interval.pristineEnd * 1000,
        }, // for slider zoom
      ],
      series: Object.entries(display)
        .map(([key, value]) => [key, value] as DisplayOption)
        .map(([key, value]: DisplayOption) =>
          new DataToChartSeriesConverter(key, value, LOAD_ASSESSMENT_CONTROLS, {
            bearingLoad,
            centerLoad,
          }).getData()
        ),
    };

    return result;
  }
);
