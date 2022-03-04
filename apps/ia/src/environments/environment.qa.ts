import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  localDev: false,
  devToolsEnabled: true,

  // AAD auth
  tenantId: '67416604-6509-4014-9859-45e709f53d3f',
  clientId: '1345d78e-c59f-4cf3-9086-69953e8dc995',
  appScope: 'api://54579610-09f1-48ab-83d7-ecfca5ab7436/iaapi',

  // Cookie Consent Banner
  oneTrustId: '96dcf6fa-e306-4146-9123-09c576fb108a',

  // Application Insights
  applicationInsights: {
    applicationInsightsConfig: {
      instrumentationKey: '75985325-98c7-44de-87a5-a6ed270374f0',
      disableCookiesUsage: false,
      autoTrackPageVisitTime: true,
    },
    enableGlobalErrorHandler: true,
    enableNgrxMetaReducer: true,
    ngrxIgnorePattern: ['@ngrx/*'],
    consent: true,
  },
};
