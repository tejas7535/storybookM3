import { Description } from './description.model';
import { JsonTable } from './json-table.model';

export interface Subordinate {
  identifier: string;
  title?: string;
  entries?: string[][];
  text?: string[];
  designation?: string;
  value?: string;
  data?: JsonTable;
  abbreviation?: string;
  titleID?: string;
  legal?: string;
  unit?: string;
  description?: Description;
  subordinates?: Subordinate[];
  defaultOpen?: boolean;
  content?: any;
  clickHandler?: any;
}
