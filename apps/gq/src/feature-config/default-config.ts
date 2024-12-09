export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  createManualCaseAsView: false,
  createCustomerCaseAsView: false,
  sapPriceDiffColumn: false,
  targetPriceSourceColumn: false,
};

export interface GqFeatureToggleConfig {
  editTechnicalValueDriver: boolean;
  createManualCaseAsView: boolean;
  createCustomerCaseAsView: boolean;
  sapPriceDiffColumn: boolean;
  targetPriceSourceColumn: boolean;
}
