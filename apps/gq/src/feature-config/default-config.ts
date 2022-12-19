export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  customViews: false,
  showEditMaterialButton: false,
};

export interface GqFeatureToggleConfig {
  customViews: boolean;
  showEditMaterialButton: boolean;
}
