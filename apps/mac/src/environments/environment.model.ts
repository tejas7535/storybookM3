export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  azureTenantId: string;
  azureClientId: string;
  appId: string;
  baseUrl: string;
  envName: string;
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
  internalUserCheckURL: string;
}
