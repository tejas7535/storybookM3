export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  bearinxApiBaseUrl: string;
  baseUrl: string;
  staticStorageUrl: string;
  assetsPath: string;
  internalDetectionUrl: string;
  tenantId: string;
  groupId: string;
  oneTrustId: string;
  oneTrustMobileStorageLocation: string;
  oneTrustAndroidId: string;
  oneTrustiOSId: string;
  oneTrustAndroidFirebaseCategoryId: string;
  oneTrustiOSFirebaseCategoryId: string;
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
  dmcScanEnabled: boolean;
  dmcBackendUrl: string;
  axisOrientationEnabled: boolean;
  showCompactResultToggle: boolean;
}
