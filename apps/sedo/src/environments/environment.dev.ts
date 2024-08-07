import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '523ef18f-b9af-480d-bf60-7b973a6b18de',
  appScope: 'api://a09b87cc-978e-410b-b23f-ddb557eab85a/seliapi',
  apiBaseUrl: '/api/v1',
  baseUrl: 'https://sedo.de-d.aks.schaeffler.com',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'c43de13d-2977-4ea9-b241-4cd1da1583dd',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
