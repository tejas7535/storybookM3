import { EnvironmentEnum } from '../app/shared/models/environment-enum';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  enableMsalLogger: false,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '67cdfe6a-e508-419c-9390-49bc6b53f3b5',
  appScope: 'https://worksite.onmicrosoft.com/SG_D360_API_Q/user_impersonation',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '2b65c0bd-3bc2-4922-9a0a-7880dc647e7c',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.qa,
  apiUrl: 'api/',
};
