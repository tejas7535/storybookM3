export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  baseUrl: string;
  staticStorageUrl: string;
  reportSelector: string;
  oneTrustId: string;
  oneTrustMobileStorageLocation: string;
  oneTrustAndroidId: string;
  oneTrustiOSId: string;
  oneTrustAndroidFirebaseCategoryId: string;
  oneTrustiOSFirebaseCategoryId: string;
  preflightPath: string;
  materialsPath: string;
  bearingRelationsPath: string;
  bearingCalculationPath: string;
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
}
