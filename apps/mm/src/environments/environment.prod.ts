import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  baseUrl: 'https://mountingmanager-cae.schaeffler.com/api/v1',
  reportSelector: 'body',
  oneTrustId: '3496b347-7944-4e06-acdf-6d1daa0eb70b',
  preflightPath: 'bearing-preflight',
  materialsPath: 'materialdata/id/',
  bearingRelationsPath: 'bearing-relations/',
  bearingCalculationPath: 'bearing-calculation',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'cfecb843-072b-4edf-9c7d-2b52d7309d6d',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
