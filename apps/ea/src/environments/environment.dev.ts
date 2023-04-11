import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  catalogBaseUrl: 'https://caeonlinecalculation.schaeffler.com/CatalogWebApi',
  co2BaseUrl:
    'https://caeonlinecalculation-d.schaeffler.com/CO2Calculator.WebApi',
  tenantId: 'c6bd4298-997b-4600-a90a-1adb997581b7',
  groupId: '111ab140-8e82-4ac4-a424-81edf0167301',
  translationPath: 'https://engineeringapp-d.dev.dp.schaeffler/assets/i18n/',
};
