import { StringOption } from '@schaeffler/inputs';

import { FilterItem } from './filter-item.model';
import { FilterItemType } from './filter-item-type.enum';

export class FilterItemIdValue extends FilterItem {
  public constructor(
    public name: string,
    public items: StringOption[],
    public selectedItems: StringOption[],
    public autocomplete: boolean,
    public autocompleteLoading: boolean,
    public disabled: boolean = false
  ) {
    super(name, FilterItemType.ID_VALUE);
  }
}
