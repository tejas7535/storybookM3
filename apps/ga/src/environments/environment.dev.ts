import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  baseUrl: 'https://bearinx-d.schaeffler.com/grease_api/v1.3/greaseservice',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  oneTrustId: 'dee97f13-442a-41ec-aea5-0dbd09b754bf-test',
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
};
