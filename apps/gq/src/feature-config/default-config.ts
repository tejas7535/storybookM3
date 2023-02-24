export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  globalSearch: false,
  approvalWorkflow: false,
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  globalSearch: boolean;
  approvalWorkflow: boolean;
}
