import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'd4931257-be60-4ac7-81e0-1c17049e023b', // SG_SSO_CDBA_P
  appScope: 'https://SG_SSO_CDBA_API_P/cdba-api',
  envName: 'https://cdba.dp.schaeffler (prod)',
  oneTrustId: '83cb5561-0e97-4ff2-a9b3-eff08801068c',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'd3f24b00-e8c7-4e5c-99c9-4a4f4f8d1e6d',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
