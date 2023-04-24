export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  approvalWorkflow: false,
  targetPrice: false,
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  approvalWorkflow: boolean;
  targetPrice: boolean;
}
