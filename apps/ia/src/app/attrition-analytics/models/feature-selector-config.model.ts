import { FeatureSelector } from './feature-selector.model';

export class FeatureSelectorConfig {
  constructor(
    public data: FeatureSelector[],
    public region: string
  ) {}
}
