import { TableItem } from './table-item.model';

export interface JsonTable {
  originalFields?: string[];
  fields: string[];
  unitFields: (null | undefined | { unit: string })[];
  items: TableItem[][];
}
