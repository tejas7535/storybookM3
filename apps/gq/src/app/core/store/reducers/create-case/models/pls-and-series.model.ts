import { ProductLine } from './product-line.model';

export class PLsAndSeries {
  pls: ProductLine[];
  series: { value: string; selected: boolean }[];
  gpsdGroupIds: { value: string; selected: boolean }[];
}
