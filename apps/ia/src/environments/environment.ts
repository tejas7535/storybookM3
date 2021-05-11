// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  devToolsEnabled: true,

  // HTTP
  baseUrl: 'http://localhost:8080/api/v1', // using local server
  // baseUrl: 'https://insight-attrition-q.dev.dp.schaeffler/api/v1' // using local dev,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: 'ec90df0f-30ee-4e9a-9819-3b417a33fb0b',
  appScope: 'api://66242454-50b0-4f97-b6de-7e8859b07f72/iaapi',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '4f609835-6ceb-4d56-88c9-7c6a50c4e521',
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
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
