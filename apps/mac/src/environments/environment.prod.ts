export const environment = {
  production: true,
  devToolsEnabled: false,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '318207cf-2b4e-43a9-9281-bf1dafae35c0', //SG_MAC_P
  appId: 'api://82e144ec-5abe-4912-b6b4-34e7a22a8e24/macapi', //SG_MAC_P_API
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
