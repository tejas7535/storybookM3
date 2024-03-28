import { FilterItemType } from './filter-item-type.enum';

export abstract class FilterItem {
  public constructor(
    public name: string,
    public type: FilterItemType
  ) {}
}
