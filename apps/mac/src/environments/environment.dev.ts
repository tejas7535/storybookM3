import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '3e187b5d-2c84-4287-8d6c-d6167c2a07d4', // SG_MAC_D
  appId: 'api://e3624a8e-5b1a-4135-83f3-e7c1fa1993ab/macapi', // SG_MAC_D_API
  baseUrl: 'https://materials-app-center-d.dev.dp.schaeffler',
  envName: 'https://materials-app-center-d.dev.dp.schaeffler (dev)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'a9d73f13-6b7a-4dae-bac6-d41930e6c311',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*', '.*\\[ai_ignore\\].*'],
  },
};
