export const environment = {
  production: false,
  devToolsEnabled: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '9b41cee5-3a94-45cb-b36f-35d748d9c0bf', // SG_CDBA_Q
  appId: 'api://653310f5-aeab-47f6-ae89-69f1211ffee3/cdbaapi', // SG_CDBA_Q_API
  baseUrl: '/api/v1',
  envName: 'https://cdba-q.dev.dp.schaeffler (qa)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '84609bb4-f253-4aee-a145-b00d5c5510cf',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
