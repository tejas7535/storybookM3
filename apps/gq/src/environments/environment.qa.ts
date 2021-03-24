export const environment = {
  production: false,
  clientId: '3d3c5cf5-a4e6-4a86-95db-6eb387d7255f',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appId: 'api://ab371c43-8740-4102-b4ad-f49e68270f1a/gqapi',
  devToolsEnabled: true,
  baseUrl: '/api/v1',
  envName: 'https://guided-quoting-q.dev.dp.schaeffler (qa)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '7194543e-f354-4570-aa04-808d2a78b1a3',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
