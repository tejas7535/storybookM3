import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  clientId: '863a0742-f493-4499-bc30-9c81772fe96a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://acea7ac1-13bb-44b3-be1e-76fc729472be/gqapi',
  envName: 'https://guided-quoting.de-d.aks.schaeffler.com (dev)',
  oneTrustId: '0193d3c0-cf2e-78fd-98c3-66b2616956dc',
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
