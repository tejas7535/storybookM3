import { Description } from './description.model';

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
  abbreviation?: string;
  legal?: string;
  unit?: string;
  description?: Description;
  subordinates?: Subordinate[];
  defaultOpen?: boolean;
  content?: any;
  clickHandler?: any;
}
