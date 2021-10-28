// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'd8bf880a-2d95-4358-a846-b2ca465c9e06',
  appScope: 'api://2d05baed-6678-4607-a84e-42301ff9f56f/cdbaapi',
  envName: 'https://cdba-d.dev.dp.schaeffler (dev)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '318b42fa-c3fe-408c-83d3-8add18bbe8e9',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
  scrambleMaterialIds: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
