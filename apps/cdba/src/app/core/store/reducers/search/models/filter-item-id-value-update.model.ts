import { FilterItemType } from './filter-item-type.enum';
import { FilterItem } from './filter-item.model';

export class FilterItemIdValueUpdate extends FilterItem {
  public constructor(public name: string, public ids: string[]) {
    super(name, FilterItemType.ID_VALUE);
  }
}
