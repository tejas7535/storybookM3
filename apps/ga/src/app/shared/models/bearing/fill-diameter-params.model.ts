import { ExtendedSearchParameters } from './extended-search-parameters.model';

export interface FillDiameterParams {
  parameters: ExtendedSearchParameters;
  key: string;
  potentiallyEmpty: number | undefined;
  reference: number | undefined;
}
