export interface ExtendedSearchParameters {
  [index: string]: number | string;
  pattern: string;
  bearingType: string;
  minDi: number;
  maxDi: number;
  minDa: number;
  maxDa: number;
  minB: number;
  maxB: number;
}
