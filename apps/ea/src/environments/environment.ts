import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  catalogApiBaseUrl:
    'https://caeonlinecalculation.schaeffler.com/CatalogWebApi',
  frictionApiBaseUrl: 'https://bearinx-d.schaeffler.com/co_api',
  co2UpstreamApiBaseUrl: 'https://co2-api-d.dev.dp.schaeffler/api',
  calculationModuleInfoApiBaseUrl:
    'https://bearinx-d.schaeffler.com/moduleinfo/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  assetsPath: '/assets',
  oneTrustId: '7046149d-287b-4943-823f-02838a51a445-test',
};
