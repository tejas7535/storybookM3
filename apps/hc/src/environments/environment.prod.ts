import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  baseUrl: 'https://materials-app-center.dp.schaeffler',
  internalUserCheckURL:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',

  oneTrustId: 'todo: add oneTrustId here once production is ready',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'cfecb843-072b-4edf-9c7d-2b52d7309d6d',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
