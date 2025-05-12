import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,
  clientId: 'e9fb595d-79b2-47c1-b421-9fbbcd24d58a',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://e7a6c97c-19b8-4b2b-b9f8-c832025a78b4/gqapi',
  envName: 'https://guided-quoting-q-1.dev.dp.schaeffler (pre-release)',
  oneTrustId: '01909c11-f004-7794-a10a-ee843a798ffc',
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
    trackPageViewUsingUriAsName: true,
  },
  environment: EnvironmentEnum['pre-release'],
};
