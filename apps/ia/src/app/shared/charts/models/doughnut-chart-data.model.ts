import { ItemStyleOption } from 'echarts/types/src/util/types';

export class DoughnutChartData {
  constructor(
    public value: number,
    public name?: string,
    public itemStyle?: ItemStyleOption
  ) {}
}
