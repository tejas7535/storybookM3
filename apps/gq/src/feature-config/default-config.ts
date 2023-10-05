export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  attachments: false,
  fPricing: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  attachments: boolean;
  fPricing: boolean;
}
