import { MultiUnitValue } from './recommendation-response.model';

export interface RecommendationLubricatorHeaderData {
  isRecommended: boolean;
  productImageUrl: string;
  matNr: string;
  name: string;
  description: string;
  pimId: string;
}

export interface RecommendationTableRow {
  field: string;
  minimum?: string | MultiUnitValue;
  recommended?: string | MultiUnitValue;
  converted?: boolean;
}

export interface RecommendationTableData {
  headers: {
    recommended?: RecommendationLubricatorHeaderData;
    minimum?: RecommendationLubricatorHeaderData;
  };
  rows: RecommendationTableRow[];
}
