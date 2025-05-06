import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  assetsPath:
    'https://lubricator-selection-assistant-d.dev.dp.schaeffler/assets',
  lsaApiBaseUrl:
    'https://lubricator-selection-assistant-d.dev.dp.schaeffler/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  showDebugJson: true,
  enablePDFDownload: true,
};
