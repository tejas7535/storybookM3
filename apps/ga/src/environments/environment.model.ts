export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  baseUrl: string;
  staticStorageUrl: string;
  internalDetectionUrl: string;
  tenantId: string;
  groupId: string;
  oneTrustId: string;
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: string;
      disableCookiesUsage: boolean;
      autoTrackPageVisitTime: boolean;
    };
    consent: boolean;
    enableGlobalErrorHandler: boolean;
    enableNgrxMetaReducer: boolean;
    ngrxIgnorePattern: string[];
  };
}
