// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SERVER_URL_PREDICTION:
    'https://lifetime-predictor-d.dev.dp.schaeffler/ml-prediction/api',
  SERVER_URL_LOADS: 'https://lifetime-predictor-d.dev.dp.schaeffler/loads/api',
  SERVER_URL_STATISTICAL:
    'https://lifetime-predictor-d.dev.dp.schaeffler/statistical/api',
  azureTenantId: '67416604-6509-4014-9859-45e709f53d3f',
  azureClientId: 'a709aacf-3a98-4e66-9472-316a0e43eab6',
  authScope:
    'openid profile email api://8df1bcf5-7a2a-4a05-9ebc-fcf471c5fc5f/lifetime-prediction',
  apiBaseUrl: '',
  accessRole: 'LTP_ACCESS_D',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
