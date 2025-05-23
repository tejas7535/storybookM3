// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  bearinxApiBaseUrl: 'https://bearinx-d.schaeffler.com/mounting/api',
  baseUrl: 'https://bearinx-d.schaeffler.com/mounting/api/v2/mountingmanager',
  staticStorageUrl: 'https://frontend1apps.z1.web.core.windows.net',
  assetsPath: 'http://localhost:8000/assets',
  oneTrustId: '8305e043-6459-42a3-8eae-82173d4456d6-test',
  oneTrustMobileStorageLocation: 'cdn.cookielaw.org',
  oneTrustAndroidId: '01912d27-3de3-76d5-89e4-e27b52d60db6-test',
  oneTrustiOSId: '01912d4d-5a3f-78d1-bcef-498bb493f41a-test',
  oneTrustAndroidFirebaseCategoryId: '0190a6df-479e-733f-8b9f-fdaf88a8cc34',
  oneTrustiOSFirebaseCategoryId: '0190a6ed-ae99-750d-a458-b4c746cc8ae0',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '1c13d904-fb90-4598-82b4-ebba31a8e172',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  internalDetectionUrl:
    'https://bearinxfeinternalcheck.blob.core.windows.net/internal/access.json',
  productImageUrl:
    'https://engineeringapps-d.dev.dp.schaeffler/mounting/getProductImages',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
