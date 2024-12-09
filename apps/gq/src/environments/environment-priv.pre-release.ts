import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  clientId: '3d3c5cf5-a4e6-4a86-95db-6eb387d7255f',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://ab371c43-8740-4102-b4ad-f49e68270f1a/gqapi',
  envName: 'https://guided-quoting.de-q-1.aks.schaeffler.com (pre-release)',
  oneTrustId: '01909c11-f004-7794-a10a-ee843a798ffc',
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
