import { FilterDimension } from '..';
import { IdValue } from '../id-value.model';
import { FilterKey } from './filter-key.enum';

export class Filter {
  public constructor(
    public name: FilterKey | FilterDimension,
    public options: IdValue[]
  ) {}
}
