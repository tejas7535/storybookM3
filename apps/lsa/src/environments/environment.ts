// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  assetsPath: '/assets',
  lsaApiBaseUrl:
    'https://lubricator-selection-assistant-d.dev.dp.schaeffler/api',
  // lsaApiBaseUrl: 'http://localhost:3000/api',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  showDebugJson: true,
};
