import { FilterItemType } from './filter-item-type.enum';
import { FilterItem } from './filter-item.model';

export class FilterItemRangeUpdate extends FilterItem {
  public constructor(
    public name: string,
    public minSelected: number,
    public maxSelected: number
  ) {
    super(name, FilterItemType.RANGE);
  }
}
