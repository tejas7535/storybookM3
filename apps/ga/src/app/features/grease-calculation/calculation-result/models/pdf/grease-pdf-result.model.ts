export interface GreasePdfConcept1Item {
  conceptTitle: string;
  settingArrow: string;
  notes: string;
}

export interface GreasePdfConcept1Result {
  title: string;
  concept60ml: GreasePdfConcept1Item;
  concept125ml: GreasePdfConcept1Item;
}

export interface GreasePdfResultItem {
  itemTitle: string;
  items: string[];
}

export interface GreasePdfResultTable {
  title: string;
  subTitle: string;
  items: GreasePdfResultItem[];
  concept1?: GreasePdfConcept1Result;
}

export interface GreasePdfResult {
  sectionTitle: string;
  tableItems: GreasePdfResultTable[];
}
