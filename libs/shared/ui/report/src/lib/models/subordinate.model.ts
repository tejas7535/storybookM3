import { Description } from './description.model';
import { GreaseResult } from './grease-result.model';
import { JsonTable } from './json-table.model';
import { TitleId } from './title.enum';

export type SubordinateIdentifier =
  | 'text'
  | 'textPairList'
  | 'textBlock'
  | 'block'
  | 'table'
  | 'legalNote'
  | 'variableBlock'
  | 'variableLine'
  | 'greaseResult';

export interface Subordinate {
  identifier: SubordinateIdentifier;
  title?: string;
  entries?: string[][];
  text?: string[];
  designation?: string;
  value?: string;
  data?: JsonTable;
  abbreviation?: string;
  titleID?: `${TitleId}`;
  legal?: string;
  unit?: string;
  description?: Description;
  subordinates?: Subordinate[];
  defaultOpen?: boolean;
  content?: any;
  clickHandler?: any;
  greaseResult?: GreaseResult;
}
