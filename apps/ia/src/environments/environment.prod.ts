export const environment = {
  production: true,
  devToolsEnabled: false,

  // HTTP
  baseUrl: '/api/v1',

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '3ecfa7b3-44c9-4c34-819c-9a64d9ca936b',
  appScope: 'api://08db73dd-5b75-443f-a496-7aa854712bfa/iaapi',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '5b74a960-030c-4dfc-a267-be3accb26a9d',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
