export const environment = {
  production: false,
  clientId: '863a0742-f493-4499-bc30-9c81772fe96a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appId: 'api://acea7ac1-13bb-44b3-be1e-76fc729472be/gqapi',
  devToolsEnabled: true,
  baseUrl: '/api/v1',
  envName: 'https://guided-quoting-d.dev.dp.schaeffler (dev)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'f05bb411-2544-4614-816c-ba9f772dd3b0',
      isCookieUseDisabled: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
