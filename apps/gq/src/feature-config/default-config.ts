export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  customViews: true,
  showEditMaterialButton: true,
};

export interface GqFeatureToggleConfig {
  customViews: boolean;
  showEditMaterialButton: boolean;
}
