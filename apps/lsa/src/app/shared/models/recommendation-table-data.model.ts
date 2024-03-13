import { Lubricator } from './recommendation-response.model';

export interface RecommendationLubricatorHeaderData {
  isRecommended: boolean;
  productImageUrl: string;
  matNr: string;
  name: string;
  description: string;
}

export interface RecommendationTableRow {
  field: keyof Lubricator;
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
