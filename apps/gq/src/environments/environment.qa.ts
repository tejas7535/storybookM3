import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  clientId: '3d3c5cf5-a4e6-4a86-95db-6eb387d7255f',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://ab371c43-8740-4102-b4ad-f49e68270f1a/gqapi',
  envName: 'https://guided-quoting-q.dev.dp.schaeffler (qa)',
  oneTrustId: '7fcf20e1-1af1-4a3a-b84b-fdca5daf95f4',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '7194543e-f354-4570-aa04-808d2a78b1a3',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
  environment: EnvironmentEnum.qa,
};
