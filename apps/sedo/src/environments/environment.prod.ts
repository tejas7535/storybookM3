import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ca5945c1-e722-45af-9668-bd72c1ebdf00',
  appScope: 'api://c2fbf9c3-e2f9-48a3-8483-57d946908949/seliapi',
  apiBaseUrl: '/api/v1',
  baseUrl: 'https://sedo.de.aks.schaeffler.com',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '5f7b3faf-e565-4872-ba33-5e43b14f2f40',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
