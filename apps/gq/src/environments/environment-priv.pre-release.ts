import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  clientId: 'e9fb595d-79b2-47c1-b421-9fbbcd24d58a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://e7a6c97c-19b8-4b2b-b9f8-c832025a78b4/gqapi',
  envName: 'https://guided-quoting.de-q-1.aks.schaeffler.com (pre-release)',
  oneTrustId: '0193d3bd-5d25-772f-83bd-8b252a6b2a04',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '87038c0e-898e-40bc-9536-9adfea25edee',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    trackPageViewUsingUriAsName: true,
  },
  environment: EnvironmentEnum['pre-release'],
};
