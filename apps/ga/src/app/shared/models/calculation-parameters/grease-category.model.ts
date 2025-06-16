export interface GreaseCategory {
  name: string;
  type?: string;
}

export interface GreaseCategoryEntry {
  text: string;
  id: string;
}

export interface GreaseCategoryWithEntries extends GreaseCategory {
  entries: GreaseCategoryEntry[];
}
