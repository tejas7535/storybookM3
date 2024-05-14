import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://hardness-converter-q.dev.dp.schaeffler',
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
    appScope: 'api://d7b55d07-470d-4483-a4de-524bbe21f2a5/macapi',
  },
};
