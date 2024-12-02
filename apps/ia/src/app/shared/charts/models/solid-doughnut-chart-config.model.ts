import { SeriesLabelOption } from 'echarts/types/src/util/types';

export class SolidDoughnutChartConfig {
  constructor(
    public title: string,
    public subTitle?: SeriesLabelOption,
    public legendData?: string[],
    public tooltipFormatter?: string,
    public color?: string[],
    public side?: 'left' | 'right',
    public titleTooltip?: string
  ) {}
}
