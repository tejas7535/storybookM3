import { translate, TranslateParams } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';

import { GaugeColors, GREASE_GAUGE_SERIES } from './chart';
import { IThreshold } from './gauge-config.interface';

export class GaugeEchartConfig {
  private readonly START_ANGLE = 200;
  private readonly GAUGE_RADIUS = '85%';
  private readonly DEFAULT_END_ANGLE = -20;
  private readonly DEFAULT_GAUGE_CENTER = ['50%', '60%'];
  private readonly HIDE_ELEMENTS_IN_TRESHOLD_TICK = {
    pointer: {
      show: false,
    },
    detail: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    progress: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  };
  private readonly AXIS_TICK_LABEL_COLOR = 'rgba(0,0,0,0.68)';
  private readonly AXIS_TICK_LABEL_FONTSIZE = 12;
  private readonly AXIS_TICK_LABEL_DISTANCE = -45;
  private readonly GAUGE_COMMON = {
    center: this.DEFAULT_GAUGE_CENTER,
    radius: this.GAUGE_RADIUS,
    startAngle: this.START_ANGLE,
    endAngle: this.DEFAULT_END_ANGLE,
    type: 'gauge',
    anchor: {
      show: false,
    },
    pointer: {
      show: false,
    },
  };
  private readonly INNER_PROGRESS_RADIUS = '75%';
  private readonly INNER_PROGRESS_WIDTH = 18;
  private readonly OUTER_THRESHOLD_BAR_WIDTH = 4;

  private readonly GAUGE_MAX_VALUE: number;
  private readonly GAUGE_MIN_VALUE: number;
  private readonly thresholds: IThreshold[];
  private readonly value: number;
  private readonly REVERSE: boolean;
  private readonly name: TranslateParams;
  private readonly unit: string;

  /**
   *
   */
  constructor(config: {
    value: number;
    unit?: string;
    min: number;
    max: number;
    name: string;
    thresholds: IThreshold[];
    reverse?: boolean;
  }) {
    this.value = config.value;
    this.unit = config.unit || '';
    this.name = config.name;
    this.thresholds = config.thresholds;
    this.GAUGE_MAX_VALUE = config.max;
    this.GAUGE_MIN_VALUE = config.min;
    this.REVERSE = config.reverse;
  }
  /**
   *
   * @returns a object containing a series property with all needed series for the current gauge implementation
   */
  public extandedSeries(): EChartsOption {
    return {
      series: [
        ...this.thresholds.map((threshold_value) =>
          this.getAxisThresholdTickSeries(threshold_value.value)
        ),
        this.getOuterThresholdBarSeries(),
        this.getInnerProgress(),
      ],
    };
  }
  /**
   * Creates a minimum gauge which only holds a tick placed on the given treshold
   * @param value the state value use to calculate the endangle
   * @returns an series object
   */
  private getAxisThresholdTickSeries(value: number): any {
    // angle sum - max value = how many percent per degree
    const per_angle_factor =
      (this.START_ANGLE - this.DEFAULT_END_ANGLE) / this.GAUGE_MAX_VALUE;
    const getCalculatedPartialEndAngle = !this.REVERSE
      ? this.START_ANGLE - per_angle_factor * value
      : this.DEFAULT_END_ANGLE + per_angle_factor * value;

    return {
      ...this.HIDE_ELEMENTS_IN_TRESHOLD_TICK,
      ...this.GAUGE_COMMON,
      axisLabel: {
        distance: this.AXIS_TICK_LABEL_DISTANCE,
        color: this.AXIS_TICK_LABEL_COLOR,
        fontSize: this.AXIS_TICK_LABEL_FONTSIZE,
        fontFamily: 'Roboto',
      },
      endAngle: getCalculatedPartialEndAngle,
      min: this.REVERSE ? this.GAUGE_MAX_VALUE : this.GAUGE_MIN_VALUE,
      max: value,
      splitLine: {
        show: false,
      },
      splitNumber: 1,
      top: 0,
    };
  }
  /**
   * Creates an series object with a dynamic colored progressbar
   * a bit shifted to the inner side
   * @returns the inner progress ring as series.
   */
  private getInnerProgress(): any {
    return {
      // inside,
      ...GREASE_GAUGE_SERIES,
      ...this.GAUGE_COMMON,
      radius: this.INNER_PROGRESS_RADIUS,
      splitNumber: 1,
      title: {
        show: false,
      },
      progress: {
        itemStyle: {
          color: this.getProgressColor(),
        },
        width: this.INNER_PROGRESS_WIDTH,
        show: true,
      },
      silent: true,
      axisLabel: {
        show: false,
      },
      name: translate(this.name),
      min: this.REVERSE ? this.GAUGE_MAX_VALUE : this.GAUGE_MIN_VALUE,
      max: this.REVERSE ? this.GAUGE_MIN_VALUE : this.GAUGE_MAX_VALUE,
      data: [
        {
          value: this.value?.toFixed(1),
          name: translate(this.name),
        },
      ],
      detail: {
        offsetCenter: [0, 0],
        fontWeight: '500',
        fontSize: 20,
        color: 'rgba(0,0,0,0.91)',
        formatter: (v: any) => {
          if (Number.isNaN(v)) {
            return translate('app.no_data');
          }

          return `${v.toFixed(1).toString().replace('.', ',')} ${this.unit}`;
        },
      },
      axisLine: {
        lineStyle: {
          width: this.INNER_PROGRESS_WIDTH,
          color: [[1, GaugeColors.GREY]], // fill with neutral background color
        },
      },
    };
  }
  /**
   * Creates an outline colored with the given threshold and color level
   * @returns the outer threshold bar as series object
   */
  private getOuterThresholdBarSeries(): any {
    return {
      ...GREASE_GAUGE_SERIES,
      ...this.GAUGE_COMMON,
      splitNumber: 0,
      axisLabel: {
        show: false,
      },
      title: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          ...GREASE_GAUGE_SERIES.axisLine.lineStyle,
          width: this.OUTER_THRESHOLD_BAR_WIDTH,
          color: this.thresholds.map((threshold) => [
            this.getPercentOfValue(threshold),
            threshold.color,
          ]),
        },
      },

      progress: {
        show: false,
      },
      // setting min value to max state value to its inverted on display
      max: this.REVERSE ? this.GAUGE_MAX_VALUE : this.GAUGE_MIN_VALUE,
      min: this.REVERSE ? this.GAUGE_MIN_VALUE : this.GAUGE_MAX_VALUE,
      data: [{ value: 0 }], // dont need value because its only used for coloring the threshold bars
      detail: {
        show: false,
      },
    };
  }
  private getPercentOfValue(threshold: IThreshold): number {
    return this.REVERSE
      ? Math.abs(1 - threshold.value / this.GAUGE_MAX_VALUE)
      : Math.abs(threshold.value / this.GAUGE_MAX_VALUE);
  }

  /**
   * Helper function the return the correct color for a state value
   * @returns a color for the progressbar
   */
  private getProgressColor(): string {
    return (
      this.thresholds.find((threshold) =>
        this.REVERSE
          ? threshold.value <= this.value
          : threshold.value >= this.value
      )?.color || GaugeColors.GREEN
    );
  }
}
