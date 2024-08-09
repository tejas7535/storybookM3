import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://bearinx-d.schaeffler.com/mounting/api/v1',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  reportSelector: '.content',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '01912d27-3de3-76d5-89e4-e27b52d60db6-test',
  oneTrustiOSId: '01912d4d-5a3f-78d1-bcef-498bb493f41a-test',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
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
