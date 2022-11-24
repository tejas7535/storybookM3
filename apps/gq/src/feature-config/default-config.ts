export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  enableFeature1: true,
  enableFeature2: false,
};

export interface GqFeatureToggleConfig {
  enableFeature1: boolean;
  enableFeature2: boolean;
}
