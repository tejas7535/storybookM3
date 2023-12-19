export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  fPricing: false,
  refreshRfqData: true,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  fPricing: boolean;
  refreshRfqData: boolean;
}
