import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  baseUrl: 'https://bearinx-d.schaeffler.com/grease_api/v1.3/greaseservice',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  oneTrustId: 'dee97f13-442a-41ec-aea5-0dbd09b754bf-test',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '019010dc-8b02-7843-bd70-263e1662cb8b-test',
  oneTrustiOSId: '01901633-b3a9-72f6-9984-e8740588b277-test',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '1c13d904-fb90-4598-82b4-ebba31a8e172',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
  dmcScanEnabled: true,
  dmcBackendUrl: 'https://engineeringapps-d.dev.dp.schaeffler',
};
