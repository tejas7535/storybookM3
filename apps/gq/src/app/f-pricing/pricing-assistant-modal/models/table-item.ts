export interface TableItem {
  // identifier for the row
  id: number;
  // the text of the label that describes the content
  description: string;
  // the display value
  value: number | string;
  // column the change a value, optional second column value
  editableValue?: number;
  // unit of the editable value
  editableValueUnit?: string;
  // optional column for additional description
  additionalDescription?: string;
}
