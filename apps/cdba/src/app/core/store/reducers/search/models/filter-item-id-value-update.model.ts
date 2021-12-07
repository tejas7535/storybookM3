import { FilterItem } from './filter-item.model';
import { FilterItemType } from './filter-item-type.enum';

export class FilterItemIdValueUpdate extends FilterItem {
  public constructor(public name: string, public ids: string[]) {
    super(name, FilterItemType.ID_VALUE);
  }
}
