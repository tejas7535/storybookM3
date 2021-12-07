import { FilterItem } from './filter-item.model';
import { FilterItemType } from './filter-item-type.enum';

export class FilterItemRangeUpdate extends FilterItem {
  public constructor(
    public name: string,
    public minSelected: number,
    public maxSelected: number
  ) {
    super(name, FilterItemType.RANGE);
  }
}
