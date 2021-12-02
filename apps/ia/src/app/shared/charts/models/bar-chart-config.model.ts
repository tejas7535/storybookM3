import { BarChartSerie } from './bar-chart-serie.model';

export class BarChartConfig {
  constructor(
    public title: string,
    public series: BarChartSerie[],
    public categories: string[],
    public referenceValue: number,
    public referenceValueText?: string,
    public belowReferenceValueText?: string,
    public aboveReferenceValueText?: string
  ) {}
}
