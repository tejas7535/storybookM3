export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;

  // AAD auth
  tenantId: string;
  clientId: string;
  appScope: string;

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: string;
      disableCookiesUsage: boolean;
      autoTrackPageVisitTime: boolean;
    };
    enableGlobalErrorHandler: boolean;
    enableNgrxMetaReducer: boolean;
    ngrxIgnorePattern: string[];
  };
}
