export interface GreasePdfResultItem {
  itemTitle: string;
  items: string[];
}

export interface GreasePdfResultTable {
  title: string;
  subTitle: string;
  items: GreasePdfResultItem[];
}

export interface GreasePdfResult {
  sectionTitle: string;
  tableItems: GreasePdfResultTable[];
}
