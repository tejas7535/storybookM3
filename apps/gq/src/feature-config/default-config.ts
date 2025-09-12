export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  editTechnicalValueDriver: false,
  sapPriceDiffColumn: false,
  displaySqvChecks: false,
  rfqItemsTab: true,
  findCalculatorsPlantMock: false,
  findCalculatorsManagerMock: false,
  findCalculatorsNotFoundMock: false,
  calculatorOverview: true,
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
