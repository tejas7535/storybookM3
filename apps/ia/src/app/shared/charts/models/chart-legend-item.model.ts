import { TailwindColor } from '../../models';

export class ChartLegendItem {
  constructor(
    public name: string,
    public color: string | TailwindColor,
    public tooltip: string,
    public selected?: boolean
  ) {}
}
