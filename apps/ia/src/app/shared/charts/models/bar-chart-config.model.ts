import { BarChartSerie } from './bar-chart-serie.model';
import { ReferenceValue } from './reference-value.model';

export class BarChartConfig {
  constructor(
    public title: string,
    public subtitle: string | undefined,
    public series: BarChartSerie[],
    public categories: string[],
    public referenceValue: ReferenceValue,
    public xAxisSize?: number,
    public comment?: string
  ) {}
}
