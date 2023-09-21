export const DEFAULT_CONFIG: GqFeatureToggleConfig = {
  approvalWorkflow: false,
  attachments: false,
  fPricing: false,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GqFeatureToggleConfig {
  approvalWorkflow: boolean;
  attachments: boolean;
  fPricing: boolean;
}
