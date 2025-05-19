import { CustomProps } from '@schaeffler/application-insights';
import { EnvironmentEnum } from '../app/shared/models';

export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  tenantId: string;
  clientId: string;
  appScope: string;
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
    trackPageViewUsingUriAsName: boolean;
    customProps: CustomProps;
  };
  environment: EnvironmentEnum;
}
