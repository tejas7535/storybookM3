// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  clientId: '863a0742-f493-4499-bc30-9c81772fe96a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://acea7ac1-13bb-44b3-be1e-76fc729472be/gqapi',
  baseUrl: 'http://localhost:8080/api/v1', // using local server
  // baseUrl: 'https://guided-quoting-d.dev.dp.schaeffler/api/v1', // using dev env,
  envName: 'https://guided-quoting-d.dev.dp.schaeffler (dev)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'f05bb411-2544-4614-816c-ba9f772dd3b0',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
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
