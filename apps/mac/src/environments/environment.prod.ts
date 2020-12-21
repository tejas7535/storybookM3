export const environment = {
  production: true,
  devToolsEnabled: false,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '318207cf-2b4e-43a9-9281-bf1dafae35c0',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '6ee4d547-ad4b-4bec-b962-ee547a1d690f',
      isCookieUseDisabled: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
