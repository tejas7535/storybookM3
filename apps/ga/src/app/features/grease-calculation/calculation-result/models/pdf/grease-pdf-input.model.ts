export interface GreasePdfInputTable {
  title: string;
  items: string[][];
}

export interface GreasePdfInput {
  sectionTitle: string;
  tableItems: GreasePdfInputTable[];
}
