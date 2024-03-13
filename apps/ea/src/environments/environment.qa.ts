import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  catalogApiBaseUrl: 'https://bearinx-q.schaeffler.com/catalogue/api',
  frictionApiBaseUrl: 'https://bearinx-d.schaeffler.com/co_api',
  co2UpstreamApiBaseUrl: 'https://co2-api-q.dev.dp.schaeffler/api',
  calculationModuleInfoApiBaseUrl:
    'https://bearinx-q.schaeffler.com/moduleinfo/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  oldUIFallbackUrl: 'https://bearinx-q.schaeffler.com/catalogue/app/loadcases/',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  assetsPath: 'https://medias-easycalc-q.dev.dp.schaeffler/assets',
  oneTrustId: '018e36e8-e245-766d-a1ad-be441da6c8aa',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '3d8a728a-165f-4dfa-bb4c-670ebd88c0e6',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
};
