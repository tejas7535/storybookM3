export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  approvalWorkflow: false,
  targetPrice: true,
};
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  approvalWorkflow: boolean;
  targetPrice: boolean;
}
