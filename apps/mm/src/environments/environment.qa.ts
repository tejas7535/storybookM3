export const environment = {
  production: false,
  devToolsEnabled: true,
  baseUrl: 'https://mountingmanager-cae.schaeffler.com/api/v1',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6-test',
  preflightPath: 'bearing-preflight',
  materialsPath: 'materialdata/id/',
  bearingRelationsPath: 'bearing-relations/',
  bearingCalculationPath: 'bearing-calculation',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '3d8a728a-165f-4dfa-bb4c-670ebd88c0e6',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
