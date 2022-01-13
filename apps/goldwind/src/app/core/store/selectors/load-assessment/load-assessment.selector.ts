import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { DataToChartSeriesConverter } from '../../../../shared/chart/data-to-chart-series-converter';
import { LOAD_ASSESSMENT_CONTROLS } from '../../../../shared/constants';
import { getLoadAssessmentState } from '../../reducers';
import { LoadAssessmentState } from '../../reducers/load-assessment/load-assessment.reducer';
import { LoadAssessmentDisplay } from '../../reducers/load-assessment/models';
import { Interval } from '../../reducers/shared/models';
import { LoadAssessmentData } from '../../../http/rest.service';

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

export const selectLoadAssessmentResult = createSelector(
  getLoadAssessmentState,
  (state: LoadAssessmentState) => state.result
);

export const getAnalysisGraphData = createSelector(
  selectLoadAssessmentResult,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
  (
    loadAssessment: LoadAssessmentData[],
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
          new DataToChartSeriesConverter(
            key,
            value,
            LOAD_ASSESSMENT_CONTROLS,
            loadAssessment
          ).getData()
        ),
    };

    return result;
  }
);
