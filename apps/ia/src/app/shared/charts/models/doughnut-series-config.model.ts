import { DoughnutChartData } from './doughnut-chart-data.model';

export class DoughnutSeriesConfig {
  public constructor(
    public data: DoughnutChartData[],
    public title: string,
    public color: string,
    public subTitle?: string
  ) {}
}
