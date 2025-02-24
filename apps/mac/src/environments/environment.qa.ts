import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: 'd4fa5085-89b2-4e17-b226-633e5048a932', // SG_MAC_Q
  appId: 'api://d7b55d07-470d-4483-a4de-524bbe21f2a5/macapi', // SG_MAC_Q_API
  baseUrl: 'https://materials-app-center-q.dev.dp.schaeffler',
  envName: 'env.qaSystem',
  oneTrustId: 'f9014e2c-8a6f-4f8b-8b31-d767dfe8d356',
  applicationInsights: {
    applicationInsightsConfig: {
      connectionString:
        'InstrumentationKey=cf323a1d-5c30-4f9c-8e92-5a3c1473bd8a;IngestionEndpoint=https://westeurope-4.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/;ApplicationId=874a9a32-e045-4e58-8b4a-6f31b4ee6f6b',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*', '.*\\[ai_ignore\\].*'],
  },
  internalUserCheckURL:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
};
