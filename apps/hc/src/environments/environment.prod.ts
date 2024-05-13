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
  authentication: {
    tenantId: '67416604-6509-4014-9859-45e709f53d3f',
    clientId: '318207cf-2b4e-43a9-9281-bf1dafae35c0',
    appScope: 'api://82e144ec-5abe-4912-b6b4-34e7a22a8e24/macapi',
  },
};
