import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'c25ca723-5508-4ae7-8321-90f72becd67e',
  appScope:
    'https://worksite.onmicrosoft.com/SG_SSO_IA_API_Q/user_impersonation',

  // Cookie Consent Banner
  oneTrustId: '96dcf6fa-e306-4146-9123-09c576fb108a',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'd8be6f60-9a77-49c1-b286-f0f112c672c7',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.dev,
};
