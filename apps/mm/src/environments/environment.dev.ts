import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://bearinx-d.schaeffler.com/mounting/api/v1',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  reportSelector: '.content',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6-test',
  preflightPath: 'bearing-preflight',
  materialsPath: 'materialdata/id/',
  bearingRelationsPath: 'bearing-relations/',
  bearingCalculationPath: 'bearing-calculation',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '1c13d904-fb90-4598-82b4-ebba31a8e172',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
