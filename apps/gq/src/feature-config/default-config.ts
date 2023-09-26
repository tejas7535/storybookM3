export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  approvalWorkflow: true,
  attachments: false,
  fPricing: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  approvalWorkflow: boolean;
  attachments: boolean;
  fPricing: boolean;
}
