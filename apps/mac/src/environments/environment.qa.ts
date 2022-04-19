import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: 'd4fa5085-89b2-4e17-b226-633e5048a932', // SG_MAC_Q
  appId: 'api://d7b55d07-470d-4483-a4de-524bbe21f2a5/macapi', // SG_MAC_Q_API
  baseUrl: 'https://materials-app-center-q.dev.dp.schaeffler',
  envName: 'https://materials-app-center-q.dev.dp.schaeffler (qa)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'cf323a1d-5c30-4f9c-8e92-5a3c1473bd8a',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*', '.*\\[ai_ignore\\].*'],
  },
};
