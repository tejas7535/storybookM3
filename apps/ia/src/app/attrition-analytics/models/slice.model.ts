import { Pageable } from './pageable.model';

export interface Slice<T> {
  content: T[];
  hasNext: boolean;
  hasPrevious: boolean;
  pageable: Pageable;
}
