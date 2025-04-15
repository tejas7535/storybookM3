export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  bearinxApiBaseUrl: string;
  baseUrl: string;
  staticStorageUrl: string;
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
    enableGlobalErrorHandler: boolean;
    enableNgrxMetaReducer: boolean;
    ngrxIgnorePattern: string[];
    consent: boolean;
  };
  internalDetectionUrl: string;
  productImageUrl: string;
}
