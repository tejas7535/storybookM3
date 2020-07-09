import { ReferenceType } from '../../shared/models/index';
import { FilterItem } from './filter-item.model';

export class SearchResult {
  public constructor(
    public filters: FilterItem[],
    public result: ReferenceType[],
    public resultCount: number
  ) {}
}
