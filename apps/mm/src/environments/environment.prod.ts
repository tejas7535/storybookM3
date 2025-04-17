import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  bearinxApiBaseUrl: 'https://mountingmanager-cae.schaeffler.com/mounting/api',
  baseUrl: 'https://mountingmanager-cae.schaeffler.com/api/v1',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  oneTrustId: '56bbef2e-9bc2-43ca-bcd8-edf6d40aa44f',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '01912d27-3de3-76d5-89e4-e27b52d60db6',
  oneTrustiOSId: '01912d4d-5a3f-78d1-bcef-498bb493f41a',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
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
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  productImageUrl:
    'https://engineeringapps.dp.schaeffler/mounting/getProductImages',
};
