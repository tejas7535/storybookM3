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
      instrumentationKey: '75985325-98c7-44de-87a5-a6ed270374f0',
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
