import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '318207cf-2b4e-43a9-9281-bf1dafae35c0', // SG_MAC_P
  appId: 'api://82e144ec-5abe-4912-b6b4-34e7a22a8e24/macapi', // SG_MAC_P_AP
  baseUrl: 'https://materials-app-center.dp.schaeffler',
  envName: ' https://materials-app-center.dp.schaeffler (prod)',
  oneTrustId: 'ab9a86f7-d72b-4b88-9ea0-d37be5e09aab',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '6ee4d547-ad4b-4bec-b962-ee547a1d690f',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*', '.*\\[ai_ignore\\].*'],
  },
};
