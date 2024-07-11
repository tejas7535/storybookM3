export interface RecommendationLubricatorHeaderData {
  isRecommended: boolean;
  productImageUrl: string;
  matNr: string;
  name: string;
  description: string;
}

export interface RecommendationTableRow {
  field: string;
  minimum?: string;
  recommended?: string;
}

export interface RecommendationTableData {
  headers: {
    recommended?: RecommendationLubricatorHeaderData;
    minimum?: RecommendationLubricatorHeaderData;
  };
  rows: RecommendationTableRow[];
}
