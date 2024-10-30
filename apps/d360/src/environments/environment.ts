// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentEnum } from '../app/shared/models/environment-enum';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  enableMsalLogger: true,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '07adc052-926e-4f07-9603-84d2be66473f',
  appScope: 'https://worksite.onmicrosoft.com/SG_D360_API_P/user_impersonation',

  // Cookie Consent Banner
  oneTrustId: '62b180ee-8f87-4eba-8890-bc242585ff6d',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'd581edac-1558-4fd6-8062-ead669d064e9',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.dev,
  apiUrl: 'api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
