import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ed9e7187-ba06-4b29-8165-61a507a37730', //SG_SSO_CDBA_Q
  appScope: 'https://SG_SSO_CDBA_API_Q/cdba-api',
  envName: 'https://cdba-q.dev.dp.schaeffler (qa)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '84609bb4-f253-4aee-a145-b00d5c5510cf',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
  scrambleMaterialIds: false,
};
