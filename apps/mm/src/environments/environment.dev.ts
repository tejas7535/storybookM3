import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  bearinxApiBaseUrl: 'https://bearinx-d.schaeffler.com/api',
  baseUrl: 'https://bearinx-d.schaeffler.com/mounting/api/v2/mountingmanager',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6-test',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '01912d27-3de3-76d5-89e4-e27b52d60db6-test',
  oneTrustiOSId: '01912d4d-5a3f-78d1-bcef-498bb493f41a-test',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
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
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  productImageUrl:
    'https://engineeringapps-d.dev.dp.schaeffler/mounting/getProductImages',
};
