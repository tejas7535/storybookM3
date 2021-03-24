export const environment = {
  production: false,
  devToolsEnabled: true,

  // HTTP
  baseUrl: '/api/v1',

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '1345d78e-c59f-4cf3-9086-69953e8dc995',
  appScope: 'api://54579610-09f1-48ab-83d7-ecfca5ab7436/iaapi',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '4f609835-6ceb-4d56-88c9-7c6a50c4e521',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
