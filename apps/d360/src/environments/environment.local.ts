import { EnvironmentEnum } from '../app/shared/models/environment-enum';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  enableMsalLogger: false,

  qualtricsQuestionnaireUrl:
    'https://schaefflertech.qualtrics.com/jfe/form/SV_cvzdQ4bTLVY8EKy',

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '67cdfe6a-e508-419c-9390-49bc6b53f3b5',
  appScope: 'https://worksite.onmicrosoft.com/SG_D360_API_Q/user_impersonation',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '6d6a58e4-355d-4601-acfb-7e2f1ca31066',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.local,
  apiUrl: 'api/',
};
