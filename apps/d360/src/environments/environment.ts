// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentEnum } from '../app/shared/models/environment-enum';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  enableMsalLogger: false,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '07adc052-926e-4f07-9603-84d2be66473f',
  appScope: 'https://worksite.onmicrosoft.com/SG_D360_API_P/user_impersonation',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '4153f568-d44f-4c35-9fbf-14efe39dcfa6',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
  environment: EnvironmentEnum.prod,
  apiUrl: 'api/',
};
