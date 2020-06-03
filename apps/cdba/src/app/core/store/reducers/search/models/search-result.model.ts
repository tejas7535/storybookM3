import { FilterItem } from './filter-item.model';
import { ReferenceType } from './reference-type.model';

export class SearchResult {
  public constructor(
    public filters: FilterItem[],
    public result: ReferenceType[]
  ) {}
}
