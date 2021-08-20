import { BarChartSerie } from './bar-chart-serie.model';

export class BarChartConfig {
  constructor(
    public title: string,
    public series: BarChartSerie[],
    public categories: string[],
    public average: number,
    public belowAverageText: string,
    public aboveAverageText: string
  ) {}
}
