export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  fPricing: true,
  editTechnicalValueDriver: false,
  extendedSearchbar: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  fPricing: boolean;
  editTechnicalValueDriver: boolean;
  extendedSearchbar: boolean;
}
