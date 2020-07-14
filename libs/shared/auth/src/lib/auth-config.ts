import { AzureConfig, FlowType } from './models';

const origin = window.location.origin;

export const getAuthConfig = ({
  tenantId,
  clientId,
  appId,
  flow,
  showDebugInfo,
  loginUrl,
}: AzureConfig) => ({
  issuer: `${loginUrl}${tenantId}/v2.0`,
  tokenEndpoint: `${loginUrl}${tenantId}/oauth2/v2.0/token`,
  loginUrl: `${loginUrl}${tenantId}/oauth2/v2.0/authorize`,
  logoutUrl: `${loginUrl}${tenantId}/oauth2/v2.0/logout`,
  redirectUri: `${origin}/index.html`,
  silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
  silentRefreshTimeout: 1000,
  // timeoutFactor:0, good for testing
  useSilentRefresh: flow === FlowType.IMPLICIT_FLOW,
  postLogoutRedirectUri: origin,
  clientId: `${clientId}`,
  scope: `openid profile email ${
    flow === FlowType.CODE_FLOW ? 'offline_access' : ''
  } ${appId}`,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  skipIssuerCheck: true,
  responseType: flow === FlowType.IMPLICIT_FLOW ? 'id_token token' : 'code',
  clearHashAfterLogin: false,
  disableAtHashCheck: true,
  showDebugInformation: showDebugInfo,
});
