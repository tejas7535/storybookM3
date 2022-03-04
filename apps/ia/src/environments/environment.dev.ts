import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ec90df0f-30ee-4e9a-9819-3b417a33fb0b',
  appScope: 'api://66242454-50b0-4f97-b6de-7e8859b07f72/iaapi',

  // Cookie Consent Banner
  oneTrustId: 'd4037cc8-fe58-4493-9189-9853fa0c3661',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '4f609835-6ceb-4d56-88c9-7c6a50c4e521',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
