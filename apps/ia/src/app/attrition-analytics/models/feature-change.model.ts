import { FeatureParams } from './feature-params.model';

export class FeatureChange {
  constructor(public didChange: boolean, public features: FeatureParams[]) {}
}
