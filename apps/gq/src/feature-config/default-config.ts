export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  customViews: true,
  showEditMaterialButton: false,
};

export interface GqFeatureToggleConfig {
  customViews: boolean;
  showEditMaterialButton: boolean;
}
