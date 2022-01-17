import { EChartsOption, SeriesOption } from 'echarts';

import { MaintenaceSensorData } from '../../core/http/types';
import { EdmStatus } from '../../core/store/reducers/edm-monitor/models';
import { CenterLoadStatus, Control, Type } from '../models';

export class DataToChartSeriesConverter {
  /**
   * a data array to collect all data from the series
   */
  data: any[] = [];
  /**
   *
   * @param key a key to map the reponse object like gcmStatus
   * @param value
   * @param controls the controls to match the data array to series
   * @param dataArr the actuall data collection
   * @returns
   */
  constructor(
    private readonly key: string,
    private readonly value: any,
    private readonly controls: Control[], // LOAD_ASSESSMENT_CONTROLS
    private readonly dataArr: any
  ) {
    if (!this.value || !this.dataArr || this.dataArr.length <= 0) {
      return;
    }
    this.findMethodAndConvert();
  }

  get lineStyle() {
    return {
      color: this.controls.find(({ label }) => label === this.key)?.color,
    };
  }
  /**
   *
   * @returns a object containing series entries
   */
  getData(): SeriesOption {
    return {
      name: this.key,
      type: 'line',
      symbol: 'none',
      data: this.data,
      lineStyle: this.lineStyle,
    };
  }

  /**
   * set the data field to the accourding founds measurements
   */
  findMethodAndConvert() {
    switch (this.controls.find(({ label }) => label === this.key)?.type) {
      case Type.grease:
        this.data = this.convertGrease();
        break;
      case Type.load:
        this.data = this.convertLoad();
        break;
      case Type.rsm:
        this.data = this.convertRSM();
        break;
      case Type.centerload:
        this.data = this.convertCenterLoad();
        break;
      case Type.edm:
        this.data = this.convertEDM();
        break;
      default:
        this.data = [];
    }
  }
  /**
   *
   * @returns centerload data array converted to a series entries format for echarts
   */
  convertCenterLoad(): EChartsOption[] {
    return this.dataArr.map((measurement: any) => ({
      value: [
        new Date(measurement.timestamp),
        (
          measurement[
            this.key
              .replace('centerLoad', '')
              .replace(/(^\w)/g, (m) =>
                m.toLowerCase()
              ) as keyof CenterLoadStatus
          ] as number
        )?.toFixed(2),
      ],
    }));
  }
  convertEDM(): any[] {
    return this.dataArr.map((measurement: MaintenaceSensorData) => ({
      value: [
        new Date(measurement.timestamp),
        measurement?.edm && measurement.edm[this.key as keyof EdmStatus],
      ],
    }));
  }
  /**
   *
   * @returns shaftStatus data array converted to a series entries format for echarts
   */
  convertRSM() {
    return this.dataArr.map((measurement: MaintenaceSensorData) => ({
      value: [
        new Date(measurement.timestamp),
        measurement?.rsmShaft?.rsm01ShaftSpeed?.toFixed(2),
      ],
    }));
  }
  /**
   *
   * @returns bearingload data array converted to a series entries format for echarts
   */
  convertLoad() {
    return this.dataArr.map((measurement: any) => ({
      value: [
        new Date(measurement.timestamp),
        typeof measurement[this.key] === 'number'
          ? measurement[this.key].toFixed(2)
          : 0,
      ],
    }));
  }
  /**
   *
   * @returns gcmStatus data array converted to a series entries format for echarts
   */
  convertGrease() {
    return this.dataArr.map((measurement: MaintenaceSensorData) => {
      if (!measurement.gcm) {
        return { value: [] };
      }
      let measurementValue: number | string;
      if (this.key.endsWith('_1')) {
        measurementValue =
          measurement.gcm[
            `gcm01${this.key.charAt(0).toUpperCase()}${this.key.slice(1, -2)}`
          ];
      } else if (this.key.endsWith('_2')) {
        measurementValue =
          measurement.gcm[
            `gcm02${this.key.charAt(0).toUpperCase()}${this.key.slice(1, -2)}`
          ];
      }

      return measurementValue !== null && measurementValue !== undefined
        ? {
            value: [
              new Date(measurement.timestamp),
              Number(measurementValue).toFixed(2),
            ],
          }
        : { value: [] };
    });
  }
}
