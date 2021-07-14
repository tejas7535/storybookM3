import { translate, TranslateParams } from '@ngneat/transloco';
import { EChartsOption } from 'echarts';
import { GaugeColors, GREASE_GAUGE_SERIES } from './chart';
import { IThreshold } from './gauge-config.interface';

export class GaugeEchartConfig {
  private readonly START_ANGLE = 200;
  private readonly GAUGE_RADIUS = '80%';
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
  private readonly AXIS_TICK_LABEL_COLOR = '#999';
  private readonly AXIS_TICK_LABEL_FONTSIZE = 8;
  private readonly AXIS_TICK_LABEL_DISTANCE = -35;
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
  private readonly INNER_PROGRESS_RADIUS = '74%';
  private readonly INNER_PROGRESS_OFFSET = ['0', '-130%'];
  private readonly INNER_PROGRESS_FONTWEIGHT = 'lighter';
  private readonly INNER_PROGRESS_WIDTH = 14;
  private readonly OUTER_THRESHOLD_BAR_WIDTH = 4;

  private readonly GAUGE_MAX_VALUE: number;
  private readonly GAUGE_MIN_VALUE: number;
  private readonly thresholds: IThreshold[];
  private readonly value: number;
  private readonly DIRECTION = 1;
  private readonly name: TranslateParams;

  /**
   *
   */
  constructor(
    value: number,
    min: number,
    max: number,
    name: string,
    thresholds: IThreshold[]
  ) {
    this.value = value;
    this.name = name;
    this.thresholds = thresholds;
    this.GAUGE_MAX_VALUE = max;
    this.GAUGE_MIN_VALUE = min;
  }
  /**
   *
   * @returns a object containing a series property with all needed series for the current gauge implementation
   */
  public extandedSeries(): EChartsOption {
    return {
      series: [
        ...this.thresholds.map((threshold_value) =>
          this.getAxisThresholdTick(threshold_value.value)
        ),
        this.getOuterThresholdBar(),
        this.getInnerProgress(),
      ],
    };
  }
  /**
   * Creates a minimum gauge which only holds a tick placed on the given treshold
   * @param value the state value use to calculate the endangle
   * @returns an series object
   */
  private getAxisThresholdTick(value: number): any {
    const per_angle_factor =
      (this.START_ANGLE - this.DEFAULT_END_ANGLE) / this.GAUGE_MAX_VALUE;
    const getCalculatedPartialEndAngle =
      this.DEFAULT_END_ANGLE + per_angle_factor * value;

    return {
      ...this.HIDE_ELEMENTS_IN_TRESHOLD_TICK,
      ...this.GAUGE_COMMON,

      axisLabel: {
        distance: this.AXIS_TICK_LABEL_DISTANCE,
        color: this.AXIS_TICK_LABEL_COLOR,
        fontSize: this.AXIS_TICK_LABEL_FONTSIZE,
        formatter: (v: any) => v.toFixed(1).toString().replace('.', ','),
      },
      /**
       *
       */
      endAngle: getCalculatedPartialEndAngle,
      min: this.GAUGE_MAX_VALUE,
      max: value,
      splitLine: {
        show: false,
      },
      splitNumber: 1,
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
        show: true,
        offsetCenter: this.INNER_PROGRESS_OFFSET,
        fontWeight: this.INNER_PROGRESS_FONTWEIGHT,
      },
      progress: {
        itemStyle: {
          color: this.getProgressColor(),
        },
        width: this.INNER_PROGRESS_WIDTH,
        show: true,
      },
      axisLabel: {
        show: false,
      },
      name: translate(this.name),
      min: this.GAUGE_MAX_VALUE,
      max: this.GAUGE_MIN_VALUE,
      data: [
        {
          value: this.value.toFixed(1),
          name: translate(this.name),
        },
      ],
      detail: {
        offsetCenter: [0, 0],
        fontWeight: 'normal',
        fontSize: this.INNER_PROGRESS_WIDTH,
        formatter: (v: any) => v.toFixed(1).toString().replace('.', ','),
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
  private getOuterThresholdBar(): any {
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
            Math.abs(this.DIRECTION - threshold.value / this.GAUGE_MAX_VALUE),
            threshold.color,
          ]),
        },
      },

      progress: {
        show: false,
      },
      min: this.GAUGE_MIN_VALUE, // setting min value to max state value to its inverted on display
      max: this.GAUGE_MAX_VALUE,
      data: [{ value: 0 }], // dont need value because its only used for coloring the threshold bars
      detail: {
        show: false,
      },
    };
  }
  /**
   * Helper function the return the correct color for a state value
   * @returns a color for the progressbar
   */
  private getProgressColor(): string {
    return this.thresholds.find((threshold) => threshold.value <= this.value)
      .color;
  }
}
