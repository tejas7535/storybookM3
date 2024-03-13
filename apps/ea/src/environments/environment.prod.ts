import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  catalogApiBaseUrl: 'https://bearinx.schaeffler.com/catalogue/api',
  frictionApiBaseUrl: 'https://bearinx-d.schaeffler.com/co_api', // TODO change to prod url once both bearinx systems are live and the app is about to be released
  co2UpstreamApiBaseUrl: 'https://co2-api.dp.schaeffler/api',
  calculationModuleInfoApiBaseUrl:
    'https://bearinx.schaeffler.com/moduleinfo/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  oldUIFallbackUrl: 'https://bearinx.schaeffler.com/catalogue/app/loadcases/',
  tenantId: '035a32aa-f517-4698-a818-e756af53c99e',
  groupId: 'c4c115f9-a73a-4761-a7d1-daa07e6deda1',
  assetsPath: 'https://medias-easycalc.com/assets',
  oneTrustId: '018e319b-539e-71d4-81ef-009e587d0bf9',
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
};
