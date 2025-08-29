import { ItemStyleOption } from 'echarts/types/src/util/types';

export class DoughnutChartData {
  public color?: string;
  public percent?: number;

  constructor(
    public value: number,
    public name?: string,
    public itemStyle?: ItemStyleOption,
    color?: string
  ) {
    if (color) {
      this.color = color;
      this.itemStyle = { ...this.itemStyle, color };
    }
  }
}
