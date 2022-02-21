export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  baseUrl: string;
  tenantId: string;
  groupId: string;
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
