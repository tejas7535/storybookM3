export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  sapPriceDiffColumn: false,
  displaySqvChecks: false,
  rfqItemsTab: false,
  findCalculatorsPlantMock: false,
  findCalculatorsManagerMock: false,
  findCalculatorsNotFoundMock: false,
  calculatorOverview: false,
};

export interface GqFeatureToggleConfig {
  editTechnicalValueDriver: boolean;
  sapPriceDiffColumn: boolean;
  displaySqvChecks: boolean;
  rfqItemsTab: boolean;
  findCalculatorsPlantMock: boolean;
  findCalculatorsManagerMock: boolean;
  findCalculatorsNotFoundMock: boolean;
  calculatorOverview: boolean;
}
