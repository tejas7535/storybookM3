import { SortDirection } from './sort-direction.enum';

export interface Sort {
  property: string;
  direction: SortDirection;
}
