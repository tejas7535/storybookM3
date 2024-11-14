export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  createManualCaseAsView: false,
  sapPriceDiffColumn: false,
  targetPriceSourceColumn: false,
};

export interface GqFeatureToggleConfig {
  editTechnicalValueDriver: boolean;
  createManualCaseAsView: boolean;
  sapPriceDiffColumn: boolean;
  targetPriceSourceColumn: boolean;
}
