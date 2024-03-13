export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  catalogApiBaseUrl: string;
  frictionApiBaseUrl: string;
  co2UpstreamApiBaseUrl: string;
  calculationModuleInfoApiBaseUrl: string;
  staticStorageUrl: string;
  oldUIFallbackUrl: string;
  tenantId: string;
  groupId: string;
  assetsPath: string;
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
