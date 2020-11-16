import { FilterKey } from './filter-key.enum';
import { IdValue } from './id-value.model';

export class Filter {
  public constructor(public name: FilterKey, public options: IdValue[]) {}
}
