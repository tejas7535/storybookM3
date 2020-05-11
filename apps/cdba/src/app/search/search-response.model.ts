import {
  FilterItem,
  ReferenceType,
} from '../core/store/reducers/search/models';

export interface SearchResponse {
  possibleFilters: FilterItem[];
  selectedFilters: FilterItem[];
  result: ReferenceType[];
}
