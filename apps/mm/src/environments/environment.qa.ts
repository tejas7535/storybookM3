import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://caeonlinecalculation-q.schaeffler.com/mountingmanager/v1',
  reportSelector: 'body',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6',
  preflightPath: 'bearing-preflight',
  materialsPath: 'materialdata/id/',
  bearingRelationsPath: 'bearing-relations/',
  bearingCalculationPath: 'bearing-calculation',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '3d8a728a-165f-4dfa-bb4c-670ebd88c0e6',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
