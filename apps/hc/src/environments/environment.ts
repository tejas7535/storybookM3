import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  baseUrl: 'http://localhost:8080',
  internalUserCheckURL:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  oneTrustId: '018ead92-22a1-7a6d-86b9-f2b36f79927e-test',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '1c13d904-fb90-4598-82b4-ebba31a8e172',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
  authentication: {
    tenantId: '67416604-6509-4014-9859-45e709f53d3f',
    clientId: '3e187b5d-2c84-4287-8d6c-d6167c2a07d4',
    appScope: 'api://e3624a8e-5b1a-4135-83f3-e7c1fa1993ab/macapi',
  },
};
