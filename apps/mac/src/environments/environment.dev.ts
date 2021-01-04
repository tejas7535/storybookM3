export const environment = {
  production: false,
  devToolsEnabled: true,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '3e187b5d-2c84-4287-8d6c-d6167c2a07d4',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'a9d73f13-6b7a-4dae-bac6-d41930e6c311',
      isCookieUseDisabled: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
