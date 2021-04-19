import { ReferenceType } from '@cdba/shared/models';

import { FilterItem } from './filter-item.model';

export class SearchResult {
  public constructor(
    public filters: FilterItem[],
    public result: ReferenceType[],
    public resultCount: number
  ) {}
}
