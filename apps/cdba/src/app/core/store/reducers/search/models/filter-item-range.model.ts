import { FilterItem } from './filter-item.model';
import { FilterItemType } from './filter-item-type.enum';

export class FilterItemRange extends FilterItem {
  public constructor(
    public name: string,
    public min: number,
    public max: number,
    public minSelected: number,
    public maxSelected: number,
    public unit: string,
    public disabled: boolean
  ) {
    super(name, FilterItemType.RANGE);
  }
}
