import { Field } from './title.enum';

export interface TableItem {
  value?: string | null | number;
  unit?: string;
  field?: `${Field}`;
}
