export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  fPricing: true,
  editTechnicalValueDriver: false,
  createManualCaseAsView: false,
};

export interface GqFeatureToggleConfig {
  fPricing: boolean;
  editTechnicalValueDriver: boolean;
  createManualCaseAsView: boolean;
}
