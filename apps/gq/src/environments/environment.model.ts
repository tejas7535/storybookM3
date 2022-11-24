import { EnvironmentEnum } from '../app/shared/models';

export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  tenantId: string;
  clientId: string;
  appScope: string;
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
  environment: EnvironmentEnum;
}
