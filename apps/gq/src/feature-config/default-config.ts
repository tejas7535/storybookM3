export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  sapPriceDiffColumn: false,
  displaySqvChecks: false,
  openItemsTab: false,
  findCalculatorsPlantMock: false,
  findCalculatorsManagerMock: false,
  findCalculatorsNotFoundMock: false,
  calculatorOverview: false,
};

export interface GqFeatureToggleConfig {
  editTechnicalValueDriver: boolean;
  sapPriceDiffColumn: boolean;
  displaySqvChecks: boolean;
  openItemsTab: boolean;
  findCalculatorsPlantMock: boolean;
  findCalculatorsManagerMock: boolean;
  findCalculatorsNotFoundMock: boolean;
  calculatorOverview: boolean;
}
