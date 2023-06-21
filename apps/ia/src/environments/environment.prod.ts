import { Environment } from './environment.model';
import { EnvironmentEnum } from '../app/shared/models';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'c22f5301-4349-4c60-81ba-54f8e2c17971',
  appScope:
    'https://worksite.onmicrosoft.com/SG_SSO_IA_API_P/user_impersonation',

  // Cookie Consent Banner
  oneTrustId: '2cab6a69-24fd-46d7-9786-3abbd2d39321',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '5b74a960-030c-4dfc-a267-be3accb26a9d',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.prod,
};
