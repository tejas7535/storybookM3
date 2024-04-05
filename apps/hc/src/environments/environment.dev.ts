import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
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
};
