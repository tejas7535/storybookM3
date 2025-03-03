export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  bearinxApiBaseUrl: string;
  catalogApiBaseUrl: string;
  co2UpstreamApiBaseUrl: string;
  downstreamCo2ApiUrl: string;
  staticStorageUrl: string;
  oldUIFallbackUrl: string;
  tenantId: string;
  oneTrustMobileStorageLocation: string;
  oneTrustAndroidId: string;
  oneTrustiOSId: string;
  oneTrustAndroidFirebaseCategoryId: string;
  oneTrustiOSFirebaseCategoryId: string;
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
