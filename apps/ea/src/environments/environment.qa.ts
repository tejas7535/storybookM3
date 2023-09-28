import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  catalogApiBaseUrl:
    'https://caeonlinecalculation.schaeffler.com/CatalogWebApi',
  frictionApiBaseUrl: 'https://bearinx-d.schaeffler.com/co_api',
  co2UpstreamApiBaseUrl: 'https://co2-api-q.dev.dp.schaeffler/api',
  calculationModuleInfoApiBaseUrl:
    'https://bearinx-d.schaeffler.com/moduleinfo/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  assetsPath: 'https://engineeringapp-q.dev.dp.schaeffler/assets',
  oneTrustId: '3a469db6-83fa-4b5f-9231-f96928c037b5',
};
