import { TailwindColor } from '../../models/taliwind-color.enum';

export class ChartLegendItem {
  public constructor(
    public title: string,
    public color: TailwindColor,
    public tooltip: string
  ) {}
}
