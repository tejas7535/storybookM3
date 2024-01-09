export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  fPricing: false,
  sharedQuotation: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  fPricing: boolean;
  sharedQuotation: boolean;
}
