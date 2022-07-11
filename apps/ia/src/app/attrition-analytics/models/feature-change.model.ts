import { FeatureParams } from './feature-params.model';

export interface FeatureChange {
  didChange: boolean;
  features: FeatureParams[];
  selectedRegion: string;
}
