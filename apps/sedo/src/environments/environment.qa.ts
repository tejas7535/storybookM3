import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ef12a4e9-3c7b-4821-9530-3a522dd98b76',
  appScope: 'api://2f1009c7-e98c-4710-a40d-0478c4e48e5f/seliapi',
  apiBaseUrl: '/api/v1',
  baseUrl: 'https://sedo.de-q.aks.schaeffler.com',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '6997f2e2-abcf-49a5-99ee-c8a2f1729c7a',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
