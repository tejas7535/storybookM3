export interface MaterialComparisonResponse {
  items: MaterialComparison[];
}

export interface MaterialComparisonInformation {
  materials: MaterialComparison[];
  referenceMaterial: string;
  materialToCompare: string;
}

export interface MaterialComparison {
  materialNumber13: string;
  [key: string]: string | number | KeyValuePairs[] | any;
}

interface KeyValuePairs {
  [key: string]: string | number;
}
