import { FilterItemType } from './filter-item-type.enum';
import { FilterItem } from './filter-item.model';

export class FilterItemRange extends FilterItem {
  public constructor(
    public name: string,
    public min: number,
    public max: number,
    public minSelected?: number,
    public maxSelected?: number,
    public unit?: string
  ) {
    super(name, FilterItemType.RANGE);
  }
}
