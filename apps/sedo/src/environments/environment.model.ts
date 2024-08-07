export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  tenantId: string;
  clientId: string;
  appScope: string;
  apiBaseUrl: string;
  baseUrl: string;
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
