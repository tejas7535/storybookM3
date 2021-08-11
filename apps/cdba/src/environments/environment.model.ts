export interface Environment {
  production: boolean;
  devToolsEnabled: boolean;
  tenantId: string;
  clientId: string;
  appScope: string;
  baseUrl: string;
  envName: string;
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
  scrambleMaterialIds?: boolean;
}
