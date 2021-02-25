export const environment = {
  production: true,
  clientId: '32067116-57cb-4d52-9a18-89469a076955',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appId: 'api://935a83d6-b953-47bc-af1e-e301629427e6/gqapi',
  devToolsEnabled: false,
  baseUrl: '/api/v1',
  envName: 'https://guided-quoting.dp.schaeffler (prod)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'fcb2b368-c19b-44ab-a72b-2a58d37ed795',
      isCookieUseDisabled: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
