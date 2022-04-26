// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  devToolsEnabled: true,
  localDev: true,
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: '3e187b5d-2c84-4287-8d6c-d6167c2a07d4', // SG_MAC_D
  appId: 'api://e3624a8e-5b1a-4135-83f3-e7c1fa1993ab/macapi', // SG_MAC_D_API
  baseUrl: 'https://materials-app-center-d.dev.dp.schaeffler',
  envName: 'https://materials-app-center-d.dev.dp.schaeffler (dev)',
  oneTrustId: 'e4d0cd79-e494-42f5-9e9e-c1d7f89782de-test',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'a9d73f13-6b7a-4dae-bac6-d41930e6c311',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*', '.*\\[ai_ignore\\].*'],
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
