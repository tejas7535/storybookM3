import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  localDev: false,
  devToolsEnabled: false,
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '9cb9acbc-986b-483a-bd46-964628cc497f', // SG_CDBA_P
  appScope: 'api://5911691d-b29f-40bc-ab05-0b67f5b256cf/cdbaapi', // SG_CDBA_P_API
  envName: 'https://cdba.dp.schaeffler (prod)',
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: 'd3f24b00-e8c7-4e5c-99c9-4a4f4f8d1e6d',
      disableCookiesUsage: true,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*', 'Auth\b*'],
  },
};
