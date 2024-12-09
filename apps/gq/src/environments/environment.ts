// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: true,
  devToolsEnabled: true,
  clientId: '863a0742-f493-4499-bc30-9c81772fe96a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://acea7ac1-13bb-44b3-be1e-76fc729472be/gqapi',
  envName: 'https://guided-quoting-d.dev.dp.schaeffler (dev)',
  oneTrustId: '769f7370-251f-48bd-abe1-cf7907e49189',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '9a6280ad-3b08-4429-bf4a-541dad9532b8',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    trackPageViewUsingUriAsName: true,
  },
  environment: EnvironmentEnum.dev,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
