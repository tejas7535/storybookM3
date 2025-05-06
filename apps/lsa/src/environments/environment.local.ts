import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  assetsPath: 'http://localhost:8000/assets',
  // lsaApiBaseUrl: 'http://localhost:3000/api',
  lsaApiBaseUrl:
    'https://lubricator-selection-assistant-d.dev.dp.schaeffler/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  showDebugJson: true,
  enablePDFDownload: true,
};
