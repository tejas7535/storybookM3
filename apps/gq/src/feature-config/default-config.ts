export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  createManualCaseAsView: true,
  createCustomerCaseAsView: true,
  sapPriceDiffColumn: true,
  targetPriceSourceColumn: true,
  displaySqvChecks: false,
  openItemsTab: false,
};

export interface GqFeatureToggleConfig {
  editTechnicalValueDriver: boolean;
  createManualCaseAsView: boolean;
  createCustomerCaseAsView: boolean;
  sapPriceDiffColumn: boolean;
  targetPriceSourceColumn: boolean;
  displaySqvChecks: boolean;
  openItemsTab: boolean;
}
