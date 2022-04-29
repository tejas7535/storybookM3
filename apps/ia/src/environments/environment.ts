// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'a74deac0-1bae-49cf-8793-c8f08f2f3839',
  appScope:
    'https://worksite.onmicrosoft.com/SG_SSO_IA_API_D/user_impersonation',

  // Cookie Consent Banner
  oneTrustId: 'd4037cc8-fe58-4493-9189-9853fa0c3661-test',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '4f609835-6ceb-4d56-88c9-7c6a50c4e521',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
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
