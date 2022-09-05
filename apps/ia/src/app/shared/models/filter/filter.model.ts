import { FilterDimension } from '..';
import { IdValue } from '../id-value.model';

export class Filter {
  public constructor(public name: FilterDimension, public options: IdValue[]) {}
}
