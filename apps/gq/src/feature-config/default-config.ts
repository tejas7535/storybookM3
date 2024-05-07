export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  fPricing: true,
  fPricingComparisonScreen: false,
  editTechnicalValueDriver: false,
  extendedSearchbar: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  fPricing: boolean;
  fPricingComparisonScreen: boolean;
  editTechnicalValueDriver: boolean;
  extendedSearchbar: boolean;
}
