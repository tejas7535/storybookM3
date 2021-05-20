import { DoughnutSeriesConfig } from './doughnut-series-config.model';

export class DoughnutConfig {
  public constructor(
    public name: string,
    public series: DoughnutSeriesConfig[],
    public legend?: string[]
  ) {}
}
