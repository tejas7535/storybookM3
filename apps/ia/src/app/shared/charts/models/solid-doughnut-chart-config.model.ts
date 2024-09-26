export class SolidDoughnutChartConfig {
  constructor(
    public title: string,
    public subTitle?: string,
    public legendData?: string[],
    public tooltipFormatter?: string,
    public color?: string[],
    public side?: 'left' | 'right'
  ) {}
}
