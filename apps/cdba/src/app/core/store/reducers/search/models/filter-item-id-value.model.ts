import { FilterItem } from './filter-item.model';
import { FilterItemType } from './filter-item-type.enum';
import { IdValue } from './id-value.model';

export class FilterItemIdValue extends FilterItem {
  public constructor(
    public name: string,
    public items: IdValue[],
    public autocomplete: boolean,
    public disabled: boolean = false
  ) {
    super(name, FilterItemType.ID_VALUE);
  }
}
