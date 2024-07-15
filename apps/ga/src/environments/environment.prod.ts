import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  baseUrl: 'https://bearinx.schaeffler.com/grease_api/v1.3/greaseservice',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  tenantId: '035a32aa-f517-4698-a818-e756af53c99e',
  groupId: 'c4c115f9-a73a-4761-a7d1-daa07e6deda1',
  oneTrustId: 'a3bfa9ba-5b96-461d-ab88-62efed434c87',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '019010dc-8b02-7843-bd70-263e1662cb8b',
  oneTrustiOSId: '01901633-b3a9-72f6-9984-e8740588b277',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'cfecb843-072b-4edf-9c7d-2b52d7309d6d',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
  dmcScanEnabled: false,
};
