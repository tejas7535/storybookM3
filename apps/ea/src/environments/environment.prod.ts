import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  catalogApiBaseUrl: 'https://bearinx-d.schaeffler.com/catalogue/api',
  frictionApiBaseUrl: 'https://bearinx-d.schaeffler.com/co_api', // TODO use prod url in final deployment
  co2UpstreamApiBaseUrl: 'https://co2-api.dp.schaeffler/api',
  calculationModuleInfoApiBaseUrl:
    'https://bearinx-d.schaeffler.com/moduleinfo/api', // TODO
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  tenantId: '035a32aa-f517-4698-a818-e756af53c99e',
  groupId: 'c4c115f9-a73a-4761-a7d1-daa07e6deda1',
  assetsPath: 'https://engineeringapp.com/assets',
  oneTrustId: '39ed6ec5-7a45-4732-80c8-cfe75986abc4',
};
