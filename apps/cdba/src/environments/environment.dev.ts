import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '51f2f727-4b31-411f-b78b-e80b9a8930e9', // SG_SSO_CDBA_D
  appScope: 'https://SG_SSO_CDBA_API_D/cdba-api',
  envName: 'https://cdba-d.dev.dp.schaeffler (dev)',
  oneTrustId: '6899f7dc-2625-44c5-bea0-46b362db7b5d',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '318b42fa-c3fe-408c-83d3-8add18bbe8e9',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
