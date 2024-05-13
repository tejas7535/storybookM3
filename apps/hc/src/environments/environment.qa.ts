import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://materials-app-center-q.dev.dp.schaeffler',
  internalUserCheckURL:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  oneTrustId: '018eadf6-c34b-7f32-be3f-42f360528c8d',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '3d8a728a-165f-4dfa-bb4c-670ebd88c0e6d',
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
    clientId: 'd4fa5085-89b2-4e17-b226-633e5048a932',
    appScope: 'api://e3624a8e-5b1a-4135-83f3-e7c1fa1993ab/macapi',
  },
};
