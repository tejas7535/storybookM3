import { EnvironmentEnum } from '../app/shared/models';
import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  clientId: '32067116-57cb-4d52-9a18-89469a076955',
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  appScope: 'api://935a83d6-b953-47bc-af1e-e301629427e6/gqapi',
  envName: 'https://guided-quoting.dp.schaeffler (prod)',
  oneTrustId: '46a42e7c-daca-40b2-845a-5ea5828bdd6e',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'fcb2b368-c19b-44ab-a72b-2a58d37ed795',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    consent: true,
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
  },
  environment: EnvironmentEnum.prod,
};
