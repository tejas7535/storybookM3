import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '3ecfa7b3-44c9-4c34-819c-9a64d9ca936b',
  appScope: 'api://08db73dd-5b75-443f-a496-7aa854712bfa/iaapi',

  // Cookie Consent Banner
  oneTrustId: '2cab6a69-24fd-46d7-9786-3abbd2d39321',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '5b74a960-030c-4dfc-a267-be3accb26a9d',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
